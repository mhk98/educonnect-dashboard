import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@windmill/react-ui";
import { useGetAllBranchQuery } from "../features/branch/branch";

const FilterPanel = () => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    intake: "",
    year: "",
    country: "",
    Branch: "",
  });

  const [statusCounts, setStatusCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    data: branchData,
    isLoading: branchLoading,
    isError: branchError,
  } = useGetAllBranchQuery();

  useEffect(() => {
    const fetchStatusCounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== ""),
        );

        const response = await axios.get(
          "https://backend.eaconsultancy.org/api/v1/application/status",
          { params },
        );

        const rawData = response.data.data || [];

        const counts = rawData.reduce((acc, curr) => {
          const status = curr.status || "Unknown";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const groupedStatusCounts = Object.entries(counts).map(
          ([status, count]) => ({
            status,
            count,
          }),
        );

        setStatusCounts(groupedStatusCounts);
      } catch (err) {
        setError("Failed to fetch application counts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusCounts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusColor = (status) => {
    const lower = status.toLowerCase();
    if (lower.includes("Application Submitted")) return "border-green-500";
    if (lower.includes("University Application Initiated"))
      return "border-yellow-500";
    if (lower.includes("Offer Recieved")) return "border-red-500";
    if (lower.includes("reviTuition Fees Paid")) return "border-blue-500";
    if (lower.includes("LOA Received")) return "border-indigo-500";
    if (lower.includes("Visa Submitted")) return "border-purple-500";
    if (lower.includes("Visa Received")) return "border-purple-500";
    if (lower.includes("Case Closed")) return "border-purple-500";
    return "border-gray-400";
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      intake: "",
      year: "",
      country: "",
      Branch: "",
    });
  };
  return (
    <div className="w-full mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 bg-white rounded shadow">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Application Filters
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        {/* Date Filters */}
        <div>
          <label htmlFor="startDate" className="block mb-1 font-medium">
            From Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="w-full border rounded p-2"
            max={filters.endDate || undefined}
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block mb-1 font-medium">
            To Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="w-full border rounded p-2"
            min={filters.startDate || undefined}
          />
        </div>

        {/* Intake */}
        <div>
          <label htmlFor="intake" className="block mb-1 font-medium">
            Intake
          </label>
          <select
            id="intake"
            name="intake"
            value={filters.intake}
            onChange={handleFilterChange}
            className="w-full border rounded p-2"
          >
            <option value="">Select Intake</option>
            <option value="Jan-Feb">Jan-Feb</option>
            <option value="June-July">June-July</option>
            <option value="Sep-Oct">Sep-Oct</option>
          </select>
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className="block mb-1 font-medium">
            Year
          </label>
          <select
            id="year"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className="w-full border rounded p-2"
          >
            <option value="">Select Year</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block mb-1 font-medium">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={filters.country}
            onChange={handleFilterChange}
            className="w-full border rounded p-2"
          >
            <option value="">Select Country</option>
            <option value="England">England</option>
            <option value="Finland">Finland</option>
            <option value="German">German</option>
          </select>
        </div>

        {/* Branch */}
        <div>
          <label htmlFor="Branch" className="block mb-1 font-medium">
            Branch
          </label>
          <select
            id="Branch"
            name="Branch"
            value={filters.Branch}
            onChange={handleFilterChange}
            className="w-full border rounded p-2"
          >
            <option value="">Select Branch</option>
            {branchLoading && <option disabled>Loading branches...</option>}
            {branchError && <option disabled>Error loading branches</option>}
            {branchData?.data?.map((branchItem) => (
              <option
                key={branchItem.id || branchItem._id || branchItem.name}
                value={
                  branchItem.branch || branchItem.name || branchItem.Branch
                }
              >
                {branchItem.branch || branchItem.name || branchItem.Branch}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <Button
            className="w-full bg-brandRed text-white text-sm sm:text-base"
            onClick={clearFilters}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Display Status Counts */}
      <div>
        {loading && <p className="text-sm sm:text-base">Loading data...</p>}
        {error && <p className="text-red-600 text-sm sm:text-base">{error}</p>}

        {!loading && !error && statusCounts.length === 0 && (
          <p className="text-sm sm:text-base">
            No applications found with current filters.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 py-6 sm:py-8">
          {statusCounts.map(({ status, count }) => (
            <div
              key={status}
              className={`bg-white rounded-lg shadow-sm p-3 sm:p-4 border-l-4 ${getStatusColor(
                status,
              )}`}
            >
              <div className="flex flex-col mb-2">
                <h4 className="text-sm sm:text-md font-medium text-gray-800 capitalize">
                  {status}
                </h4>
                <span className="text-lg sm:text-xl font-semibold text-gray-900">
                  {count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
