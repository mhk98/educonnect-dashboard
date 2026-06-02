import React, { useState } from "react";
import ApplyProgram from "./ApplyProgram";
import AppliedProgram from "./AppliedProgram";
import LeadInfo from "./LeadInfo";

const Applications = ({ id }) => {
  const [activeTab, setActiveTab] = useState("applied");

  return (
    <div className="w-full bg-white shadow-sm">
      <div className="flex justify-center gap-6 border-b border-gray-200">
        <div className="relative">
          <button
            onClick={() => setActiveTab("lead")}
            className={`py-4 px-2 text-sm sm:text-base font-semibold transition-all ${
              activeTab === "lead" ? "text-brandBlue" : "text-gray-800"
            }`}
          >
            Lead Information
          </button>
          {activeTab === "lead" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brandBlue" />
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setActiveTab("apply")}
            className={`py-4 px-2 text-sm sm:text-base font-semibold transition-all ${
              activeTab === "apply" ? "text-brandBlue" : "text-gray-800"
            }`}
          >
            Apply To Programs
          </button>
          {activeTab === "apply" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brandBlue" />
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setActiveTab("applied")}
            className={`py-4 px-2 text-sm sm:text-base font-semibold transition-all ${
              activeTab === "applied" ? "text-brandBlue" : "text-gray-800"
            }`}
          >
            Applied Programs
          </button>
          {activeTab === "applied" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brandBlue" />
          )}
        </div>
      </div>

      <div className="p-4">
        {activeTab === "apply" ? (
          <div>
            <ApplyProgram id={id} />
          </div>
        ) : activeTab === "lead" ? (
          <div>
            <LeadInfo id={id} />
          </div>
        ) : (
          <div>
            <AppliedProgram user_id={id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
