import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import Client from "./Client";
import History from "./History";
import LeadDocument from "./LeadDocument";
import { User, Clock, FileText } from "lucide-react";

const STEPS = [
  { id: "client", label: "Client", icon: User },
  { id: "history", label: "History", icon: Clock },
  { id: "documents", label: "Documents", icon: FileText },
];

const EditLeads = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("client");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/consultation/${id}`,
        );
        setData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[300px] text-sm text-gray-400">
        Loading...
      </div>
    );
  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>;
  if (!data)
    return <div className="p-6 text-gray-400 text-sm">No data found.</div>;

  const activeIndex = STEPS.findIndex((s) => s.id === activeTab);

  return (
    <div className="w-full px-4 sm:px-8 py-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Stepper */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 mb-5">
          <div className="flex items-center">
            {STEPS.map((step, i) => {
              const isActive = activeTab === step.id;
              const isComplete = i < activeIndex;
              const Icon = step.icon;

              return (
                <React.Fragment key={step.id}>
                  {/* Step */}
                  <button
                    type="button"
                    onClick={() => setActiveTab(step.id)}
                    className="flex flex-col items-center gap-1.5 outline-none focus:outline-none group flex-shrink-0"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isActive
                          ? "bg-brandBlue text-white shadow-md shadow-brandBlue/30"
                          : isComplete
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                      }`}
                    >
                      {isComplete ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium transition-colors ${
                        isActive
                          ? "text-brandBlue"
                          : isComplete
                            ? "text-emerald-600"
                            : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>

                  {/* Connector */}
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-3 mb-4 rounded-full transition-colors ${
                        i < activeIndex ? "bg-emerald-400" : "bg-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {activeTab === "client" && <Client id={id} />}
          {activeTab === "history" && <History id={id} />}
          {activeTab === "documents" && <LeadDocument id={id} />}
        </div>
      </div>
    </div>
  );
};

export default EditLeads;
