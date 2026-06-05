import React, { useEffect, useState } from "react";
import axios from "axios";
import Client from "../Leads/Client";
import History from "../Leads/History";

const LeadInfo = ({ id }) => {
  // const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("client");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/consultation/lead-info/${id}`,
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

  // console.log("data", data.id);

  const isClient = activeTab === "client";
  const isHistory = activeTab === "history";
  const isDocuments = activeTab === "documents";

  if (loading) return <div className="p-4">Loading user data...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!data) return <div className="p-4 text-gray-500">No user found.</div>;

  return (
    <div className="p-4 md:p-8 w-full mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
        {/* Profile Section */}
        <div className="lg:col-span-3 col-span-1 bg-white rounded-2xl shadow p-4 flex justify-around items-center">
          <div
            onClick={() => setActiveTab("client")}
            className="flex flex-col items-center cursor-pointer"
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                isClient ? "bg-brandBlue text-white" : "bg-gray-200"
              }`}
            >
              1
            </div>
            <span className="mt-1 text-xs text-gray-700">Client</span>
          </div>
          <div className="h-px flex-1 bg-gray-300 mx-2"></div>
          <div
            onClick={() => setActiveTab("history")}
            className="flex flex-col items-center cursor-pointer"
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                isHistory ? "bg-brandBlue text-white" : "bg-gray-200"
              }`}
            >
              2
            </div>
            <span className="mt-1 text-xs text-gray-700">History</span>
          </div>
          {/* <div className="h-px flex-1 bg-gray-300 mx-2"></div>
          <div
            onClick={() => setActiveTab("documents")}
            className="flex flex-col items-center cursor-pointer"
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                isDocuments ? "bg-brandBlue text-white" : "bg-gray-200"
              }`}
            >
              3
            </div>
            <span className="mt-1 text-xs text-gray-700">Documents</span>
          </div> */}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4 p-4 bg-white">
        {
          isClient ? (
            <Client id={id} />
          ) : isHistory ? (
            <History id={data.id} />
          ) : null
          //  : (
          //   <LeadDocument id={id} />
          // )
        }
      </div>
    </div>
  );
};

export default LeadInfo;
