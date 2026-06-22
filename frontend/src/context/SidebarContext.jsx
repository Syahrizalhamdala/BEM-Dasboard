import { createContext, useState } from 'react';

export const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = () => setIsMobileOpen(prev => !prev);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <SidebarContext.Provider value={{ isMobileOpen, toggleMobile, closeMobile }}>
      {children}
    </SidebarContext.Provider>
  );
}
