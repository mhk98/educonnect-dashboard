import React, { useEffect, useMemo, useState } from "react";
import { Clock, Search } from "lucide-react";
import ReactSelect from "react-select";
import { useGetAllLogHistoryQuery } from "../features/logHistory/logHistory";

const allowedRoles = ["admin", "superAdmin"];

const formatAction = (action = "") =>
  action
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

const getUserName = (activity) => {
  return activity?.userName || "System";
};

function LogHistory() {
  const role = localStorage.getItem("role");
  const userBranch = localStorage.getItem("branch") || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branchOptions, setBranchOptions] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { data, isLoading, isError, error } = useGetAllLogHistoryQuery(
    { branch: role === "superAdmin" ? selectedBranch : undefined },
    {
      skip: !allowedRoles.includes(role),
      refetchOnMountOrArgChange: true,
    },
  );

  const userOptions = useMemo(() => {
    const users = new Map();

    (data?.data || []).forEach((activity) => {
      if (!activity?.user_id) return;
      users.set(activity.user_id, {
        value: activity.user_id,
        label: getUserName(activity),
      });
    });

    return Array.from(users.values()).sort((a, b) =>
      a.label.localeCompare(b.label),
    );
  }, [data]);

  useEffect(() => {
    if (role !== "superAdmin") return;

    setBranchOptions(
      (data?.meta?.branches || [])
        .map((branch) => ({ value: branch, label: branch }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    );
  }, [data, role]);

  const activities = useMemo(() => {
    const rows = data?.data || [];
    const term = searchTerm.trim().toLowerCase();
    const rangeStart = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const rangeEnd = endDate ? new Date(`${endDate}T23:59:59`) : null;

    return rows.filter((activity) => {
      const createdAt = activity?.createdAt
        ? new Date(activity.createdAt)
        : null;

      if (selectedUserId && String(activity?.user_id || "") !== selectedUserId) {
        return false;
      }

      if (role === "admin" && userBranch && activity?.branch !== userBranch) {
        return false;
      }

      if (
        role === "superAdmin" &&
        selectedBranch &&
        activity?.branch !== selectedBranch
      ) {
        return false;
      }

      if (rangeStart && (!createdAt || createdAt < rangeStart)) {
        return false;
      }

      if (rangeEnd && (!createdAt || createdAt > rangeEnd)) {
        return false;
      }

      if (!term) return true;

      const values = [
        getUserName(activity),
        activity?.action,
        activity?.method,
        activity?.module,
        activity?.endpoint,
        activity?.branch,
        activity?.message,
        activity?.userRole,
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(term),
      );
    });
  }, [
    data,
    endDate,
    role,
    searchTerm,
    selectedBranch,
    selectedUserId,
    startDate,
    userBranch,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedUserId("");
    setSelectedBranch("");
    setStartDate("");
    setEndDate("");
  };

  const selectedUserOption =
    userOptions.find((option) => option.value === selectedUserId) || null;
  const selectedBranchOption =
    branchOptions.find((option) => option.value === selectedBranch) || null;

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      borderColor: state.isFocused ? "#1B2E6B" : "#e5e7eb",
      borderRadius: "0.5rem",
      boxShadow: state.isFocused ? "0 0 0 1px #1B2E6B" : "none",
      "&:hover": { borderColor: state.isFocused ? "#1B2E6B" : "#e5e7eb" },
    }),
    valueContainer: (base) => ({
      ...base,
      paddingLeft: "12px",
      paddingRight: "8px",
    }),
    placeholder: (base) => ({ ...base, color: "#6b7280" }),
    singleValue: (base) => ({ ...base, color: "#374151" }),
    menu: (base) => ({ ...base, zIndex: 30 }),
  };

  if (!allowedRoles.includes(role)) {
    return (
      <div className="w-full px-4 sm:px-8 py-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto rounded-lg bg-white p-6 shadow-sm">
          <h4 className="text-xl font-bold text-gray-900">Access denied</h4>
          <p className="mt-2 text-sm text-gray-500">
            Log History is available for admin and superAdmin users only.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 py-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-brandBlue flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brandBlue">
                Activity
              </p>
              <h4 className="text-2xl font-bold text-gray-900 leading-tight">
                Log History
              </h4>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative flex h-10 w-full items-center rounded-lg border border-gray-200 bg-white focus-within:border-brandBlue focus-within:ring-1 focus-within:ring-brandBlue lg:flex-1">
              <Search className="ml-3 h-4 w-4 flex-shrink-0 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-full w-full border-0 bg-transparent px-3 text-sm text-gray-700 outline-none"
                placeholder="Search history"
                type="search"
              />
            </label>

            <div className="w-full lg:w-56">
              <ReactSelect
                isClearable
                value={selectedUserOption}
                onChange={(option) => setSelectedUserId(option?.value || "")}
                options={userOptions}
                placeholder="All users"
                styles={selectStyles}
              />
            </div>

            {role === "superAdmin" && (
              <div className="w-full lg:w-48">
                <ReactSelect
                  isClearable
                  value={selectedBranchOption}
                  onChange={(option) => {
                    setSelectedBranch(option?.value || "");
                    setSelectedUserId("");
                  }}
                  options={branchOptions}
                  placeholder="All branches"
                  styles={selectStyles}
                />
              </div>
            )}

            <input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-brandBlue focus:ring-1 focus:ring-brandBlue lg:w-40"
              type="date"
            />

            <input
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-brandBlue focus:ring-1 focus:ring-brandBlue lg:w-40"
              type="date"
            />

            <button
              type="button"
              onClick={clearFilters}
              className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 transition hover:border-brandBlue hover:text-brandBlue lg:w-24"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm text-gray-700">
              <thead>
                <tr className="border-b bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Module</th>
                  <th className="px-4 py-3">Endpoint</th>
                  <th className="px-4 py-3">Branch</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td className="px-4 py-10 text-center text-gray-500" colSpan="7">
                      Loading log history...
                    </td>
                  </tr>
                )}

                {isError && (
                  <tr>
                    <td className="px-4 py-10 text-center text-red-500" colSpan="7">
                      {error?.data?.message || "Failed to load log history."}
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isError &&
                  activities.map((activity, index) => {
                    return (
                      <tr
                        key={activity.id}
                        className={`border-b last:border-b-0 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {getUserName(activity)}
                          <div className="text-xs font-normal text-gray-400">
                            {activity?.userRole || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-brandBlue">
                            {formatAction(activity?.action) || "N/A"}
                          </span>
                          <div className="mt-1 text-xs text-gray-400">
                            {activity?.method || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {activity?.module || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-xs truncate" title={activity?.endpoint}>
                            {activity?.endpoint || "N/A"}
                          </div>
                          {activity?.message && (
                            <div className="max-w-xs truncate text-xs text-gray-400">
                              {activity.message}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">{activity?.branch || "N/A"}</td>
                        <td className="px-4 py-3">
                          {activity?.statusCode || "N/A"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {activity?.createdAt
                            ? new Date(activity.createdAt).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    );
                  })}

                {!isLoading && !isError && activities.length === 0 && (
                  <tr>
                    <td className="px-4 py-10 text-center text-gray-500" colSpan="7">
                      No log history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogHistory;
