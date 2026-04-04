import React, { useState, useEffect } from "react";
import response from "../utils/demo/tableData";
import FilterPanel from "../components/FilterPanel";
import DashboardItems from "../components/DashboardItems";
import StudentQRCard from "../components/StudentQRCard";
import QuickLinks from "../components/QuickLinks";
import RegionalManagers from "../components/RegionalManagers";
import DashboardStats from "../components/DashboardStats";
import Overview from "../components/Overview";
import DashboardList from "../components/DashboardList";

function Dashboard() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = response.length;

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [page]);

  return (
    <>
      {/* <PageTitle>Dashboard</PageTitle> */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          {/* Left: Title and Subtitle */}
          <div>
            <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Dashboard
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Welcome to EduAnchor Portal
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <FilterPanel />
        </div>
      </div>

      <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <DashboardStats />
        </div>
      </div>

      <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <Overview />
        </div>
      </div>

      <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <DashboardList />
        </div>
      </div>

      <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <DashboardItems />
        </div>
      </div>

      <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <StudentQRCard />
        </div>
      </div>

      <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <QuickLinks />
        </div>
      </div>

      <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <RegionalManagers />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
