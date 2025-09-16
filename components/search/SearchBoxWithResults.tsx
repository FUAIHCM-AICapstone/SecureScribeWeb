"use client";

// NOTE: Replace `defaultSearchEntities` with real API by injecting via props.
// The component accepts an optional `searchEntities` prop to override the default mock.

import * as React from "react";
import {
    makeStyles,
    tokens,
    SearchBox,
    Spinner,
    Divider,
    Popover,
    PopoverSurface,
    PopoverTrigger,
} from "@fluentui/react-components";
import { showToast } from "@/hooks/useShowToast";
import SearchResultItem, { SearchResult, SearchEntityType } from "./SearchResultItem";
import useDebouncedValue from "./useDebouncedValue";

// Types required by the spec
export interface SearchResultsGrouped {
    meetings: SearchResult[];
    transcripts: SearchResult[];
    meeting_notes: SearchResult[];
    files: SearchResult[];
}

// Default mock search using existing services/api/mock
async function defaultSearchEntities(query: string): Promise<SearchResultsGrouped> {
    const mod = await import("../../services/api/mock");
    const data = await mod.searchAll(query);
    const mapType = (t: string): SearchEntityType | null => {
        if (t === "meeting") return "meeting";
        if (t === "transcript") return "transcript";
        if (t === "note") return "meeting_note";
        if (t === "file") return "file";
        return null;
    };
    const mapped: SearchResult[] = data
        .map((x: any) => {
            const mt = mapType(x.type);
            if (!mt) return null;
            return {
                id: x.id,
                type: mt,
                title: x.title,
                subtitle: x.subtitle,
            } as SearchResult;
        })
        .filter(Boolean) as SearchResult[];

    return {
        meetings: mapped.filter((i) => i.type === "meeting"),
        transcripts: mapped.filter((i) => i.type === "transcript"),
        meeting_notes: mapped.filter((i) => i.type === "meeting_note"),
        files: mapped.filter((i) => i.type === "file"),
    };
}

const useStyles = makeStyles({
    container: { position: "relative", width: "100%" },
    dropdown: {
        width: "50%",
        padding: 0,
        borderRadius: tokens.borderRadiusMedium,
        boxShadow: tokens.shadow16,
        '@media (max-width: 768px)': {
            maxWidth: "95vw",
        },
        '@media (max-width: 480px)': {
            maxWidth: "98vw",
        },
    },
    groupsWrap: {
        maxHeight: "400px",
        overflow: "auto",
    },
    group: {
        padding: "6px 0 8px 0",
    },
    groupHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "12px",
        color: tokens.colorNeutralForeground3,
        padding: "6px 12px",
    },
    listbox: {
        display: "flex",
        flexDirection: "column",
        gap: 0,
    },
    statusWrap: { padding: "12px", color: tokens.colorNeutralForeground3 },
});

type Props = {
    onSelect: (result: SearchResult) => void;
    onPreview?: (result: SearchResult) => void;
    placeholder?: string;
    searchEntities?: (query: string) => Promise<SearchResultsGrouped>;
    autoFocus?: boolean;
    align?: "start" | "end";
    appearance?: "outline" | "underline" | "filled-darker" | "filled-lighter" | "filled-darker-shadow" | "filled-lighter-shadow";
    size?: "small" | "medium" | "large";
};

export function SearchBoxWithResults({
    onSelect,
    onPreview,
    placeholder = "Search…",
    searchEntities = defaultSearchEntities,
    align = "start",
    appearance = "outline" as const,
    size = "large",
}: Props) {
    const styles = useStyles();
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const debouncedQuery = useDebouncedValue(query, 300);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [results, setResults] = React.useState<SearchResultsGrouped>({ meetings: [], transcripts: [], meeting_notes: [], files: [] });

    const [flatItems, setFlatItems] = React.useState<SearchResult[]>([]);
    const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);

    const inputId = React.useId();
    const listboxId = React.useId();

    const rebuildFlat = React.useCallback((r: SearchResultsGrouped) => {
        const order: Array<keyof SearchResultsGrouped> = ["meetings", "transcripts", "meeting_notes", "files"];
        const merged: SearchResult[] = [];
        order.forEach((k) => merged.push(...r[k]));
        setFlatItems(merged);
        if (merged.length === 0) setFocusedIndex(-1);
    }, []);

    React.useEffect(() => {
        rebuildFlat(results);
    }, [results, rebuildFlat]);

    // Search on debounced query
    React.useEffect(() => {
        if (!debouncedQuery.trim()) {
            setOpen(false);
            setResults({ meetings: [], transcripts: [], meeting_notes: [], files: [] });
            setError(null);
            setLoading(false);
            return;
        }
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const r = await searchEntities(debouncedQuery);
                if (!cancelled) {
                    setResults(r);
                    setOpen(true);
                }
            } catch {
                if (!cancelled) {
                    setError("Search failed");
                    showToast("error", "Search failed");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [debouncedQuery, searchEntities]);

    const onKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (!open) return;
        if (ev.key === "Escape") {
            setOpen(false);
            return;
        }
        if (ev.key === "ArrowDown") {
            ev.preventDefault();
            setFocusedIndex((i) => Math.min(i + 1, flatItems.length - 1));
        } else if (ev.key === "ArrowUp") {
            ev.preventDefault();
            setFocusedIndex((i) => Math.max(i - 1, 0));
        } else if (ev.key === "Enter") {
            if (focusedIndex >= 0 && focusedIndex < flatItems.length) {
                if (ev.shiftKey && onPreview) {
                    onPreview(flatItems[focusedIndex]);
                } else {
                    onSelect(flatItems[focusedIndex]);
                }
                setOpen(false);
            }
        }
    };

    const renderGroup = (label: string, items: SearchResult[]) => {
        if (items.length === 0) return null;
        return (
            <div className={styles.group} role="group" aria-label={label}>
                <div className={styles.groupHeader}>
                    <span>{label}</span>
                    <span>{items.length}</span>
                </div>
                <div role="listbox" aria-labelledby={label} className={styles.listbox}>
                    {items.map((it) => {
                        const absoluteIndex = flatItems.findIndex((f) => f === it);
                        const focused = absoluteIndex === focusedIndex;
                        return (
                            <SearchResultItem
                                key={`${it.type}-${it.id}`}
                                item={it}
                                focused={focused}
                                onMouseEnter={() => setFocusedIndex(absoluteIndex)}
                                onClick={(i) => onSelect(i)}
                                role="option"
                                ariaSelected={focused}
                            />
                        );
                    })}
                </div>
                <Divider />
            </div>
        );
    };

    const totalCount = flatItems.length;

    return (
        <div className={styles.container}>
            <Popover
                open={open}
                onOpenChange={(_, d) => setOpen(!!d.open)}
                trapFocus={false}
                positioning={{ position: "below", align }}
            >
                <PopoverTrigger>
                    <div style={{ width: "100%", display: "flex", justifyContent: align === "end" ? "flex-end" : "flex-start" }}>
                        <SearchBox
                            id={inputId}
                            placeholder={placeholder}
                            value={query}
                            onChange={(_, data) => setQuery(data.value ?? "")}
                            onKeyDown={onKeyDown}
                            aria-expanded={open}
                            aria-controls={open ? listboxId : undefined}
                            role="combobox"
                            appearance={appearance}
                            size={size}
                            dismiss={{
                                // Custom dismiss button styling to maintain consistent width
                                style: {
                                    flexShrink: 0,
                                    width: '20px',
                                    height: '20px',
                                }
                            }}
                            input={{
                                // Ensure consistent input width by controlling internal styling
                                style: {
                                    minWidth: '100%',
                                    width: '100%',
                                }
                            }}
                        />
                    </div>
                </PopoverTrigger>
                <PopoverSurface className={styles.dropdown} aria-live="polite" id={listboxId}>
                    {loading ? (
                        <div className={styles.statusWrap}>
                            <Spinner label="Loading" size="small" />
                        </div>
                    ) : error ? (
                        <div className={styles.statusWrap}>Error</div>
                    ) : totalCount === 0 ? (
                        <div className={styles.statusWrap}>No results</div>
                    ) : (
                        <div className={styles.groupsWrap}>
                            {renderGroup("Meetings", results.meetings)}
                            {renderGroup("Transcripts", results.transcripts)}
                            {renderGroup("Meeting Notes", results.meeting_notes)}
                            {renderGroup("Files", results.files)}
                        </div>
                    )}
                </PopoverSurface>
            </Popover>
        </div>
    );
}

export default SearchBoxWithResults;


