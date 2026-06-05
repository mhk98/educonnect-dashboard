// import React, { useState } from 'react'
// import { Link } from 'react-router-dom'
// import { DropdownIcon } from '../../icons'
// import * as Icons from '../../icons'
// import { Transition } from '@windmill/react-ui'

// function Icon({ icon, ...props }) {
//   const Icon = Icons[icon]
//   return <Icon {...props} />
// }

// function SidebarSubmenu({ route }) {
//   const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false)

//   function handleDropdownMenuClick() {
//     setIsDropdownMenuOpen(!isDropdownMenuOpen)
//   }

//   return (
//     <li className="relative px-6 py-3" key={route.name}>
//       <button
//         className="inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
//         onClick={handleDropdownMenuClick}
//         aria-haspopup="true"
//       >
//         <span className="inline-flex items-center">
//           <Icon className="w-5 h-5" aria-hidden="true" icon={route.icon} />
//           <span className="ml-4">{route.name}</span>
//         </span>
//         <DropdownIcon className="w-4 h-4" aria-hidden="true" />
//       </button>
//       <Transition
//         show={isDropdownMenuOpen}
//         enter="transition-all ease-in-out duration-300"
//         enterFrom="opacity-25 max-h-0"
//         enterTo="opacity-100 max-h-xl"
//         leave="transition-all ease-in-out duration-300"
//         leaveFrom="opacity-100 max-h-xl"
//         leaveTo="opacity-0 max-h-0"
//       >
//         <ul
//           className="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
//           aria-label="submenu"
//         >
//           {route.routes.map((r) => (
//             <li
//               className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
//               key={r.name}
//             >
//               <Link className="w-full" to={r.path}>
//                 {r.name}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </Transition>
//     </li>
//   )
// }

// export default SidebarSubmenu

import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DropdownIcon } from "../../icons";
import * as Icons from "../../icons";
import { Transition } from "@windmill/react-ui";

function Icon({ icon, ...props }) {
  const IconComp = Icons[icon];
  return IconComp ? <IconComp {...props} /> : null;
}

function SidebarSubmenu({
  route,
  searchQuery = "",
  isMobile = false,
  onNavigate,
}) {
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const isChildActive = useMemo(() => {
    return (route.routes || []).some((r) => r.path === pathname);
  }, [route.routes, pathname]);

  // ✅ auto open if searching and has results OR current path is active
  useEffect(() => {
    const q = searchQuery.trim();
    if (q && (route.routes || []).length) setIsDropdownMenuOpen(true);
    if (isChildActive) setIsDropdownMenuOpen(true);
  }, [searchQuery, route.routes, isChildActive]);

  function handleDropdownMenuClick() {
    setIsDropdownMenuOpen((p) => !p);
  }

  return (
    <li
      className={`relative ${isMobile ? "px-1 py-1" : "px-4 py-2"}`}
      key={route.name}
    >
      <button
        className={`group inline-flex items-center justify-between w-full text-sm font-semibold
          transition-colors duration-150 px-3 py-3 rounded-xl
          hover:text-gray-900
          hover:bg-gray-100
          ${
            isChildActive
              ? isMobile
                ? "bg-blue-50 text-blue-700"
                : "bg-gray-100 text-gray-900"
              : ""
          }`}
        onClick={handleDropdownMenuClick}
        aria-haspopup="true"
        type="button"
      >
        <span className="inline-flex items-center">
          <Icon className="w-5 h-5" aria-hidden="true" icon={route.icon} />
          <span className="ml-3">{route.name}</span>
        </span>

        <DropdownIcon
          className={`w-4 h-4 transition-transform duration-200 ${
            isDropdownMenuOpen ? "transform rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <Transition
        show={isDropdownMenuOpen}
        enter="transition-all ease-in-out duration-300"
        enterFrom="opacity-25 max-h-0"
        enterTo="opacity-100 max-h-xl"
        leave="transition-all ease-in-out duration-300"
        leaveFrom="opacity-100 max-h-xl"
        leaveTo="opacity-0 max-h-0"
      >
        <ul
          className="p-2 mt-2 space-y-1 overflow-hidden text-sm font-medium
            text-gray-500 rounded-xl shadow-inner
            bg-gray-50 border border-gray-200"
          aria-label="submenu"
        >
          {(route.routes || []).map((r) => {
            const active = pathname === r.path;

            return (
              <li key={r.name}>
                <Link
                  onClick={onNavigate}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md transition
                    hover:bg-gray-100
                    ${
                      active
                        ? isMobile
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-100 text-gray-900"
                        : ""
                    }`}
                  to={r.path}
                >
                  {/* ✅ submenu icon support (optional) */}
                  {r.icon ? <Icon icon={r.icon} className="w-4 h-4" /> : null}
                  <span>{r.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Transition>
    </li>
  );
}

export default SidebarSubmenu;
