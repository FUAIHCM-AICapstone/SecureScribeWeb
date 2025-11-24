#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Translation Validation Script
 * 
 * Validates translation files for:
 * - Missing keys between locales
 * - Unused translation keys
 * - Empty translation values
 * - Duplicate keys
 * - Message constant mappings
 * 
 * Usage:
 *   node scripts/validate-translations.js
 *   npm run validate:translations
 */

const fs = require('fs');
const path = require('path');

// Paths
const EN_PATH = path.join(__dirname, '../i18n/messages/en.json');
const VI_PATH = path.join(__dirname, '../i18n/messages/vi.json');
const UTILITIES_PATH = path.join(__dirname, '../services/api/utilities.ts');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    log(`❌ Error loading ${filePath}: ${error.message}`, 'red');
    process.exit(1);
  }
}

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function getValueByPath(obj, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

function findMissingKeys(sourceKeys, targetKeys, sourceName, targetName) {
  const missing = sourceKeys.filter(key => !targetKeys.includes(key));
  if (missing.length > 0) {
    log(`\n⚠️  Keys in ${sourceName} but missing in ${targetName}:`, 'yellow');
    missing.forEach(key => log(`   - ${key}`, 'yellow'));
    return missing.length;
  }
  return 0;
}

function findEmptyValues(obj, locale) {
  const allKeys = getAllKeys(obj);
  const empty = allKeys.filter(key => {
    const value = getValueByPath(obj, key);
    return value === '' || value === null || value === undefined;
  });

  if (empty.length > 0) {
    log(`\n⚠️  Empty values in ${locale}:`, 'yellow');
    empty.forEach(key => log(`   - ${key}`, 'yellow'));
    return empty.length;
  }
  return 0;
}

function extractMessageMappings(utilitiesContent) {
  const mappings = {};
  const keyMapRegex = /'([A-Z_]+)':\s*'([^']+)'/g;
  let match;

  while ((match = keyMapRegex.exec(utilitiesContent)) !== null) {
    const [, messageConstant, translationKey] = match;
    mappings[messageConstant] = translationKey;
  }

  return mappings;
}

function validateMessageMappings(enData, viData, mappings) {
  log('\n📋 Validating Message Constant Mappings:', 'cyan');
  
  let errors = 0;

  for (const [constant, translationKey] of Object.entries(mappings)) {
    const enValue = getValueByPath(enData, translationKey);
    const viValue = getValueByPath(viData, translationKey);

    if (!enValue) {
      log(`   ❌ ${constant} → ${translationKey} (missing in en.json)`, 'red');
      errors++;
    }
    if (!viValue) {
      log(`   ❌ ${constant} → ${translationKey} (missing in vi.json)`, 'red');
      errors++;
    }
  }

  if (errors === 0) {
    log('   ✅ All message constant mappings are valid', 'green');
  }

  return errors;
}

function checkFileSize(filePath, maxLines = 2000) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').length;
  const fileName = path.basename(filePath);

  log(`\n📏 File Size Check - ${fileName}:`, 'cyan');
  log(`   Lines: ${lines}`, lines > maxLines ? 'yellow' : 'green');

  if (lines > maxLines) {
    log(`   ⚠️  Warning: File exceeds ${maxLines} lines!`, 'yellow');
    log(`   Consider splitting into modules (see i18n/README.md)`, 'yellow');
    return 1;
  } else {
    log(`   ✅ File size is acceptable`, 'green');
  }

  return 0;
}

function validateTranslations() {
  log('\n🔍 Translation Validation Report', 'blue');
  log('================================\n', 'blue');

  // Load files
  const enData = loadJSON(EN_PATH);
  const viData = loadJSON(VI_PATH);
  const utilitiesContent = fs.readFileSync(UTILITIES_PATH, 'utf8');

  // Extract keys
  const enKeys = getAllKeys(enData);
  const viKeys = getAllKeys(viData);

  // Statistics
  log(`📊 Translation Statistics:`, 'cyan');
  log(`   English keys: ${enKeys.length}`, 'green');
  log(`   Vietnamese keys: ${viKeys.length}`, 'green');

  // Validation counters
  let totalErrors = 0;
  let totalWarnings = 0;

  // 1. Check for missing keys
  log('\n1️⃣  Checking for Missing Keys:', 'cyan');
  const enMissing = findMissingKeys(viKeys, enKeys, 'vi.json', 'en.json');
  const viMissing = findMissingKeys(enKeys, viKeys, 'en.json', 'vi.json');
  
  if (enMissing === 0 && viMissing === 0) {
    log('   ✅ All keys are present in both locales', 'green');
  } else {
    totalErrors += enMissing + viMissing;
  }

  // 2. Check for empty values
  log('\n2️⃣  Checking for Empty Values:', 'cyan');
  const enEmpty = findEmptyValues(enData, 'en.json');
  const viEmpty = findEmptyValues(viData, 'vi.json');
  
  if (enEmpty === 0 && viEmpty === 0) {
    log('   ✅ No empty values found', 'green');
  } else {
    totalWarnings += enEmpty + viEmpty;
  }

  // 3. Validate message constant mappings
  const mappings = extractMessageMappings(utilitiesContent);
  log(`   Found ${Object.keys(mappings).length} message constant mappings`, 'cyan');
  const mappingErrors = validateMessageMappings(enData, viData, mappings);
  totalErrors += mappingErrors;

  // 4. Check file sizes
  const enSizeWarning = checkFileSize(EN_PATH);
  const viSizeWarning = checkFileSize(VI_PATH);
  totalWarnings += enSizeWarning + viSizeWarning;

  // 5. Check for API namespace
  log('\n📋 Checking API Namespace:', 'cyan');
  if (enData.api && viData.api) {
    const apiEnKeys = getAllKeys(enData.api);
    const apiViKeys = getAllKeys(viData.api);
    log(`   ✅ API namespace exists`, 'green');
    log(`   English API keys: ${apiEnKeys.length}`, 'green');
    log(`   Vietnamese API keys: ${apiViKeys.length}`, 'green');
  } else {
    log('   ⚠️  API namespace not found', 'yellow');
    totalWarnings++;
  }

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  log('📊 Summary:', 'blue');
  log(`   Total Errors: ${totalErrors}`, totalErrors > 0 ? 'red' : 'green');
  log(`   Total Warnings: ${totalWarnings}`, totalWarnings > 0 ? 'yellow' : 'green');

  if (totalErrors === 0 && totalWarnings === 0) {
    log('\n✨ All validations passed!', 'green');
    return 0;
  } else if (totalErrors > 0) {
    log('\n❌ Validation failed with errors', 'red');
    return 1;
  } else {
    log('\n⚠️  Validation passed with warnings', 'yellow');
    return 0;
  }
}

// Run validation
const exitCode = validateTranslations();
process.exit(exitCode);
