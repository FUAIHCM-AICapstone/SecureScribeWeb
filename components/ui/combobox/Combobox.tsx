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
import Avatar from '../Avatar';

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

export interface ComboboxOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    avatar?: {
        name?: string;
        image?: string;
        icon?: React.ReactNode;
        size?: 'small' | 'medium' | 'large' | 'extra-large';
        shape?: 'circular' | 'square';
    };
    badge?: {
        status?: 'available' | 'away' | 'busy' | 'do-not-disturb' | 'offline' | 'out-of-office' | 'unknown';
        outOfOffice?: boolean;
        icon?: React.ReactNode;
        content?: React.ReactNode;
    };
    description?: string;
    disabled?: boolean;
    group?: string;
}

export interface ComboboxGroup {
    label: string;
    children: ComboboxOption[];
}

interface ComboboxProps {
    label?: string;
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    options?: (ComboboxOption | ComboboxGroup)[];
    multiselect?: boolean;
    freeform?: boolean;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    hint?: string;
    size?: 'small' | 'medium' | 'large';
    appearance?: 'outline' | 'underline' | 'filled-lighter' | 'filled-darker';
    positioning?: 'above' | 'below';
    clearable?: boolean;
    customFilter?: (query: string, option: ComboboxOption) => boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
}

const Combobox: React.FC<ComboboxProps> = ({
    label,
    placeholder = "Select an option",
    value,
    defaultValue,
    onChange,
    options = [],
    multiselect = false,
    freeform = false,
    disabled = false,
    required = false,
    error,
    hint,
    size = 'medium',
    appearance = 'outline',
    positioning = 'below',
    clearable = false,
    customFilter,
    onOpenChange,
    className,
}) => {
    const styles = useStyles();
    const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    // Flatten options for easier processing
    const flatOptions = useMemo(() => {
        const result: ComboboxOption[] = [];
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
        const groups: { [key: string]: ComboboxOption[] } = {};
        const ungrouped: ComboboxOption[] = [];

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
    const filteredOptions = useMemo(() => {
        if (!query && !customFilter) return flatOptions;

        return flatOptions.filter(option => {
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
    }, [query, flatOptions, customFilter]);

    // Group filtered options
    const filteredGroupedOptions = useMemo(() => {
        const groups: { [key: string]: ComboboxOption[] } = {};
        const ungrouped: ComboboxOption[] = [];

        filteredOptions.forEach(option => {
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
    }, [filteredOptions]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setQuery(newValue);

        // Handle clear functionality (when value becomes empty)
        if (newValue === '') {
            if (multiselect) {
                setSelectedValues([]);
                onChange?.('');
            } else {
                setSelectedValue('');
                onChange?.('');
            }
            return;
        }

        // For multiselect, don't update selectedValues from input changes
        // Only update when options are actually selected/unselected
        if (!multiselect) {
            setSelectedValue(newValue);
            onChange?.(newValue);
        }
    };

    const handleFocus = () => {
        if (multiselect) {
            setQuery(''); // Clear query on focus for multiselect
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
            // Reset value to empty string after selection (following Fluent UI pattern)
            setQuery('');
            onChange?.(newValues.join(', '));
        } else {
            setSelectedValue(optionValue);
            // Clear query after selection to show all options again
            setQuery('');
            onChange?.(optionValue);
        }
    };

    const renderOption = (option: ComboboxOption, index: number) => {
        return (
            <Option
                key={`${option.value}-${index}`}
                text={option.label}
                value={option.value}
                disabled={option.disabled}
            >
                <div className={styles.optionContent}>
                    {/* Display avatar with badge if provided, otherwise fallback to icon */}
                    {option.avatar ? (
                        <div className={styles.optionIcon}>
                            <Avatar
                                name={option.avatar.name}
                                image={option.avatar.image}
                                icon={option.avatar.icon}
                                size={option.avatar.size || 'small'}
                                shape={option.avatar.shape || 'circular'}
                                badge={option.badge}
                            />
                        </div>
                    ) : option.icon ? (
                        <div className={styles.optionIcon}>
                            {option.icon}
                        </div>
                    ) : null}

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
            value={multiselect ? query : selectedValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            size={size}
            appearance={appearance}
            positioning={positioning}
            clearable={clearable}
            onOpenChange={(event, data) => onOpenChange?.(data.open)}
            onOptionSelect={(event, data) => handleOptionSelect(data.optionValue as string)}
            multiselect={multiselect}
            freeform={freeform}
        >
            {/* Render ungrouped options */}
            {(multiselect ? groupedOptions : (query ? filteredGroupedOptions : groupedOptions)).ungrouped.map((option, index) =>
                renderOption(option, index)
            )}

            {/* Render grouped options */}
            {Object.entries((multiselect ? groupedOptions : (query ? filteredGroupedOptions : groupedOptions)).groups).map(([groupName, groupOptions]) => (
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

export default Combobox;
