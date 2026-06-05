import { MenuIcon } from "../icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { useHistory, Link, useLocation } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import { useGetDataByIdQuery } from "../features/notification/notification";
import { FiBell, FiChevronDown, FiLogOut, FiUser, FiArrowLeft } from "react-icons/fi";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import logo from "../assets/img/logo.png";
import logo2 from "../assets/img/logo2.png";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  students: "Students",
  applications: "Applications",
  programs: "Programs",
  leads: "Leads",
  enquiries: "Manage Enquiries",
  wallet: "Wallet",
  task: "Tasks",
  commission: "Commission Payments",
  notification: "Notifications",
  notice: "Notice",
  profile: "Profile",
  usermanagement: "User Management",
};

const getRoleBadge = (role) => {
  const r = (role || "").toLowerCase().replace(/\s/g, "");
  if (r.includes("super"))
    return "bg-brandBlueSoft text-brandBlue ring-1 ring-blue-100";
  if (r.includes("admin"))
    return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  if (r.includes("manager") || r.includes("employee"))
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
  if (r.includes("student"))
    return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100";
  return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
};

export default function Header() {
  const { toggleSidebar, isSidebarCollapsed, toggleSidebarCollapsed } =
    useContext(SidebarContext);
  const history = useHistory();
  const location = useLocation();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const branch = localStorage.getItem("branch");
  const role = localStorage.getItem("role");
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(0);
  const [isLoading1, setIsLoading1] = useState(true);
  const [, setIsError1] = useState(false);

  const getInitials = (firstName = "", lastName = "") => {
    const f = firstName?.charAt(0)?.toUpperCase() || "";
    const l = lastName?.charAt(0)?.toUpperCase() || "";
    return f || l ? `${f}${l}` : "U";
  };

  const { data, isLoading, isError, error } = useGetDataByIdQuery(
    { page: 1, limit: 10, userId, branch },
    { pollingInterval: 1000 },
  );

  useEffect(() => {
    if (!isLoading && data && !isError) {
      setNotifications(data.data.filter((n) => !n.isRead).length);
    }
  }, [data, isLoading, isError, error]);

  useEffect(() => {
    if (!userId) {
      setIsLoading1(false);
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/v1/user/${userId}`,
        );
        if (!res.ok) throw new Error();
        const d = await res.json();
        setUser(d.data);
      } catch {
        setIsError1(true);
      } finally {
        setIsLoading1(false);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setIsProfileOpen(false);
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      )
        setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const isImpersonating = localStorage.getItem("isImpersonating") === "true";
  const originalName = `${localStorage.getItem("originalFirstName") || ""} ${localStorage.getItem("originalLastName") || ""}`.trim();

  const handleExitImpersonation = () => {
    localStorage.setItem("token", localStorage.getItem("originalToken") || "");
    localStorage.setItem("role", localStorage.getItem("originalRole") || "");
    localStorage.setItem("userId", localStorage.getItem("originalUserId") || "");
    localStorage.setItem("FirstName", localStorage.getItem("originalFirstName") || "");
    localStorage.setItem("LastName", localStorage.getItem("originalLastName") || "");
    localStorage.setItem("image", localStorage.getItem("originalImage") || "");
    const origBranch = localStorage.getItem("originalBranch");
    if (origBranch) {
      localStorage.setItem("branch", origBranch);
    } else {
      localStorage.removeItem("branch");
    }
    ["originalToken", "originalRole", "originalUserId", "originalFirstName", "originalLastName", "originalImage", "originalBranch", "isImpersonating"].forEach((k) => localStorage.removeItem(k));
    history.push("/app/usermanagement");
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    history.push("/login");
  };

  const displayName =
    `${user?.FirstName || ""} ${user?.LastName || ""}`.trim() || "User";
  const hasProfileImage =
    user?.image && user?.image !== "null" && user?.image !== "undefined";
  const pathSegment =
    location.pathname.split("/").filter(Boolean)[1] || "dashboard";
  const pageTitle =
    PAGE_TITLES[pathSegment.toLowerCase()] ||
    pathSegment.charAt(0).toUpperCase() +
      pathSegment.slice(1).replace(/-/g, " ");
  const roleBadgeBg = getRoleBadge(role);

  /* sidebar width mirrors SidebarContent animation */
  const sidebarW = isSidebarCollapsed ? 90 : 255;

  return (
    <>
    {isImpersonating && (
      <div className="flex items-center justify-between bg-orange-500 text-white text-xs font-semibold px-4 py-2 z-50">
        <span>
          Impersonating as <strong>{`${localStorage.getItem("FirstName") || ""} ${localStorage.getItem("LastName") || ""}`.trim()}</strong>
          {originalName && <span className="ml-1 opacity-80">(Admin: {originalName})</span>}
        </span>
        <button
          type="button"
          onClick={handleExitImpersonation}
          className="flex items-center gap-1 bg-white text-orange-600 font-bold px-3 py-1 rounded-full hover:bg-orange-50 transition"
        >
          <FiArrowLeft size={13} />
          Exit
        </button>
      </div>
    )}
    <header
      className="flex-shrink-0 z-50 bg-white flex items-center border-b border-gray-100"
      style={{ height: "60px", boxShadow: "0 1px 4px rgba(15,23,42,0.07)" }}
    >
      {/* ── Logo section (matches sidebar width) ── */}
      <div
        className="hidden lg:flex items-center justify-between px-4 h-full border-r border-gray-100 flex-shrink-0 transition-all duration-300"
        style={{ width: sidebarW }}
      >
        <Link to="/app/dashboard" className="flex items-center min-w-0">
          <img
            src={isSidebarCollapsed ? logo2 : logo}
            alt="Logo"
            className="transition-all duration-300 object-contain"
            style={
              isSidebarCollapsed
                ? { height: "38px", width: "auto" }
                : { height: "80px", maxWidth: "160px", width: "auto" }
            }
          />
        </Link>
        <button
          type="button"
          onClick={toggleSidebarCollapsed}
          className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition flex-shrink-0"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen size={17} />
          ) : (
            <PanelLeftClose size={17} />
          )}
        </button>
      </div>

      {/* ── Right section: page title + actions ── */}
      <div className="flex flex-1 items-center justify-between px-4 sm:px-5 h-full">
        {/* Left: mobile hamburger + page title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="lg:hidden flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
            onClick={toggleSidebar}
          >
            <MenuIcon className="w-4 h-4" />
          </button>
          <h1 className="text-sm font-bold text-gray-800 tracking-tight">
            {pageTitle}
          </h1>
        </div>

        {/* Right: notification + profile */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => {
                setIsNotifOpen((p) => !p);
                setIsProfileOpen(false);
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
            >
              <FiBell size={20} />
              {notifications > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#ef4444",
                    color: "#fff",
                    fontSize: "9px",
                    fontWeight: "700",
                    lineHeight: "1",
                    borderRadius: "999px",
                    border: "2px solid #fff",
                    minWidth: "16px",
                    height: "16px",
                    whiteSpace: "nowrap",
                    padding: "1px 2px",
                    boxSizing: "border-box",
                  }}
                >
                  {notifications > 9 ? "9" : notifications}
                </span>
              )}
            </button>
            {isNotifOpen && <NotificationDropdown branch={branch} />}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen((p) => !p);
                setIsNotifOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl bg-gray-100 pl-1 pr-2.5 py-1 hover:bg-gray-200 transition"
            >
              {hasProfileImage && !imgError ? (
                <img
                  className="w-8 h-8 rounded-lg object-cover bg-gray-200 flex-shrink-0"
                  src={
                    user.image.startsWith("http")
                      ? user.image
                      : `http://localhost:5000/${user.image}`
                  }
                  alt={displayName}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brandBlue text-xs font-bold uppercase text-white flex-shrink-0">
                  {getInitials(user?.FirstName, user?.LastName)}
                </div>
              )}
              <div className="hidden sm:block text-left leading-tight">
                <p
                  className="text-xs font-semibold text-gray-900 leading-snug truncate"
                  style={{ maxWidth: "120px" }}
                >
                  {isLoading1 && !user ? "Loading..." : displayName}
                </p>
                <span
                  className={`inline-flex items-center mt-0.5 px-1.5 py-0.5 text-xs font-bold rounded leading-none ${roleBadgeBg}`}
                >
                  {role || "User"}
                </span>
              </div>
              <FiChevronDown
                className={`hidden sm:block h-3.5 w-3.5 text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isProfileOpen && (
              <div
                className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white z-50"
                style={{ boxShadow: "0 8px 32px rgba(15,23,42,0.14)" }}
              >
                {/* User info section */}
                <div className="px-4 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    {hasProfileImage && !imgError ? (
                      <img
                        className="w-10 h-10 rounded-xl object-cover bg-gray-200 flex-shrink-0"
                        src={
                          user.image.startsWith("http")
                            ? user.image
                            : `http://localhost:5000/${user.image}`
                        }
                        alt={displayName}
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brandBlue text-sm font-bold uppercase text-white flex-shrink-0">
                        {getInitials(user?.FirstName, user?.LastName)}
                      </div>
                    )}
                    {/* Name + role */}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {displayName}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 mt-0.5 text-xs font-bold rounded-md leading-none ${roleBadgeBg}`}
                      >
                        {role || "User"}
                      </span>
                    </div>
                  </div>
                  {/* Email on its own line */}
                  {user?.Email && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 flex-shrink-0 text-gray-400">
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <rect x="2" y="4" width="12" height="9" rx="1.5" />
                          <path d="M2 5.5l6 4.5 6-4.5" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {user.Email}
                      </p>
                    </div>
                  )}
                </div>

                {/* Menu items */}
                <ul className="p-2 space-y-1">
                  <li>
                    <Link
                      to="/app/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-gray-700 hover:bg-gray-50 transition"
                    >
                      <FiUser className="h-4 w-4 text-gray-400" />
                      <span className="text-xs">My Profile</span>
                    </Link>
                  </li>
                  <li className="border-t border-gray-100 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-left text-red-500 hover:bg-red-50 transition"
                    >
                      <FiLogOut className="h-4 w-4" />
                      <span className="text-xs">Sign out</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
