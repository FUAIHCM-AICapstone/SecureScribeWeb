"use client";

import { Input } from '@/components/ui';
import { makeStyles } from '@fluentui/react-components';
import { Mail24Regular, NumberSymbol24Regular, Person24Regular, Search24Regular } from '@fluentui/react-icons';
import React, { useState } from 'react';

const useStyles = makeStyles({
    section: { marginBottom: "3rem" },
    sectionTitle: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "1.5rem",
        color: "var(--colorNeutralForeground1)",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "1.5rem",
    },
    demoCard: {
        padding: "1.5rem",
        border: `1px solid var(--colorNeutralStroke1)`,
        borderRadius: "8px",
        backgroundColor: "var(--colorNeutralBackground1)",
    },
    demoTitle: {
        fontSize: "1.125rem",
        fontWeight: 600,
        marginBottom: "1rem",
        color: "var(--colorNeutralForeground1)",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        marginBottom: "1rem",
    },
});

const InputLibrary: React.FC = () => {
    const styles = useStyles();
    const [textValue, setTextValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [numberValue, setNumberValue] = useState('');
    const [urlValue, setUrlValue] = useState('');
    const [telValue, setTelValue] = useState('');
    const [searchValue, setSearchValue] = useState('');

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Inputs</h2>
            <div className={styles.grid}>
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Input Types</h3>
                    <div className={styles.inputGroup}>
                        <Input
                            label="Text Input"
                            placeholder="Enter some text"
                            value={textValue}
                            onChange={setTextValue}
                        />
                        <Input
                            label="Email Input"
                            type="email"
                            placeholder="Enter your email"
                            value={emailValue}
                            onChange={setEmailValue}
                        />
                        <Input
                            label="Password Input"
                            type="password"
                            placeholder="Enter password"
                            value={passwordValue}
                            onChange={setPasswordValue}
                        />
                        <Input
                            label="Number Input"
                            type="number"
                            placeholder="Enter a number"
                            value={numberValue}
                            onChange={setNumberValue}
                        />
                        <Input
                            label="URL Input"
                            type="url"
                            placeholder="Enter a URL"
                            value={urlValue}
                            onChange={setUrlValue}
                        />
                        <Input
                            label="Telephone Input"
                            type="tel"
                            placeholder="Enter phone number"
                            value={telValue}
                            onChange={setTelValue}
                        />
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Input Sizes</h3>
                    <div className={styles.inputGroup}>
                        <Input
                            label="Small Input"
                            placeholder="Small size"
                            size="small"
                        />
                        <Input
                            label="Medium Input"
                            placeholder="Medium size (default)"
                            size="medium"
                        />
                        <Input
                            label="Large Input"
                            placeholder="Large size"
                            size="large"
                        />
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Input States</h3>
                    <div className={styles.inputGroup}>
                        <Input
                            label="Disabled Input"
                            placeholder="This input is disabled"
                            disabled
                            value="Disabled value"
                        />
                        <Input
                            label="Required Input"
                            placeholder="This field is required"
                            required
                        />
                        <Input
                            label="Input with Hint"
                            placeholder="This input has a hint"
                            hint="This is helpful information about this field"
                        />
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Validation States</h3>
                    <div className={styles.inputGroup}>
                        <Input
                            label="Valid Input"
                            placeholder="This input is valid"
                            hint="Looks good!"
                        />
                        <Input
                            label="Invalid Input"
                            placeholder="This input has an error"
                            error="This field is required"
                            value=""
                        />
                        <Input
                            label="Input with Warning"
                            placeholder="Check your input"
                            hint="Please verify this information"
                        />
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Search Input</h3>
                    <div className={styles.inputGroup}>
                        <Input
                            label="Search"
                            placeholder="Search for something..."
                            value={searchValue}
                            onChange={setSearchValue}
                            hint="Type to search through content"
                        />
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Form Fields</h3>
                    <div className={styles.inputGroup}>
                        <Input
                            label="Full Name"
                            placeholder="Enter your full name"
                            required
                            hint="First and last name"
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="your.email@example.com"
                            required
                            hint="We'll use this to contact you"
                        />
                        <Input
                            label="Phone Number"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            hint="Optional contact number"
                        />
                        <Input
                            label="Website"
                            type="url"
                            placeholder="https://example.com"
                            hint="Your personal or company website"
                        />
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Input với Icon</h3>
                    <div className={styles.inputGroup}>
                        <Input
                            label="Search với Icon"
                            placeholder="Tìm kiếm..."
                            value={searchValue}
                            onChange={setSearchValue}
                            contentBefore={<Search24Regular />}
                        />
                        <Input
                            label="Email với Icon"
                            type="email"
                            placeholder="your.email@example.com"
                            value={emailValue}
                            onChange={setEmailValue}
                            contentAfter={<Mail24Regular />}
                        />
                        <Input
                            label="User với Icon"
                            placeholder="Tên người dùng"
                            value={textValue}
                            onChange={setTextValue}
                            contentBefore={<Person24Regular />}
                        />
                        <Input
                            label="Số với Icon"
                            type="number"
                            placeholder="Nhập số"
                            value={numberValue}
                            onChange={setNumberValue}
                            contentBefore={<NumberSymbol24Regular />}
                        />
                    </div>
                </div>


            </div>
        </div>
    );
};

export default InputLibrary;
