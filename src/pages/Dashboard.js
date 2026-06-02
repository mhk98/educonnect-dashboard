import React from "react";
import FilterPanel from "../components/FilterPanel";
import DashboardItems from "../components/DashboardItems";
import StudentQRCard from "../components/StudentQRCard";
import QuickLinks from "../components/QuickLinks";
import RegionalManagers from "../components/RegionalManagers";
import DashboardStats from "../components/DashboardStats";
import Overview from "../components/Overview";
import DashboardList from "../components/DashboardList";

function Dashboard() {
  const firstName = localStorage.getItem("FirstName") || "";
  const role = localStorage.getItem("role") || "User";

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="px-4 sm:px-5 lg:px-6 py-5 space-y-5">

      {/* ── Welcome Banner ── */}
      <div
        className="relative overflow-hidden rounded-2xl px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          background: "linear-gradient(135deg, #1B2E6B 0%, #2196F3 100%)",
        }}
      >
        <div className="text-white">
          <p className="text-sm font-medium opacity-80">{greeting()},</p>
          <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
            {firstName || role} 👋
          </h2>
          <p className="text-sm opacity-70 mt-1">
            Welcome to EduAnchor Portal — here's your overview for today.
          </p>
        </div>
        {/* decorative circles */}
        <div
          className="absolute -right-8 -top-8 w-36 h-36 rounded-full opacity-10"
          style={{ background: "#fff" }}
        />
        <div
          className="absolute -right-4 -bottom-10 w-28 h-28 rounded-full opacity-10"
          style={{ background: "#fff" }}
        />
      </div>

      {/* ── Stats Row ── */}
      <DashboardStats />

      {/* ── Application Filter Card ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <FilterPanel />
      </div>

      {/* ── Charts ── */}
      <Overview />

      {/* ── Call List + Notices ── */}
      <DashboardList />

      {/* ── Quick Access Cards ── */}
      <div>
        <h2 className="text-base font-bold text-gray-800 mb-3">Quick Access</h2>
        <DashboardItems />
      </div>

      {/* ── QR + Quick Links ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <StudentQRCard />
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <QuickLinks />
        </div>
      </div>

      {/* ── Regional Managers ── */}
      <RegionalManagers />
    </div>
  );
}

export default Dashboard;
