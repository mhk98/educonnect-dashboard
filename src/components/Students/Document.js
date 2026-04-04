import React, { useState } from "react";
import StudentDocument from "./StudentDocument";
import EADocument from "./EADocument";

const Document = ({ id }) => {
  const [activeTab, setActiveTab] = useState("apply");

  return (
    <div className="w-full bg-white shadow-sm">
      <div className="flex justify-center gap-6 border-b border-gray-200">
        <div className="relative">
          <button
            onClick={() => setActiveTab("apply")}
            className={`py-4 px-2 text-sm sm:text-base font-semibold transition-all ${
              activeTab === "apply" ? "text-brandRed" : "text-gray-800"
            }`}
          >
            Your Documents
          </button>
          {activeTab === "apply" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brandRed" />
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setActiveTab("applied")}
            className={`py-4 px-2 text-sm sm:text-base font-semibold transition-all ${
              activeTab === "applied" ? "text-brandRed" : "text-gray-800"
            }`}
          >
            EduAnchor Documents
          </button>
          {activeTab === "applied" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brandRed" />
          )}
        </div>
      </div>

      <div className="p-4">
        {activeTab === "apply" ? (
          <div>
            <StudentDocument id={id} />
          </div>
        ) : (
          <div>
            <EADocument id={id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Document;
