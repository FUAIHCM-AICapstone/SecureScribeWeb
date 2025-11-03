import { useCallback, useRef } from 'react';

interface UseScrollPagingOptions {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    enabled?: boolean;
}

export function useScrollPaging({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    enabled = true,
}: UseScrollPagingOptions) {
    const scrollTimeoutRef = useRef<NodeJS.Timeout>();
    const handleScroll = useCallback(
        (e: Event) => {
            const target = e.target as HTMLDivElement;
            const { scrollTop, scrollHeight, clientHeight } = target;

            // Trigger fetch when user scrolls within 50px of the bottom
            if (
                scrollHeight - scrollTop - clientHeight < 50 &&
                hasNextPage &&
                !isFetchingNextPage &&
                enabled
            ) {
                fetchNextPage();
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage, enabled]
    );

    const addScrollListener = useCallback(
        (dropdownSelector: string) => {
            // Clear any existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            const checkForPopup = () => {
                const popup = document.querySelector(dropdownSelector);
                if (popup) {
                    popup.addEventListener('scroll', handleScroll, { passive: true });
                    return popup;
                }
                return null;
            };

            // Try to find popup immediately
            let popup = checkForPopup();

            // If not found, try again after a short delay (dropdown might not be rendered yet)
            if (!popup) {
                scrollTimeoutRef.current = setTimeout(() => {
                    popup = checkForPopup();
                }, 100);
            }

            return () => {
                if (popup) {
                    popup.removeEventListener('scroll', handleScroll);
                }
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
            };
        },
        [handleScroll]
    ); return { addScrollListener };
}