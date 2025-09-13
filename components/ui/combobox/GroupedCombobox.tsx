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

export interface GroupedComboboxOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
    disabled?: boolean;
    group?: string;
}

export interface GroupedComboboxGroup {
    label: string;
    children: GroupedComboboxOption[];
}

interface GroupedComboboxProps {
    label?: string;
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    options: (GroupedComboboxOption | GroupedComboboxGroup)[];
    disabled?: boolean;
    required?: boolean;
    error?: string;
    hint?: string;
    size?: 'small' | 'medium' | 'large';
    appearance?: 'outline' | 'underline' | 'filled-lighter' | 'filled-darker';
    positioning?: 'above' | 'below';
    clearable?: boolean;
    customFilter?: (query: string, option: GroupedComboboxOption) => boolean;
    className?: string;
}

const GroupedCombobox: React.FC<GroupedComboboxProps> = ({
    label,
    placeholder = "Select an option",
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
    customFilter,
    className,
}) => {
    const styles = useStyles();
    const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
    const [query, setQuery] = useState('');

    // Flatten options for easier processing
    const flatOptions = useMemo(() => {
        const result: GroupedComboboxOption[] = [];
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
        const groups: { [key: string]: GroupedComboboxOption[] } = {};
        const ungrouped: GroupedComboboxOption[] = [];

        flatOptions.forEach(option => {
            if ((option as any).group) {
                const groupName = (option as any).group;
                if (!groups[groupName]) {
                    groups[groupName] = [];
                }
                groups[groupName].push(option);
            } else {
                ungrouped.push(option);
            }
        });

        return { groups, ungrouped };
    }, [flatOptions]);

    // Filter options based on query
    const filteredGroupedOptions = useMemo(() => {
        if (!query && !customFilter) return groupedOptions;

        const groups: { [key: string]: GroupedComboboxOption[] } = {};
        const ungrouped: GroupedComboboxOption[] = [];

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
            if ((option as any).group) {
                const groupName = (option as any).group;
                if (!groups[groupName]) {
                    groups[groupName] = [];
                }
                groups[groupName].push(option);
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
            setSelectedValue('');
            onChange?.('');
            return;
        }

        setSelectedValue(newValue);
        onChange?.(newValue);
    };

    const handleOptionSelect = (optionValue: string) => {
        setSelectedValue(optionValue);
        setQuery(''); // Clear query after selection to show all options again
        onChange?.(optionValue);
    };

    const renderOption = (option: GroupedComboboxOption, index: number) => (
        <Option
            key={`${option.value}-${index}`}
            text={option.label}
            value={option.value}
            disabled={option.disabled}
        >
            <div className={styles.optionContent}>
                {option.icon && (
                    <div className={styles.optionIcon}>
                        {option.icon}
                    </div>
                )}
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

    const comboboxElement = (
        <FluentCombobox
            className={`${styles.combobox} ${className || ''}`}
            placeholder={placeholder}
            value={query || selectedValue}
            onChange={handleChange}
            disabled={disabled}
            size={size}
            appearance={appearance}
            positioning={positioning}
            clearable={clearable}
            onOptionSelect={(event, data) => handleOptionSelect(data.optionValue as string)}
        >
            {/* Render ungrouped options */}
            {(query ? filteredGroupedOptions : groupedOptions).ungrouped.map((option, index) =>
                renderOption(option, index)
            )}

            {/* Render grouped options */}
            {Object.entries((query ? filteredGroupedOptions : groupedOptions).groups).map(([groupName, groupOptions]) => (
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

export default GroupedCombobox;
