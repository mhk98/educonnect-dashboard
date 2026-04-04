import React, { useContext } from "react";

import SidebarContent from "./SidebarContent";
import { SidebarContext } from "../../context/SidebarContext";

function DesktopSidebar(props) {
  const { isSidebarCollapsed } = useContext(SidebarContext);

  return (
    <aside
      className={`z-30 flex-shrink-0 hidden overflow-y-auto bg-white dark:bg-gray-800 lg:block ${
        isSidebarCollapsed ? "w-[90px]" : "w-[255px]"
      }`}
    >
      <SidebarContent />
    </aside>
  );
}

export default DesktopSidebar;
