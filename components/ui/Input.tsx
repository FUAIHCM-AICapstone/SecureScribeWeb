import React from 'react';
import { Field, Input as FluentInput, makeStyles, Slot } from '@fluentui/react-components';

const useStyles = makeStyles({
    input: {
        width: '100%',
    },
});

interface InputProps {
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    required?: boolean;
    error?: string;
    hint?: string;
    contentBefore?: Slot<'span'>;
    contentAfter?: Slot<'span'>;
}

const Input: React.FC<InputProps> = ({
    label,
    placeholder,
    value,
    onChange,
    type = 'text',
    size = 'medium',
    disabled = false,
    required = false,
    error,
    hint,
    contentBefore,
    contentAfter,
}) => {
    const styles = useStyles();

    const getSize = () => {
        switch (size) {
            case 'small':
                return 'small';
            case 'large':
                return 'large';
            default:
                return 'medium';
        }
    };

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(ev.target.value);
    };

    const getMaxWidth = size === 'small' ? '15px' : size === 'large' ? '23px' : '19px';
    const getMaxHeight = size === 'small' ? '15px' : size === 'large' ? '23px' : '19px';

    const inputElement = (
        <FluentInput
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            size={getSize()}
            disabled={disabled}
            required={required}
            className={styles.input}
            contentBefore={contentBefore ? React.cloneElement(contentBefore as React.ReactElement, {
                style: { ...((contentBefore as React.ReactElement).props.style || {}), maxWidth: getMaxWidth, maxHeight: getMaxHeight }
            }) : undefined}
            contentAfter={contentAfter ? React.cloneElement(contentAfter as React.ReactElement, {
                style: { ...((contentAfter as React.ReactElement).props.style || {}), maxWidth: getMaxWidth, maxHeight: getMaxHeight }
            }) : undefined}
        />
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
                {inputElement}
            </Field>
        );
    }

    return inputElement;
};

export default Input;
