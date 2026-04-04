// import { Input } from "@windmill/react-ui";
// import { MenuIcon, SearchIcon } from "../icons";
// import React, { useContext, useState, useEffect } from "react";
// import { SidebarContext } from "../context/SidebarContext";
// import { useHistory, Link } from "react-router-dom";
// import NotificationDropdown from "./NotificationDropdown";
// import { useGetDataByIdQuery } from "../features/notification/notification";
// export default function Header() {
//   const { toggleSidebar } = useContext(SidebarContext);
//   const history = useHistory();
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
//   const [isNotifOpen, setIsNotifOpen] = useState(false);

//   const userId = localStorage.getItem("userId");
//   const branch = localStorage.getItem("branch");
//   const role = localStorage.getItem("role");
//   const [notifications, setNotifications] = useState([]);

//   const [user, setUser] = useState(null);

//   const { data, isLoading, isError, error, refetch } = useGetDataByIdQuery(
//     {
//       page: 1,
//       limit: 10,
//       userId,
//       branch,
//     },
//     { pollingInterval: 1000 },
//   );

//   useEffect(() => {
//     if (isError) {
//       console.error("Error fetching user data", error);
//     } else if (!isLoading && data) {
//       const readNotifications = data.data.filter((n) => n.isRead === false);

//       // If your intent was to store the total count of READ notifications
//       setNotifications(readNotifications.length);
//     }
//   }, [data, isLoading, isError, error]);

//   console.log("notificationsHeader", notifications);

//   // Fetch user info
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`https://backend.eaconsultancy.org/api/v1/user/${userId}`);
//         const data = await res.json();
//         setUser(data.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchUser();
//   }, [userId]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     history.push("/login");
//   };

//   return (
//     <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow relative">
//       {/* Mobile hamburger */}
//       <button
//         className="p-1 mr-5 -ml-1 rounded-md lg:hidden"
//         onClick={toggleSidebar}
//       >
//         <MenuIcon className="w-6 h-6" />
//       </button>

//       {/* Search Input */}
//       <div className="flex justify-center flex-1 lg:mr-32">
//         {/* <div className="relative w-full max-w-xl mr-6">
//           <div className="absolute inset-y-0 flex items-center pl-2">
//             <SearchIcon className="w-4 h-4" />
//           </div>
//           <Input
//             className="pl-8 text-gray-700"
//             placeholder="Search..."
//             aria-label="Search"
//           />
//         </div> */}
//       </div>

//       {/* Notification & Profile */}
//       <div className="flex items-center space-x-4">
//         {/* Notification */}
//         <div className="relative">
//           <button
//             onClick={() => setIsNotifOpen(!isNotifOpen)}
//             className="relative"
//           >
//             🔔
//             {notifications > 0 && (
//               <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
//                 {notifications}
//               </span>
//             )}
//           </button>
//           {isNotifOpen && <NotificationDropdown branch={branch} />}
//         </div>

//         {/* Profile */}
//         <div className="relative">
//           <button onClick={toggleProfile}>
//             <img
//               className="w-8 h-8 rounded-full object-cover"
//               src={
//                 user?.image && user?.image !== "null"
//                   ? `https://backend.eaconsultancy.org/${user?.image}`
//                   : "https://i.pravatar.cc/300"
//               }
//               alt="User avatar"
//             />
//           </button>
//           {isProfileOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
//               <ul className="py-2 text-sm text-gray-800 dark:text-gray-200">
//                 <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
//                   <Link to="/app/profile">Profile</Link>
//                 </li>
//                 <li
//                   onClick={handleLogout}
//                   className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
//                 >
//                   Logout
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

import { Input } from "@windmill/react-ui";
import { MenuIcon, SearchIcon } from "../icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { useHistory, Link } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import { useGetDataByIdQuery } from "../features/notification/notification";
import { FiBell, FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";

export default function Header() {
  const { toggleSidebar } = useContext(SidebarContext);
  const history = useHistory();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const branch = localStorage.getItem("branch");
  const role = localStorage.getItem("role");
  const [user, setUser] = useState(null);

  const [notifications, setNotifications] = useState(0);

  // ✅ Get initials from firstName + lastName
  const getInitials = (firstName = "", lastName = "") => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first || last ? `${first}${last}` : "U";
  };

  // 🔔 Notifications
  const { data, isLoading, isError, error } = useGetDataByIdQuery(
    {
      page: 1,
      limit: 10,
      userId,
      branch,
    },
    { pollingInterval: 1000 },
  );

  useEffect(() => {
    if (isError) {
      console.error("Error fetching notifications", error);
    } else if (!isLoading && data) {
      const unread = data.data.filter((n) => !n.isRead);
      setNotifications(unread.length);
    }
  }, [data, isLoading, isError, error]);

  const [isLoading1, setIsLoading1] = useState(true);
  const [isError1, setIsError1] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsLoading1(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://backend.eaconsultancy.org/api/v1/user/${userId}`,
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUser(data.data);
      } catch (error) {
        setIsError1(true);
        console.error("Error fetching the user data:", error);
      } finally {
        setIsLoading1(false);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  const displayName =
    `${user?.FirstName || ""} ${user?.LastName || ""}`.trim() || "User";
  const hasProfileImage =
    user?.image && user?.image !== "null" && user?.image !== "undefined";

  return (
    <header
      className="sticky top-0 z-40 mx-3 mt-3 flex items-center justify-between rounded-3xl border border-white/80 px-3 py-3 shadow-card sm:mx-4 sm:px-4 lg:mx-6 lg:px-6"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(14px)",
      }}
    >
      <button
        type="button"
        className="inline-flex items-center justify-center p-2 -ml-1 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 lg:hidden"
        onClick={toggleSidebar}
        aria-label="Open sidebar"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      <div className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <SearchIcon className="w-4 h-4" />
          </div>
          <Input
            className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-gray-50 border-gray-200 focus:bg-white"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => {
              setIsNotifOpen((prev) => !prev);
              setIsProfileOpen(false);
            }}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-700 transition hover:bg-white hover:shadow-sm"
            aria-label="Open notifications"
          >
            <FiBell className="h-5 w-5" />
            {notifications > 0 && (
              <span
                className="absolute -top-1 -right-1 inline-flex h-5 px-1 items-center justify-center text-xs font-bold text-white bg-red-600 rounded-full border-2 border-white"
                style={{ minWidth: "20px" }}
              >
                {notifications > 9 ? "9+" : notifications}
              </span>
            )}
          </button>

          {isNotifOpen && <NotificationDropdown branch={branch} />}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 pr-2 transition hover:bg-white hover:shadow-sm sm:pr-3"
            aria-label="Open profile menu"
          >
            {hasProfileImage ? (
              <img
                className="w-9 h-9 rounded-full object-cover bg-gray-200"
                src={user.image}
                alt={displayName}
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-red text-sm font-bold uppercase text-white shadow-sm">
                {getInitials(user?.FirstName, user?.LastName)}
              </div>
            )}
            <div className="hidden sm:block text-left leading-tight">
              <p
                className="truncate text-sm font-semibold text-gray-900"
                style={{ maxWidth: "120px" }}
              >
                {isLoading1 && !user ? "Loading..." : displayName}
              </p>
              <p
                className="truncate text-xs capitalize text-gray-500"
                style={{ maxWidth: "120px" }}
              >
                {isError1 ? "Profile unavailable" : role || "User"}
              </p>
            </div>
            <FiChevronDown
              className={`hidden sm:block h-4 w-4 text-gray-500 transition-transform ${
                isProfileOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-soft">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {displayName}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {user?.Email || role || "Profile"}
                </p>
              </div>
              <ul className="p-2 text-sm text-gray-800 dark:text-gray-200">
                <li>
                  <Link
                    to="/app/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiUser className="h-4 w-4" />
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
