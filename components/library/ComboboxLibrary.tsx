"use client";

import BasicCombobox from "@/components/ui/combobox/BasicCombobox";
import FilterableCombobox from "@/components/ui/combobox/FilterableCombobox";
import MultiselectCombobox from "@/components/ui/combobox/MultiselectCombobox";
import GroupedCombobox from "@/components/ui/combobox/GroupedCombobox";
import ComplexCombobox from "@/components/ui/combobox/ComplexCombobox";
import { makeStyles } from "@fluentui/react-components";
import {
    Building24Regular,
    Clock24Regular,
    Globe24Regular,
    Location24Regular,
    Person24Regular,
    Phone24Regular
} from "@fluentui/react-icons";
import React, { useState } from "react";

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
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
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
    comboboxGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        marginBottom: "1rem",
    },
});

const ComboboxLibrary: React.FC = () => {
    const styles = useStyles();

    // States for various combobox examples
    const [basicValue, setBasicValue] = useState("");
    const [countryValue, setCountryValue] = useState("");
    const [employeeValue, setEmployeeValue] = useState("");
    const [timeValue, setTimeValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [multiselectValue, setMultiselectValue] = useState<string[]>([]);

    // Basic options
    const basicOptions = [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "cherry", label: "Cherry" },
        { value: "date", label: "Date" },
        { value: "elderberry", label: "Elderberry" },
    ];

    // Complex options with icons and descriptions
    const countryOptions = [
        {
            value: "us",
            label: "United States",
            icon: <Globe24Regular />,
            description: "North America",
        },
        {
            value: "uk",
            label: "United Kingdom",
            icon: <Globe24Regular />,
            description: "Europe",
        },
        {
            value: "jp",
            label: "Japan",
            icon: <Globe24Regular />,
            description: "Asia",
        },
        {
            value: "ca",
            label: "Canada",
            icon: <Globe24Regular />,
            description: "North America",
        },
        {
            value: "au",
            label: "Australia",
            icon: <Globe24Regular />,
            description: "Oceania",
        },
    ];

    // Grouped options
    const employeeOptions = [
        {
            label: "Engineering",
            children: [
                {
                    value: "john-dev",
                    label: "John Smith",
                    icon: <Person24Regular />,
                    description: "Senior Developer",
                },
                {
                    value: "sarah-dev",
                    label: "Sarah Johnson",
                    icon: <Person24Regular />,
                    description: "Frontend Developer",
                },
                {
                    value: "mike-dev",
                    label: "Mike Wilson",
                    icon: <Person24Regular />,
                    description: "Backend Developer",
                },
            ],
        },
        {
            label: "Design",
            children: [
                {
                    value: "anna-design",
                    label: "Anna Davis",
                    icon: <Person24Regular />,
                    description: "UI/UX Designer",
                },
                {
                    value: "tom-design",
                    label: "Tom Brown",
                    icon: <Person24Regular />,
                    description: "Product Designer",
                },
            ],
        },
        {
            label: "Management",
            children: [
                {
                    value: "lisa-mgmt",
                    label: "Lisa Chen",
                    icon: <Person24Regular />,
                    description: "Engineering Manager",
                },
                {
                    value: "david-mgmt",
                    label: "David Lee",
                    icon: <Person24Regular />,
                    description: "VP of Product",
                },
            ],
        },
    ];

    // Time options
    const timeOptions = [
        { value: "9:00", label: "9:00 AM", icon: <Clock24Regular /> },
        { value: "10:00", label: "10:00 AM", icon: <Clock24Regular /> },
        { value: "11:00", label: "11:00 AM", icon: <Clock24Regular /> },
        { value: "12:00", label: "12:00 PM", icon: <Clock24Regular /> },
        { value: "13:00", label: "1:00 PM", icon: <Clock24Regular /> },
        { value: "14:00", label: "2:00 PM", icon: <Clock24Regular /> },
        { value: "15:00", label: "3:00 PM", icon: <Clock24Regular /> },
        { value: "16:00", label: "4:00 PM", icon: <Clock24Regular /> },
        { value: "17:00", label: "5:00 PM", icon: <Clock24Regular /> },
    ];

    // Contact options
    const contactOptions = [
        {
            value: "john@email.com",
            label: "John Smith",
            icon: <Person24Regular />,
            description: "john@email.com",
        },
        {
            value: "sarah@email.com",
            label: "Sarah Johnson",
            icon: <Person24Regular />,
            description: "sarah@email.com",
        },
        {
            value: "work@company.com",
            label: "Work Email",
            icon: <Building24Regular />,
            description: "work@company.com",
        },
        {
            value: "+1234567890",
            label: "Mobile",
            icon: <Phone24Regular />,
            description: "+1 (234) 567-890",
        },
    ];

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Combobox</h2>
            <div className={styles.grid}>
                {/* Basic Combobox */}
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Basic Combobox</h3>
                    <div className={styles.comboboxGroup}>
                        <BasicCombobox
                            label="Select Fruit"
                            placeholder="Choose a fruit..."
                            value={basicValue}
                            onChange={setBasicValue}
                            options={basicOptions}
                        />
                        <BasicCombobox
                            label="Select Country"
                            placeholder="Choose a country..."
                            value={countryValue}
                            onChange={setCountryValue}
                            options={countryOptions}
                        />
                    </div>
                </div>

                {/* Complex Options */}
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Complex Options</h3>
                    <div className={styles.comboboxGroup}>
                        <FilterableCombobox
                            label="Select Contact"
                            placeholder="Search contacts..."
                            value={employeeValue}
                            onChange={setEmployeeValue}
                            options={contactOptions}
                        />
                        <FilterableCombobox
                            label="Meeting Time"
                            placeholder="Select time..."
                            value={timeValue}
                            onChange={setTimeValue}
                            options={timeOptions}
                        />
                    </div>
                </div>

                {/* Grouped Options */}
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Grouped Options</h3>
                    <div className={styles.comboboxGroup}>
                        <GroupedCombobox
                            label="Select Employee"
                            placeholder="Search by name or department..."
                            value={employeeValue}
                            onChange={setEmployeeValue}
                            options={employeeOptions}
                        />
                    </div>
                </div>

                {/* Different Sizes */}
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Combobox Sizes</h3>
                    <div className={styles.comboboxGroup}>
                        <BasicCombobox
                            label="Small Size"
                            placeholder="Small combobox..."
                            size="small"
                            options={basicOptions}
                        />
                        <BasicCombobox
                            label="Medium Size (Default)"
                            placeholder="Medium combobox..."
                            size="medium"
                            options={basicOptions}
                        />
                        <BasicCombobox
                            label="Large Size"
                            placeholder="Large combobox..."
                            size="large"
                            options={basicOptions}
                        />
                    </div>
                </div>

                {/* Different Appearances */}
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Combobox Appearances</h3>
                    <div className={styles.comboboxGroup}>
                        <BasicCombobox
                            label="Outline (Default)"
                            placeholder="Outline appearance..."
                            appearance="outline"
                            options={basicOptions}
                        />
                        <BasicCombobox
                            label="Underline"
                            placeholder="Underline appearance..."
                            appearance="underline"
                            options={basicOptions}
                        />
                        <BasicCombobox
                            label="Filled Lighter"
                            placeholder="Filled lighter..."
                            appearance="filled-lighter"
                            options={basicOptions}
                        />
                        <BasicCombobox
                            label="Filled Darker"
                            placeholder="Filled darker..."
                            appearance="filled-darker"
                            options={basicOptions}
                        />
                    </div>
                </div>

                {/* States */}
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Combobox States</h3>
                    <div className={styles.comboboxGroup}>
                        <BasicCombobox
                            label="Disabled Combobox"
                            placeholder="This is disabled..."
                            disabled
                            options={basicOptions}
                        />
                        <BasicCombobox
                            label="Required Combobox"
                            placeholder="This field is required..."
                            required
                            options={basicOptions}
                        />
                        <BasicCombobox
                            label="With Error"
                            placeholder="Invalid selection..."
                            error="Please select a valid option"
                            value=""
                            options={basicOptions}
                        />
                        <BasicCombobox
                            label="With Hint"
                            placeholder="Select an option..."
                            hint="This field helps you choose from available options"
                            options={basicOptions}
                        />
                    </div>
                </div>

                {/* Search and Filter */}
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Search & Filter</h3>
                    <div className={styles.comboboxGroup}>
                        <FilterableCombobox
                            label="Search Countries"
                            placeholder="Type to search countries..."
                            value={searchValue}
                            onChange={setSearchValue}
                            options={countryOptions}
                            clearable
                        />
                    </div>
                </div>

                {/* Freeform Input */}
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Freeform Input</h3>
                    <div className={styles.comboboxGroup}>
                        <BasicCombobox
                            label="Custom Location"
                            placeholder="Enter or select a location..."
                            options={[
                                { value: "home", label: "Home", icon: <Location24Regular /> },
                                { value: "office", label: "Office", icon: <Building24Regular /> },
                                { value: "coffee-shop", label: "Coffee Shop", icon: <Location24Regular /> },
                            ]}
                        />
                    </div>
                </div>

                {/* Custom Positioning */}
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Dropdown Positioning</h3>
                    <div className={styles.comboboxGroup}>
                        <BasicCombobox
                            label="Above Positioning"
                            placeholder="Dropdown opens above..."
                            positioning="above"
                            options={basicOptions}
                        />
                        <BasicCombobox
                            label="Below Positioning (Default)"
                            placeholder="Dropdown opens below..."
                            positioning="below"
                            options={basicOptions}
                        />
                    </div>
                </div>

                {/* Multiselect */}
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Multiselect Combobox</h3>
                    <div className={styles.comboboxGroup}>
                        <MultiselectCombobox
                            label="Select Multiple Items"
                            placeholder="Choose multiple options..."
                            value={multiselectValue}
                            onChange={setMultiselectValue}
                            options={basicOptions}
                        />
                    </div>
                </div>

                {/* Real-world Examples */}
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Real-world Examples</h3>
                    <div className={styles.comboboxGroup}>
                        <GroupedCombobox
                            label="Assign Task To"
                            placeholder="Select team member..."
                            options={employeeOptions}
                        />
                        <BasicCombobox
                            label="Meeting Location"
                            placeholder="Choose meeting location..."
                            options={[
                                { value: "conference-room-a", label: "Conference Room A", icon: <Building24Regular /> },
                                { value: "conference-room-b", label: "Conference Room B", icon: <Building24Regular /> },
                                { value: "zoom", label: "Zoom Meeting", icon: <Globe24Regular /> },
                                { value: "teams", label: "Microsoft Teams", icon: <Globe24Regular /> },
                            ]}
                        />
                        <BasicCombobox
                            label="Schedule Meeting"
                            placeholder="Pick a time..."
                            options={timeOptions}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComboboxLibrary;