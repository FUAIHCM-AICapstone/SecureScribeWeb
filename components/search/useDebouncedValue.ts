"use client";

import * as React from "react";

export function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = React.useState(value);

    React.useEffect(() => {
        const handle = window.setTimeout(() => setDebounced(value), delayMs);
        return () => window.clearTimeout(handle);
    }, [value, delayMs]);

    return debounced;
}

// Responsive debounce - shorter delay on mobile for better UX
export function useResponsiveDebouncedValue<T>(value: T, baseDelayMs: number = 500): T {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const responsiveDelay = isMobile ? Math.max(baseDelayMs * 0.6, 200) : baseDelayMs;

    return useDebouncedValue(value, responsiveDelay);
}

export default useDebouncedValue;


