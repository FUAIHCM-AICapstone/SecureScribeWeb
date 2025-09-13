"use client";

import React, { useState } from 'react';
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
});

export interface BasicComboboxOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

interface BasicComboboxProps {
    label?: string;
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    options: BasicComboboxOption[];
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

const BasicCombobox: React.FC<BasicComboboxProps> = ({
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
    className,
}) => {
    const styles = useStyles();
    const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setSelectedValue(newValue);
        onChange?.(newValue);
    };

    const handleOptionSelect = (optionValue: string) => {
        setSelectedValue(optionValue);
        onChange?.(optionValue);
    };

    const renderOption = (option: BasicComboboxOption, index: number) => (
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
                    {option.label}
                </div>
            </div>
        </Option>
    );

    const comboboxElement = (
        <FluentCombobox
            className={`${styles.combobox} ${className || ''}`}
            placeholder={placeholder}
            value={selectedValue}
            onChange={handleChange}
            disabled={disabled}
            size={size}
            appearance={appearance}
            positioning={positioning}
            clearable={clearable}
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

export default BasicCombobox;
