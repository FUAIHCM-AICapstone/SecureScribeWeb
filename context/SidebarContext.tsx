import React, { createContext, useContext, useState } from 'react';

export type NavItemId = 'home' | 'meeting' | 'setting' | 'store' | 'history';

interface SidebarContextValue {
  selectedId: NavItemId;
  setSelectedId: (id: NavItemId) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedId, setSelectedIdState] = useState<NavItemId>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('sidebar-selected');
      if (stored === 'home' || stored === 'meeting' || stored === 'setting' || stored === 'store' || stored === 'history') {
        return stored;
      }
    }
    return 'home';
  });

  const setSelectedId = (id: NavItemId) => {
    setSelectedIdState(id);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('sidebar-selected', id);
    }
  };

  return (
    <SidebarContext.Provider value={{ selectedId, setSelectedId }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
};
