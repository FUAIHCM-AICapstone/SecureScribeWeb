"use client";

import * as React from "react";
import { makeStyles, tokens, Avatar } from "@fluentui/react-components";
import {
    CalendarLtr24Regular,
    DocumentText24Regular,
    Note24Regular,
    Document24Regular,
} from "@fluentui/react-icons";

export type SearchEntityType = "meeting" | "transcript" | "meeting_note" | "file";

export interface SearchResult {
    id: string;
    type: SearchEntityType;
    title: string;
    subtitle?: string;
    iconName?: string;
    color?: string;
    meta?: Record<string, any>;
}

type Props = {
    item: SearchResult;
    focused?: boolean;
    onClick?: (item: SearchResult) => void;
    onMouseEnter?: () => void;
    role?: string;
    ariaSelected?: boolean;
};

const useStyles = makeStyles({
    root: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 16px",
        cursor: "pointer",
        borderRadius: tokens.borderRadiusMedium,
        "&:hover": { backgroundColor: tokens.colorNeutralBackground3Hover },
        outlineStyle: "none",
        '@media (max-width: 480px)': {
            gap: "8px",
            padding: "8px 12px",
        },
    },
    focused: {
        backgroundColor: tokens.colorNeutralBackground3Hover,
    },
    iconWrap: {
        width: "28px",
        height: "28px",
        minWidth: "28px",
        display: "grid",
        placeItems: "center",
        borderRadius: "6px",
        backgroundColor: tokens.colorNeutralBackground3,
        '@media (max-width: 480px)': {
            width: "24px",
            height: "24px",
            minWidth: "24px",
        },
    },
    content: {
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
    },
    title: {
        fontSize: "14px",
        lineHeight: 1.4,
        color: tokens.colorNeutralForeground1,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        '@media (max-width: 480px)': {
            fontSize: "13px",
        },
    },
    subtitle: {
        fontSize: "12px",
        lineHeight: 1.4,
        color: tokens.colorNeutralForeground3,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        '@media (max-width: 480px)': {
            fontSize: "11px",
        },
    },
});

function getIconAndColor(type: SearchEntityType): { icon: React.ReactNode; color: string } {
    switch (type) {
        case "meeting":
            return { icon: <CalendarLtr24Regular />, color: "#0078D4" };
        case "transcript":
            return { icon: <DocumentText24Regular />, color: "#107C10" };
        case "meeting_note":
            return { icon: <Note24Regular />, color: "#C239B3" };
        case "file":
        default:
            return { icon: <Document24Regular />, color: "#605E5C" };
    }
}

export function SearchResultItem({ item, focused, onClick, onMouseEnter, role = "option", ariaSelected }: Props) {
    const styles = useStyles();
    const { icon, color } = getIconAndColor(item.type);

    return (
        <div
            className={`${styles.root} ${focused ? styles.focused : ""}`}
            role={role}
            aria-selected={ariaSelected}
            tabIndex={0}
            onMouseEnter={onMouseEnter}
            onClick={() => onClick?.(item)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick?.(item);
                }
            }}
        >
            {item.meta?.avatarUrl ? (
                <Avatar name={item.title} image={{ src: item.meta.avatarUrl }} />
            ) : (
                <div className={styles.iconWrap} style={{ color, borderLeft: `3px solid ${color}` }}>
                    {icon}
                </div>
            )}
            <div className={styles.content}>
                <div className={styles.title}>{item.title}</div>
                {item.subtitle ? <div className={styles.subtitle}>{item.subtitle}</div> : null}
            </div>
        </div>
    );
}

export default SearchResultItem;


