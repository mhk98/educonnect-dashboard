import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetAllBranchQuery } from "../features/branch/branch";
import { FiFilter, FiRefreshCw } from "react-icons/fi";
import StatusBadge, { getStatusAccentColor } from "./StatusBadge";

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition";
const labelCls =
  "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide";

const StatusCountSkeleton = () => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
    {[1, 2, 3, 4, 5].map((item) => (
      <div
        key={item}
        className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
      >
        <div className="mb-3 h-2 w-10 rounded-full bg-blue-100" />
        <div className="h-3 w-24 animate-pulse rounded-full bg-gray-200" />
        <div className="mt-3 h-6 w-12 animate-pulse rounded-lg bg-gray-100" />
      </div>
    ))}
  </div>
);

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
          "http://localhost:5000/api/v1/application/status",
          { params },
        );
        const rawData = response.data.data || [];
        const counts = rawData.reduce((acc, curr) => {
          const status = curr.status || "Unknown";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        setStatusCounts(
          Object.entries(counts).map(([status, count]) => ({ status, count })),
        );
      } catch (err) {
        setError("Failed to fetch application counts.");
      } finally {
        setLoading(false);
      }
    };
    fetchStatusCounts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () =>
    setFilters({
      startDate: "",
      endDate: "",
      intake: "",
      year: "",
      country: "",
      Branch: "",
    });

  const hasFilters = Object.values(filters).some((v) => v !== "");
  const showStatusPanel =
    loading || error || statusCounts.length > 0 || hasFilters;

  return (
    <div className="p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FiFilter size={15} />
          </div>
          <h2 className="text-base font-bold text-gray-800">
            Application Filters
          </h2>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200 transition"
          >
            <FiRefreshCw size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div>
          <label className={labelCls}>From Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className={inputCls}
            max={filters.endDate || undefined}
          />
        </div>
        <div>
          <label className={labelCls}>To Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className={inputCls}
            min={filters.startDate || undefined}
          />
        </div>
        <div>
          <label className={labelCls}>Intake</label>
          <select
            name="intake"
            value={filters.intake}
            onChange={handleFilterChange}
            className={inputCls}
          >
            <option value="">All Intakes</option>
            <option value="Jan-Feb">Jan–Feb</option>
            <option value="June-July">Jun–Jul</option>
            <option value="Sep-Oct">Sep–Oct</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Year</label>
          <select
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className={inputCls}
          >
            <option value="">All Years</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Country</label>
          <select
            name="country"
            value={filters.country}
            onChange={handleFilterChange}
            className={inputCls}
          >
            <option value="">All Countries</option>
            <option value="England">England</option>
            <option value="Finland">Finland</option>
            <option value="German">Germany</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Branch</label>
          <select
            name="Branch"
            value={filters.Branch}
            onChange={handleFilterChange}
            className={inputCls}
          >
            <option value="">All Branches</option>
            {branchLoading && <option disabled>Loading…</option>}
            {branchError && <option disabled>Error</option>}
            {branchData?.data?.map((b) => (
              <option
                key={b.id || b._id}
                value={b.branch || b.name || b.Branch}
              >
                {b.branch || b.name || b.Branch}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Count Cards */}
      {showStatusPanel && (
        <div className="mt-5 pt-5 border-t border-gray-100">
          {loading && <StatusCountSkeleton />}
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}
          {!loading && !error && statusCounts.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {statusCounts.map(({ status, count }) => {
                return (
                  <div
                    key={status}
                    className="rounded-xl border border-gray-100 bg-white p-3 flex items-center justify-between"
                    style={{
                      boxShadow: `inset 3px 0 0 ${getStatusAccentColor(
                        status,
                      )}`,
                    }}
                  >
                    <StatusBadge status={status} />
                    <span className="ml-2 flex-shrink-0 text-xl font-bold text-gray-800">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          {!loading && !error && statusCounts.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
              <p className="text-sm font-semibold text-gray-700">
                No application data found
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Try changing or clearing the selected filters.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
