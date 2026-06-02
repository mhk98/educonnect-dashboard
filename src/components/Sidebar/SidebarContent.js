// import React from "react";
// import routes from "../../routes/sidebar";
// import { NavLink, Route } from "react-router-dom";
// import * as Icons from "../../icons";
// import SidebarSubmenu from "./SidebarSubmenu";
// import { Button } from "@windmill/react-ui";
// import { Link } from "react-router-dom/cjs/react-router-dom";
// import logo from "../../assets/img/logo.png";
// function Icon({ icon, ...props }) {
//   const Icon = Icons[icon];
//   return <Icon {...props} />;
// }

// function SidebarContent() {
//   const userRole = localStorage.getItem("role");

//   const filteredRoutes = routes.filter((route) =>
//     route.roles?.includes(userRole),
//   );

//   return (
//     <div className="py-4 text-gray-500 dark:text-gray-400">
//       <Link
//         to="/"
//         className="ml-6 flex flex-col justify-center text-lg font-bold text-gray-800 dark:text-gray-200"
//       >
//         <img src={logo} alt="Logo" className="w-[130px] h-[40px]" />
//       </Link>

//       <ul className="mt-6">
//         {filteredRoutes.map((route) =>
//           route.routes ? (
//             <SidebarSubmenu route={route} key={route.name} />
//           ) : (
//             <li className="relative px-6 py-3" key={route.name}>
//               <NavLink
//                 exact
//                 to={route.path}
//                 className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
//                 activeClassName="text-gray-800 dark:text-gray-100"
//               >
//                 <Route path={route.path} exact={route.exact}>
//                   <span
//                     className="absolute inset-y-0 left-0 w-1 bg-brandBlue rounded-tr-lg rounded-br-lg"
//                     aria-hidden="true"
//                   ></span>
//                 </Route>
//                 <Icon
//                   icon={route.icon}
//                   className="w-5 h-5"
//                   aria-hidden="true"
//                 />
//                 <span className="ml-4">{route.name}</span>
//               </NavLink>
//             </li>
//           ),
//         )}
//       </ul>

//       {/* <div className="px-6 my-6">
//         <Button className="w-full" style={{ backgroundColor: "#1B2E6B" }}>
//           <Link
//             to="/create-account"
//             className="flex items-center justify-center"
//           >
//             Create account
//             <span className="ml-2 text-lg" aria-hidden="true">
//               +
//             </span>
//           </Link>
//         </Button>
//       </div> */}
//     </div>
//   );
// }

// export default SidebarContent;

import React, { useContext, useMemo, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import routes from "../../routes/sidebar";
import { NavLink, Route } from "react-router-dom";
import * as Icons from "../../icons";
import SidebarSubmenu from "./SidebarSubmenu";
import { Link } from "react-router-dom/cjs/react-router-dom";
import logo from "../../assets/img/logo.png";
import { SidebarContext } from "../../context/SidebarContext";
import { Search, X } from "lucide-react";

function Icon({ icon, ...props }) {
  const IconComp = Icons[icon];
  return IconComp ? <IconComp {...props} /> : null;
}

const MotionAside = Motion.aside;
const MotionDiv = Motion.div;

function SidebarContent({ isMobile = false, onNavigate }) {
  const userRole = localStorage.getItem("role");
  const firstName = localStorage.getItem("FirstName") || "";
  const lastName = localStorage.getItem("LastName") || "";
  const [q, setQ] = useState("");

  // ✅ NEW: collapse state (desktop)
  const { isSidebarCollapsed } = useContext(SidebarContext);

  // ✅ role filter first
  const roleFilteredRoutes = useMemo(() => {
    return routes
      .filter((route) => route.roles?.includes(userRole))
      .map((route) => {
        if (!route.routes) return route;

        // submenu items also role filter (if defined)
        const children = (route.routes || []).filter((r) => {
          if (!r.roles) return true;
          return r.roles.includes(userRole);
        });

        return { ...route, routes: children };
      });
  }, [userRole]);

  // ✅ search filter (parent + child)
  const filteredRoutes = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return roleFilteredRoutes;

    return roleFilteredRoutes
      .map((route) => {
        const parentMatch =
          route.name?.toLowerCase().includes(s) ||
          route.path?.toLowerCase().includes(s);

        if (!route.routes) return route;

        const childMatches = (route.routes || []).filter((r) => {
          return (
            r.name?.toLowerCase().includes(s) ||
            r.path?.toLowerCase().includes(s)
          );
        });

        return {
          ...route,
          __parentMatch: parentMatch,
          routes: childMatches,
        };
      })
      .filter((route) => {
        if (!route.routes) {
          return (
            route.name?.toLowerCase().includes(s) ||
            route.path?.toLowerCase().includes(s)
          );
        }
        // show parent if parent matches OR any child matches
        return route.__parentMatch || (route.routes && route.routes.length > 0);
      });
  }, [q, roleFilteredRoutes]);

  return (
    <MotionAside
      className={`flex-shrink-0 ${
        isMobile
          ? "h-screen overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-soft"
          : "h-full bg-white"
      }`}
      animate={{ width: isMobile ? 255 : isSidebarCollapsed ? 90 : 255 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
    >
      <div className="flex h-full flex-col text-gray-500">

        {/* Mobile: logo + close button */}
        {isMobile && (
          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <Link to="/app/dashboard" onClick={onNavigate}>
              <img src={logo} alt="Logo" className="object-contain" style={{ height: "80px", width: "auto", maxWidth: "160px" }} />
            </Link>
            <button
              onClick={onNavigate}
              className="h-8 w-8 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 flex items-center justify-center"
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* <AnimatePresence>
          {!isSidebarCollapsed || isMobile ? (
            <MotionDiv
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4"
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={16} />
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search Menu..."
                  className="w-full h-11 pl-9 pr-3 rounded-xl bg-gray-950/50 border border-gray-800/70 text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              {q.trim() ? (
                <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
                  <span>
                    Showing results for:{" "}
                    <span className="text-gray-200">{q}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setQ("")}
                    className="text-indigo-300 hover:text-indigo-200"
                  >
                    Clear
                  </button>
                </div>
              ) : null}
            </MotionDiv>
          ) : null}
        </AnimatePresence> */}
        <AnimatePresence>
          {!isSidebarCollapsed || isMobile ? (
            <MotionDiv
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`${isMobile ? "mt-3 px-3" : "mt-4 px-3"}`}
            >
              <div className="relative">
                <span
                  className="absolute left-3 text-gray-400 dark:text-gray-500 p-1 "
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                >
                  <Search size={16} />
                </span>

                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search Menu..."
                  className="
            w-full h-11  pr-10 rounded-xl p-1 pl-5
            bg-gray-50 dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            text-gray-800 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            outline-none
            focus:border-brandBlue/60 focus:ring-4 focus:ring-brandBlue/10
            transition
          "
                />

                {q.trim() ? (
                  <button
                    type="button"
                    onClick={() => setQ("")}
                    className="
              absolute right-2
              px-2 py-1 text-xs rounded-lg
              text-gray-500 hover:text-gray-800
              dark:text-gray-400 dark:hover:text-gray-100
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition
            "
                    style={{ top: "50%", transform: "translateY(-50%)" }}
                  >
                    Clear
                  </button>
                ) : null}
              </div>

              {q.trim() ? (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Showing results for:{" "}
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {q}
                  </span>
                </div>
              ) : null}
            </MotionDiv>
          ) : null}
        </AnimatePresence>

        <ul
          className={`flex-1 overflow-y-auto ${
            isMobile ? "mt-3 px-2 pb-3" : "mt-3 px-2"
          }`}
        >
          {filteredRoutes.map((route) =>
            route.routes ? (
              <SidebarSubmenu
                route={route}
                key={route.name}
                searchQuery={q}
                isSidebarCollapsed={isMobile ? false : isSidebarCollapsed}
                isMobile={isMobile}
                onNavigate={onNavigate}
              />
            ) : (
              <li
                className={`relative ${isMobile ? "px-1 py-0.5" : "px-1 py-0.5"}`}
                key={route.name}
              >
                <NavLink
                  exact
                  to={route.path}
                  onClick={onNavigate}
                  title={
                    !isMobile && isSidebarCollapsed ? route.name : undefined
                  }
                  className={`group inline-flex items-center w-full text-sm font-semibold
                  transition-colors duration-150
                  hover:text-gray-900 dark:hover:text-gray-100
                  px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800
                  ${!isMobile && isSidebarCollapsed ? "justify-center" : ""}`}
                  activeClassName={
                    isMobile
                      ? "text-blue-700 bg-blue-50"
                      : "text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800"
                  }
                >
                  <Route path={route.path} exact={route.exact}>
                    <span
                      className={`absolute inset-y-0 left-0 w-1 ${
                        isMobile ? "bg-blue-600" : "bg-brandBlue"
                      } rounded-tr-lg rounded-br-lg`}
                      aria-hidden="true"
                    />
                  </Route>

                  <Icon
                    icon={route.icon}
                    className="w-5 h-5"
                    aria-hidden="true"
                  />

                  {(isMobile || !isSidebarCollapsed) && (
                    <span className="ml-3">{route.name}</span>
                  )}
                </NavLink>
              </li>
            ),
          )}

          {filteredRoutes.length === 0 ? (
            <li className="px-6 py-6 text-sm text-gray-400">No menu found.</li>
          ) : null}
        </ul>

        <div className="mx-4 mb-2 border-t border-gray-100" />

        {(!isSidebarCollapsed || isMobile) && (
          <div className="mx-3 mb-3 rounded-xl bg-gray-50 px-3 py-2 border border-gray-100">
            <p className="text-xs uppercase tracking-widest text-gray-400 "><small>Signed in as</small></p>
            <p className="truncate text-sm font-semibold text-gray-800 mt-0.5">
              {`${firstName} ${lastName}`.trim() || userRole || "User"}
            </p>
          </div>
        )}
        {isSidebarCollapsed && !isMobile && (
          <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-brandBlue text-xs font-bold text-white">
            {(firstName?.charAt(0) || userRole?.charAt(0) || "U").toUpperCase()}
          </div>
        )}
      </div>
    </MotionAside>
  );
}

export default SidebarContent;
