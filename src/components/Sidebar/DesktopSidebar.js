import React from "react";
import SidebarContent from "./SidebarContent";

function DesktopSidebar() {
  return (
    <aside className="z-30 flex-shrink-0 hidden lg:flex flex-col bg-white border-r border-gray-100">
      <SidebarContent />
    </aside>
  );
}

export default DesktopSidebar;
