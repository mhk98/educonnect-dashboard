// import React, { useState, useMemo } from 'react'

// // create context
// export const SidebarContext = React.createContext()

// export const SidebarProvider = ({ children }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)

//   function toggleSidebar() {
//     setIsSidebarOpen(!isSidebarOpen)
//   }

//   function closeSidebar() {
//     setIsSidebarOpen(false)
//   }

//   const value = useMemo(
//     () => ({
//       isSidebarOpen,
//       toggleSidebar,
//       closeSidebar,
//     }),
//     [isSidebarOpen]
//   )

//   return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
// }

import React, { useCallback, useMemo, useState } from "react";

export const SidebarContext = React.createContext();

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ NEW (desktop collapse)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // ✅ NEW
  const toggleSidebarCollapsed = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      isSidebarOpen,
      toggleSidebar,
      closeSidebar,

      // ✅ expose these
      isSidebarCollapsed,
      toggleSidebarCollapsed,
    }),
    [
      isSidebarOpen,
      toggleSidebar,
      closeSidebar,
      isSidebarCollapsed,
      toggleSidebarCollapsed,
    ],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
