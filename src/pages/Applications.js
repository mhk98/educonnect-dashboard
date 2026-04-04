import React from "react";
import ApplicationsTable from "../components/Applications/ApplicationsTable";

function Applications() {
  return (
    <>
      {/* <PageTitle>Dashboard</PageTitle> */}
      <div className="w-full px-3 sm:px-4 py-4 sm:py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: Title and Subtitle */}
          <div>
            <h4 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Applications
            </h4>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Manage your Students’ Applications.
            </p>
          </div>

          {/* Right: Buttons */}
          <div className="">
            {/* Request Program Options */}
            {/* <button className="flex items-center sm:flex-row gap-3 px-4 py-2 bg-white text-brandRed border-2 border-brandRed rounded-md text-sm md:text-base transition">
            <span>Export Application Data </span>
            <TbDownload />
          </button> */}
          </div>
        </div>
      </div>
      {/* <CTA /> */}

      {/* <ApplicationsFilterPanel/> */}
      <ApplicationsTable />
    </>
  );
}

export default Applications;
