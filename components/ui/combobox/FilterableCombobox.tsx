"use client";

import React, { useState, useMemo } from 'react';
import {
    Combobox as FluentCombobox,
    Option,
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

export interface FilterableComboboxOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
    disabled?: boolean;
}

interface FilterableComboboxProps {
    label?: string;
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    options: FilterableComboboxOption[];
    disabled?: boolean;
    required?: boolean;
    error?: string;
    hint?: string;
    size?: 'small' | 'medium' | 'large';
    appearance?: 'outline' | 'underline' | 'filled-lighter' | 'filled-darker';
    positioning?: 'above' | 'below';
    clearable?: boolean;
    customFilter?: (query: string, option: FilterableComboboxOption) => boolean;
    className?: string;
}

const FilterableCombobox: React.FC<FilterableComboboxProps> = ({
    label,
    placeholder = "Search and select an option",
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

    // Filter options based on query
    const filteredOptions = useMemo(() => {
        if (!query && !customFilter) return options;

        return options.filter(option => {
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
    }, [query, options, customFilter]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setQuery(newValue);

        // Handle clear functionality (when value becomes empty)
        if (newValue === '') {
            setSelectedValue('');
            setQuery(''); // Also clear query when clearing
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

    const renderOption = (option: FilterableComboboxOption, index: number) => (
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
            {filteredOptions.map((option, index) => renderOption(option, index))}
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

export default FilterableCombobox;
