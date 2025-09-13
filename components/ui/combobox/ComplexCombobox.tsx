"use client";

import React, { useState, useMemo } from 'react';
import {
    Combobox as FluentCombobox,
    Option,
    OptionGroup,
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

export interface ComplexComboboxOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
    disabled?: boolean;
    group?: string;
}

export interface ComplexComboboxGroup {
    label: string;
    children: ComplexComboboxOption[];
}

interface ComplexComboboxProps {
    label?: string;
    placeholder?: string;
    value?: string | string[];
    defaultValue?: string | string[];
    onChange?: (value: string | string[]) => void;
    options: (ComplexComboboxOption | ComplexComboboxGroup)[];
    multiselect?: boolean;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    hint?: string;
    size?: 'small' | 'medium' | 'large';
    appearance?: 'outline' | 'underline' | 'filled-lighter' | 'filled-darker';
    positioning?: 'above' | 'below';
    clearable?: boolean;
    customFilter?: (query: string, option: ComplexComboboxOption) => boolean;
    className?: string;
}

const ComplexCombobox: React.FC<ComplexComboboxProps> = ({
    label,
    placeholder = "Select options",
    value,
    defaultValue,
    onChange,
    options,
    multiselect = false,
    disabled = false,
    required = false,
    error,
    hint,
    size = 'medium',
    appearance = 'outline',
    positioning = 'below',
    clearable = false,
    customFilter,
    className,
}) => {
    const styles = useStyles();
    const [selectedValue, setSelectedValue] = useState(multiselect ? '' : (value as string || defaultValue as string || ''));
    const [selectedValues, setSelectedValues] = useState<string[]>(multiselect ? (value as string[] || defaultValue as string[] || []) : []);
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Flatten options for easier processing
    const flatOptions = useMemo(() => {
        const result: ComplexComboboxOption[] = [];
        options.forEach(option => {
            if ('children' in option) {
                // It's a group
                option.children.forEach(child => {
                    result.push({ ...child, group: option.label });
                });
            } else {
                // It's a regular option
                result.push(option);
            }
        });
        return result;
    }, [options]);

    // Group options by group label
    const groupedOptions = useMemo(() => {
        const groups: { [key: string]: ComplexComboboxOption[] } = {};
        const ungrouped: ComplexComboboxOption[] = [];

        flatOptions.forEach(option => {
            if (option.group) {
                if (!groups[option.group]) {
                    groups[option.group] = [];
                }
                groups[option.group].push(option);
            } else {
                ungrouped.push(option);
            }
        });

        return { groups, ungrouped };
    }, [flatOptions]);

    // Filter options based on query
    const filteredGroupedOptions = useMemo(() => {
        if (!query && !customFilter) return groupedOptions;

        const groups: { [key: string]: ComplexComboboxOption[] } = {};
        const ungrouped: ComplexComboboxOption[] = [];

        const filteredFlat = flatOptions.filter(option => {
            if (customFilter) {
                return customFilter(query, option);
            }

            // Default filter: check if query matches label or description
            const searchText = query.toLowerCase();
            return (
                option.label.toLowerCase().includes(searchText) ||
                (option.description && option.description.toLowerCase().includes(searchText))
            );
        });

        filteredFlat.forEach(option => {
            if (option.group) {
                if (!groups[option.group]) {
                    groups[option.group] = [];
                }
                groups[option.group].push(option);
            } else {
                ungrouped.push(option);
            }
        });

        return { groups, ungrouped };
    }, [query, flatOptions, customFilter, groupedOptions]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setQuery(newValue);

        // Handle clear functionality (when value becomes empty)
        if (newValue === '') {
            if (multiselect) {
                setSelectedValues([]);
                onChange?.([]);
            } else {
                setSelectedValue('');
                onChange?.('');
            }
            return;
        }
    };

    const handleFocus = () => {
        if (multiselect) {
            setQuery(''); // Clear query on focus
            setIsFocused(true);
        }
    };

    const handleBlur = () => {
        if (multiselect) {
            setQuery(selectedValues.join(', ')); // Show selected values on blur
            setIsFocused(false);
        }
    };

    const handleOptionSelect = (optionValue: string) => {
        if (multiselect) {
            const newValues = selectedValues.includes(optionValue)
                ? selectedValues.filter(v => v !== optionValue)
                : [...selectedValues, optionValue];
            setSelectedValues(newValues);
            // Reset value to empty string after selection
            setQuery('');
            onChange?.(newValues);
        } else {
            setSelectedValue(optionValue);
            // Clear query after selection to show all options again
            setQuery('');
            onChange?.(optionValue);
        }
    };

    const renderOption = (option: ComplexComboboxOption, index: number) => {
        const isSelected = multiselect
            ? selectedValues.includes(option.value)
            : selectedValue === option.value;

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

    const currentOptions = multiselect ? groupedOptions : (query ? filteredGroupedOptions : groupedOptions);
    const displayValue = multiselect ? query : (query || (typeof selectedValue === 'string' ? selectedValue : ''));

    const comboboxElement = (
        <FluentCombobox
            className={`${styles.combobox} ${className || ''}`}
            placeholder={placeholder}
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            size={size}
            appearance={appearance}
            positioning={positioning}
            clearable={clearable}
            multiselect={multiselect}
            onOptionSelect={(event, data) => handleOptionSelect(data.optionValue as string)}
        >
            {/* Render ungrouped options */}
            {currentOptions.ungrouped.map((option, index) =>
                renderOption(option, index)
            )}

            {/* Render grouped options */}
            {Object.entries(currentOptions.groups).map(([groupName, groupOptions]) => (
                <OptionGroup key={groupName} label={groupName}>
                    {groupOptions.map((option, index) =>
                        renderOption(option, index)
                    )}
                </OptionGroup>
            ))}
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

export default ComplexCombobox;
