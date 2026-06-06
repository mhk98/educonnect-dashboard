import React, { useState, useMemo } from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { Input, Label } from "@windmill/react-ui";
import {
  useGetAllUserQuery,
  useGetUserDataByIdQuery,
  useUpdateUserMutation,
} from "../../features/auth/auth";
import { FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
import { Button } from "@windmill/react-ui";
import { useGetAllBranchQuery } from "../../features/branch/branch";
import StatusBadge from "../StatusBadge";

const STATUS_OPTIONS = [
  "File Opened",
  "Application Submitted",
  "Interview Date Received",
  "Offer Received",
  "LOA Received",
  "Visa Applied",
  "Visa Received",
  "archive",
  "Rejected",
];

export default function StudentTable() {
  const [filterBranch, setFilterBranch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [savingCell, setSavingCell] = useState(null); // "id-field"
  const limit = 10;

  const {
    data: branchData,
    isLoading: branchLoading,
    isError: branchError,
  } = useGetAllBranchQuery();

  const role = localStorage.getItem("role");
  const branch = localStorage.getItem("branch");
  const userId = localStorage.getItem("userId");

  const queryParams =
    role === "superAdmin"
      ? { searchTerm: searchValue, Branch: filterBranch, roleMode: "onlyStudent", page, limit }
      : role === "admin" || role === "employee"
        ? { Branch: branch, searchTerm: searchValue, page, limit }
        : null;

  const { data: allUserData, isLoading } = useGetAllUserQuery(queryParams, {
    skip: !queryParams,
  });

  const { data: currentUserData } = useGetUserDataByIdQuery(userId);

  // Fetch employees/admins for Assigned To dropdown
  const { data: staffData } = useGetAllUserQuery(
    { roleMode: "excludeStudent", limit: 100 },
    { skip: role === "student" },
  );

  const staffList = useMemo(() => {
    return (staffData?.data || []).filter(
      (u) => u.Role === "admin" || u.Role === "employee" || u.Role === "superAdmin",
    );
  }, [staffData]);

  const students = useMemo(() => {
    let users = [];
    if (role === "student") {
      users = currentUserData?.data ? [currentUserData.data] : [];
    } else {
      users = allUserData?.data || [];
    }
    return users.filter(
      (user) => user.Role?.toLowerCase() === "student" && user.Profile === "active",
    );
  }, [role, allUserData, currentUserData]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const [updateUser] = useUpdateUserMutation();

  const handleInlineUpdate = async (studentId, field, value) => {
    const cellKey = `${studentId}-${field}`;
    setSavingCell(cellKey);
    try {
      const res = await updateUser({ id: studentId, data: { [field]: value } }).unwrap();
      if (res.success) {
        toast.success("Updated successfully");
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update");
    } finally {
      setSavingCell(null);
    }
  };

  const clearFilters = () => {
    setSearchValue("");
    setFilterBranch("");
  };

  const isSaving = (studentId, field) => savingCell === `${studentId}-${field}`;

  return (
    <div className="p-3 sm:p-4 max-w-7xl mx-auto">
      {/* Filter Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 bg-white rounded-xl shadow-sm p-3 sm:p-4">
        <Label>
          <span className="text-sm text-gray-700">Search Student</span>
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="mt-1"
            placeholder="Search by name or email"
          />
        </Label>

        <Label>
          <span className="text-sm text-gray-700">Branch</span>
          <select
            id="Branch"
            name="Branch"
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="w-full border rounded p-2 mt-1"
          >
            <option value="">Select Branch</option>
            {branchLoading && <option disabled>Loading branches...</option>}
            {branchError && <option disabled>Error loading branches</option>}
            {branchData?.data?.map((branchItem) => (
              <option
                key={branchItem.id || branchItem._id || branchItem.name}
                value={branchItem.branch || branchItem.name || branchItem.Branch}
              >
                {branchItem.branch || branchItem.name || branchItem.Branch}
              </option>
            ))}
          </select>
        </Label>

        <div className="flex items-end gap-2">
          <Button className="w-full bg-brandBlue text-white" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </div>

      {/* Student Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full w-full border border-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr className="text-left">
              <th className="p-3">Student ID</th>
              <th className="p-3 hidden md:table-cell">Created By</th>
              <th className="p-3 hidden md:table-cell">Created On</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Branch</th>
              <th className="p-3">Assigned To</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.length > 0 ? (
              students.map((student, index) => {
                const rowBg = index % 2 === 0 ? "bg-gray-50" : "bg-white";
                return (
                  <tr
                    key={index}
                    className={`text-sm border-t border-gray-200 ${rowBg}`}
                  >
                    <td className="p-3 whitespace-nowrap">{student.id}</td>
                    <td className="p-3 whitespace-nowrap hidden md:table-cell">
                      {student.CreatedOn}
                    </td>
                    <td className="p-3 whitespace-nowrap hidden md:table-cell">
                      {formatDate(student.createdAt)}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {student.FirstName} {student.LastName}
                    </td>
                    <td className="p-3 whitespace-nowrap">{student.Email}</td>
                    <td className="p-3 whitespace-nowrap">{student.Phone}</td>
                    <td className="p-3 whitespace-nowrap">{student.Branch}</td>

                    {/* Assigned To inline dropdown */}
                    <td className="p-3 whitespace-nowrap">
                      <select
                        defaultValue={student.Assigned || ""}
                        disabled={isSaving(student.id, "Assigned")}
                        onChange={(e) =>
                          handleInlineUpdate(student.id, "Assigned", e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brandBlue disabled:opacity-50 min-w-[120px]"
                      >
                        <option value="">— Unassigned —</option>
                        {staffList.map((staff) => (
                          <option
                            key={staff.id}
                            value={`${staff.FirstName} ${staff.LastName}`}
                          >
                            {staff.FirstName} {staff.LastName}
                          </option>
                        ))}
                      </select>
                      {isSaving(student.id, "Assigned") && (
                        <span className="ml-1 text-xs text-gray-400">saving…</span>
                      )}
                    </td>

                    {/* Status inline dropdown */}
                    <td className="p-3 whitespace-nowrap">
                      <select
                        defaultValue={student.Status || ""}
                        disabled={isSaving(student.id, "Status")}
                        onChange={(e) =>
                          handleInlineUpdate(student.id, "Status", e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brandBlue disabled:opacity-50 min-w-[140px]"
                      >
                        <option value="">— Select Status —</option>
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {isSaving(student.id, "Status") && (
                        <span className="ml-1 text-xs text-gray-400">saving…</span>
                      )}
                    </td>

                    <td className="p-3 whitespace-nowrap flex gap-3 text-brandBlue">
                      <Link to={`/app/editprofile/${student.id}`}>
                        <FiEye className="cursor-pointer" />
                      </Link>
                      {role === "superAdmin" && (
                        <FaTrash className="cursor-pointer text-red-500" />
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="p-4 text-center text-gray-500">
                  No student profiles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-xl p-6 text-center text-sm text-gray-500 shadow-sm">
            Loading students...
          </div>
        ) : students.length > 0 ? (
          students.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate">
                    {student.FirstName} {student.LastName}
                  </h3>
                  <p className="text-sm text-gray-600 break-all">
                    {student.Email || "N/A"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    ID: {student.id} | {student.Branch || "N/A"}
                  </p>
                </div>
                <StatusBadge status={student.Status} className="flex-shrink-0" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800 break-words">
                    {student.Phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Created By</p>
                  <p className="font-medium text-gray-800 break-words">
                    {student.CreatedOn || "N/A"}
                  </p>
                </div>
              </div>

              {/* Mobile inline dropdowns */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs uppercase text-gray-500 mb-1">Assigned To</p>
                  <select
                    defaultValue={student.Assigned || ""}
                    disabled={isSaving(student.id, "Assigned")}
                    onChange={(e) =>
                      handleInlineUpdate(student.id, "Assigned", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brandBlue disabled:opacity-50"
                  >
                    <option value="">— Unassigned —</option>
                    {staffList.map((staff) => (
                      <option
                        key={staff.id}
                        value={`${staff.FirstName} ${staff.LastName}`}
                      >
                        {staff.FirstName} {staff.LastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 mb-1">Status</p>
                  <select
                    defaultValue={student.Status || ""}
                    disabled={isSaving(student.id, "Status")}
                    onChange={(e) =>
                      handleInlineUpdate(student.id, "Status", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brandBlue disabled:opacity-50"
                  >
                    <option value="">— Select Status —</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  to={`/app/editprofile/${student.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brandBlue px-3 py-2 text-sm text-white w-full"
                >
                  <FiEye />
                  View Profile
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-6 text-center text-sm text-gray-500 shadow-sm">
            No student profiles found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {allUserData?.meta && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 px-2 text-sm text-gray-600">
          <div>
            Showing{" "}
            <strong>
              {(page - 1) * limit + 1} –{" "}
              {Math.min(page * limit, allUserData.meta.total)}
            </strong>{" "}
            of <strong>{allUserData.meta.total}</strong>
          </div>

          <div className="flex gap-2">
            <Button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition ${
                page === 1
                  ? "bg-brandDisable cursor-not-allowed"
                  : "bg-brandBlue hover:bg-brandHover"
              }`}
            >
              Prev
            </Button>

            <Button
              disabled={page * limit >= allUserData.meta.total}
              onClick={() => setPage((prev) => prev + 1)}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition ${
                page * limit >= allUserData.meta.total
                  ? "bg-brandDisable cursor-not-allowed"
                  : "bg-brandBlue hover:bg-brandHover"
              }`}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
