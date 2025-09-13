"use client";

import React, { useState } from "react";
import {
    Button,
    CompoundButton,
    MenuButton,
    SplitButton,
    ToggleButton,
} from "@/components/ui";
import {
    Add24Regular,
    Delete24Regular,
    Edit24Regular,
    Search24Regular,
    Save24Regular,
    Share24Regular,
    MoreHorizontal24Regular,
    Copy24Regular,
    Cut24Regular,
    ClipboardPaste24Regular,
    Star24Regular,
    Heart24Regular,
} from "@fluentui/react-icons";
import { makeStyles } from "@fluentui/react-components";

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
    buttonGroup: {
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        marginBottom: "1rem",
    },
});

const ButtonLibrary: React.FC = () => {
    const styles = useStyles();
    const [loading, setLoading] = useState(false);
    const handleButtonClick = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1200);
    };

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Buttons</h2>
            <div className={styles.grid}>
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Variants</h3>
                    <div className={styles.buttonGroup}>
                        <Button>Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="danger">Danger</Button>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Sizes</h3>
                    <div className={styles.buttonGroup}>
                        <Button size="small">Small</Button>
                        <Button size="medium">Medium</Button>
                        <Button size="large">Large</Button>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>With Icons</h3>
                    <div className={styles.buttonGroup}>
                        <Button icon={<Add24Regular />}>Add Item</Button>
                        <Button icon={<Edit24Regular />} variant="secondary">
                            Edit
                        </Button>
                        <Button icon={<Delete24Regular />} variant="danger">
                            Delete
                        </Button>
                        <Button icon={<Search24Regular />} variant="outline">
                            Search
                        </Button>
                        <Button icon={<Save24Regular />} variant="primary">
                            Save
                        </Button>
                        <Button icon={<Share24Regular />} variant="ghost">
                            Share
                        </Button>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Icon Only</h3>
                    <div className={styles.buttonGroup}>
                        <Button icon={<Add24Regular />} aria-label="Add item"></Button>
                        <Button
                            icon={<Edit24Regular />}
                            variant="secondary"
                            aria-label="Edit item"
                        ></Button>
                        <Button
                            icon={<Delete24Regular />}
                            variant="danger"
                            aria-label="Delete item"
                        ></Button>
                        <Button
                            icon={<Search24Regular />}
                            variant="outline"
                            aria-label="Search"
                        ></Button>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>States</h3>
                    <div className={styles.buttonGroup}>
                        <Button disabled>Disabled</Button>
                        <Button loading={loading} onClick={handleButtonClick}>
                            {loading ? "Loading..." : "Click to Load"}
                        </Button>
                        <Button fullWidth>Full Width</Button>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Compound Button</h3>
                    <div className={styles.buttonGroup}>
                        <CompoundButton
                            secondaryContent="This button has secondary text"
                            icon={<Add24Regular />}
                        >
                            Add New Item
                        </CompoundButton>
                        <CompoundButton
                            variant="secondary"
                            secondaryContent="Secondary action with description"
                            icon={<Edit24Regular />}
                        >
                            Edit Settings
                        </CompoundButton>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Menu Button</h3>
                    <div className={styles.buttonGroup}>
                        <MenuButton
                            menuItems={[
                                {
                                    key: "copy",
                                    content: "Copy",
                                    icon: <Copy24Regular />,
                                    onClick: () => alert("Copy clicked"),
                                },
                                {
                                    key: "cut",
                                    content: "Cut",
                                    icon: <Cut24Regular />,
                                    onClick: () => alert("Cut clicked"),
                                },
                                {
                                    key: "paste",
                                    content: "Paste",
                                    icon: <ClipboardPaste24Regular />,
                                    onClick: () => alert("Paste clicked"),
                                },
                            ]}
                            icon={<MoreHorizontal24Regular />}
                        >
                            Actions
                        </MenuButton>
                        <MenuButton
                            variant="outline"
                            menuItems={[
                                {
                                    key: "share",
                                    content: "Share",
                                    icon: <Share24Regular />,
                                    onClick: () => alert("Share clicked"),
                                },
                                {
                                    key: "save",
                                    content: "Save",
                                    icon: <Save24Regular />,
                                    onClick: () => alert("Save clicked"),
                                },
                            ]}
                        >
                            More Options
                        </MenuButton>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Split Button</h3>
                    <div className={styles.buttonGroup}>
                        <SplitButton
                            onClick={() => alert("Primary action clicked")}
                            menuItems={[
                                {
                                    key: "new",
                                    content: "New Document",
                                    icon: <Add24Regular />,
                                    onClick: () => alert("New clicked"),
                                },
                                {
                                    key: "open",
                                    content: "Open Recent",
                                    icon: <Search24Regular />,
                                    onClick: () => alert("Open clicked"),
                                },
                            ]}
                            icon={<Add24Regular />}
                        >
                            New
                        </SplitButton>
                        <SplitButton
                            variant="secondary"
                            onClick={() => alert("Share primary clicked")}
                            menuItems={[
                                { key: "email", content: "Send via Email", onClick: () => alert("Email clicked") },
                                { key: "link", content: "Copy Link", onClick: () => alert("Link clicked") },
                            ]}
                            icon={<Share24Regular />}
                        >
                            Share
                        </SplitButton>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Toggle Button</h3>
                    <div className={styles.buttonGroup}>
                        <ToggleButton
                            onClick={(checked) => console.log("Star toggled:", checked)}
                            icon={<Star24Regular />}
                        >
                            Favorite
                        </ToggleButton>
                        <ToggleButton
                            defaultChecked
                            variant="secondary"
                            onClick={(checked) => console.log("Heart toggled:", checked)}
                            icon={<Heart24Regular />}
                        >
                            Like
                        </ToggleButton>
                        <ToggleButton
                            variant="outline"
                            onClick={(checked) => console.log("Bold toggled:", checked)}
                        >
                            Bold
                        </ToggleButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ButtonLibrary;


