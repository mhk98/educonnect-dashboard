import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetAllBranchQuery } from "../features/branch/branch";
import { FiFilter, FiRefreshCw } from "react-icons/fi";

const STATUS_COLORS = {
  "Application Submitted":              { bar: "#22c55e", bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500"  },
  "University Application Initiated":   { bar: "#f59e0b", bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500"  },
  "Offer Recieved":                     { bar: "#ef4444", bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500"    },
  "Tuition Fees Paid":                  { bar: "#3b82f6", bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500"   },
  "LOA Received":                       { bar: "#6366f1", bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
  "Visa Submitted":                     { bar: "#8b5cf6", bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  "Visa Received":                      { bar: "#10b981", bg: "bg-emerald-50",text: "text-emerald-700",dot: "bg-emerald-500"},
  "Case Closed":                        { bar: "#64748b", bg: "bg-slate-50",  text: "text-slate-700",  dot: "bg-slate-500"  },
};

const getColor = (status) =>
  STATUS_COLORS[status] || { bar: "#94a3b8", bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-400" };

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition";
const labelCls = "block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide";

const FilterPanel = () => {
  const [filters, setFilters] = useState({
    startDate: "", endDate: "", intake: "", year: "", country: "", Branch: "",
  });
  const [statusCounts, setStatusCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { data: branchData, isLoading: branchLoading, isError: branchError } =
    useGetAllBranchQuery();

  useEffect(() => {
    const fetchStatusCounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        );
        const response = await axios.get(
          "https://backend.eaconsultancy.org/api/v1/application/status",
          { params }
        );
        const rawData = response.data.data || [];
        const counts = rawData.reduce((acc, curr) => {
          const status = curr.status || "Unknown";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        setStatusCounts(Object.entries(counts).map(([status, count]) => ({ status, count })));
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
    setFilters({ startDate: "", endDate: "", intake: "", year: "", country: "", Branch: "" });

  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FiFilter size={15} />
          </div>
          <h2 className="text-base font-bold text-gray-800">Application Filters</h2>
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
          <input type="date" name="startDate" value={filters.startDate}
            onChange={handleFilterChange} className={inputCls} max={filters.endDate || undefined} />
        </div>
        <div>
          <label className={labelCls}>To Date</label>
          <input type="date" name="endDate" value={filters.endDate}
            onChange={handleFilterChange} className={inputCls} min={filters.startDate || undefined} />
        </div>
        <div>
          <label className={labelCls}>Intake</label>
          <select name="intake" value={filters.intake} onChange={handleFilterChange} className={inputCls}>
            <option value="">All Intakes</option>
            <option value="Jan-Feb">Jan–Feb</option>
            <option value="June-July">Jun–Jul</option>
            <option value="Sep-Oct">Sep–Oct</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Year</label>
          <select name="year" value={filters.year} onChange={handleFilterChange} className={inputCls}>
            <option value="">All Years</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Country</label>
          <select name="country" value={filters.country} onChange={handleFilterChange} className={inputCls}>
            <option value="">All Countries</option>
            <option value="England">England</option>
            <option value="Finland">Finland</option>
            <option value="German">Germany</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Branch</label>
          <select name="Branch" value={filters.Branch} onChange={handleFilterChange} className={inputCls}>
            <option value="">All Branches</option>
            {branchLoading && <option disabled>Loading…</option>}
            {branchError && <option disabled>Error</option>}
            {branchData?.data?.map((b) => (
              <option key={b.id || b._id} value={b.branch || b.name || b.Branch}>
                {b.branch || b.name || b.Branch}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Count Cards */}
      {(loading || error || statusCounts.length > 0) && (
        <div className="mt-5 pt-5 border-t border-gray-100">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
              Loading application data…
            </div>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {!loading && !error && statusCounts.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {statusCounts.map(({ status, count }) => {
                const c = getColor(status);
                return (
                  <div
                    key={status}
                    className={`${c.bg} rounded-xl p-3 flex items-center justify-between border border-white`}
                    style={{ boxShadow: `inset 3px 0 0 ${c.bar}` }}
                  >
                    <div>
                      <p className={`text-xs font-semibold ${c.text} leading-tight`}>{status}</p>
                    </div>
                    <span className={`text-xl font-bold ${c.text} ml-2 flex-shrink-0`}>{count}</span>
                  </div>
                );
              })}
            </div>
          )}
          {!loading && !error && statusCounts.length === 0 && (
            <p className="text-sm text-gray-400">No applications match the selected filters.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
