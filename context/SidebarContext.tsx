'use client';

import React, { createContext, useContext, useState } from 'react';

type SidebarContextValue = {
    isOpen: boolean;
    toggle: () => void;
    open: () => void;
    close: () => void;
    focusSidebar: () => void;
    focusMainContent: () => void;
};

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);

    const toggle = () => setIsOpen((v) => !v);
    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    const focusSidebar = () => {
        const sidebarElement = document.querySelector('[data-sidebar]');
        if (sidebarElement) {
            (sidebarElement as HTMLElement).focus();
        }
    };

    const focusMainContent = () => {
        const mainElement = document.querySelector('main');
        if (mainElement) {
            (mainElement as HTMLElement).focus();
        }
    };

    return (
        <SidebarContext.Provider value={{ isOpen, toggle, open, close, focusSidebar, focusMainContent }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
    return ctx;
}

