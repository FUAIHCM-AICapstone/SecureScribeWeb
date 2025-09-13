"use client";

import React, { useState } from 'react';
import {
    Combobox as FluentCombobox,
    Option,
    makeStyles,
    Field,
    tokens,
} from '@fluentui/react-components';
import { Checkmark20Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
    combobox: {
        width: '100%',
    },
    optionContent: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS,
    },
    optionIcon: {
        flexShrink: 0,
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        flex: 1,
    },
    optionDescription: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground3,
        marginTop: '2px',
    },
});

export interface MultiselectComboboxOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
    disabled?: boolean;
}

interface MultiselectComboboxProps {
    label?: string;
    placeholder?: string;
    value?: string[];
    defaultValue?: string[];
    onChange?: (value: string[]) => void;
    options: MultiselectComboboxOption[];
    disabled?: boolean;
    required?: boolean;
    error?: string;
    hint?: string;
    size?: 'small' | 'medium' | 'large';
    appearance?: 'outline' | 'underline' | 'filled-lighter' | 'filled-darker';
    positioning?: 'above' | 'below';
    clearable?: boolean;
    className?: string;
}

const MultiselectCombobox: React.FC<MultiselectComboboxProps> = ({
    label,
    placeholder = "Select multiple options",
    value,
    defaultValue,
    onChange,
    options,
    disabled = false,
    required = false,
    error,
    hint,
    size = 'medium',
    appearance = 'outline',
    positioning = 'below',
    clearable = false,
    className,
}) => {
    const styles = useStyles();
    const [selectedValues, setSelectedValues] = useState<string[]>(value || defaultValue || []);
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setQuery(newValue);

        // Handle clear functionality (when value becomes empty)
        if (newValue === '') {
            setSelectedValues([]);
            onChange?.([]);
            return;
        }
    };

    const handleFocus = () => {
        setQuery(''); // Clear query on focus
        setIsFocused(true);
    };

    const handleBlur = () => {
        setQuery(selectedValues.join(', ')); // Show selected values on blur
        setIsFocused(false);
    };

    const handleOptionSelect = (optionValue: string) => {
        const newValues = selectedValues.includes(optionValue)
            ? selectedValues.filter(v => v !== optionValue)
            : [...selectedValues, optionValue];
        setSelectedValues(newValues);
        // Reset value to empty string after selection
        setQuery('');
        onChange?.(newValues);
    };

    const renderOption = (option: MultiselectComboboxOption, index: number) => {
        const isSelected = selectedValues.includes(option.value);

        return (
            <Option
                key={`${option.value}-${index}`}
                text={option.label}
                value={option.value}
                disabled={option.disabled}
            >
                <div className={styles.optionContent}>
                    <div className={styles.optionIcon}>
                        {isSelected ? <Checkmark20Regular /> : (option.icon || null)}
                    </div>
                    <div className={styles.optionText}>
                        <div>{option.label}</div>
                        {option.description && (
                            <div className={styles.optionDescription}>
                                {option.description}
                            </div>
                        )}
                    </div>
                </div>
            </Option>
        );
    };

    const comboboxElement = (
        <FluentCombobox
            className={`${styles.combobox} ${className || ''}`}
            placeholder={placeholder}
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            size={size}
            appearance={appearance}
            positioning={positioning}
            clearable={clearable}
            multiselect={true}
            onOptionSelect={(event, data) => handleOptionSelect(data.optionValue as string)}
        >
            {options.map((option, index) => renderOption(option, index))}
        </FluentCombobox>
    );

    if (label || error || hint) {
        return (
            <Field
                label={label}
                validationMessage={error}
                hint={hint}
                required={required}
                validationState={error ? 'error' : undefined}
            >
                {comboboxElement}
            </Field>
        );
    }

    return comboboxElement;
};

export default MultiselectCombobox;
