import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { Input, Label, Button } from "@windmill/react-ui";
import toast from "react-hot-toast";
import { BiShow, BiSolidTrashAlt } from "react-icons/bi";
import {
  useDeleteApplicationMutation,
  useGetAllApplicationQuery,
  useUpdateApplicationMutation,
} from "../../features/application/application";
import { useGetAllBranchQuery } from "../../features/branch/branch";
import { useGetAllUserQuery } from "../../features/auth/auth";
import StatusBadge from "../StatusBadge";

const STATUS_OPTIONS = [
  "Application Submitted",
  "University Application Initiated",
  "Offer Received",
  "Tuition Fees Paid",
  "LOA Received",
  "Visa Submitted",
  "Visa Received",
  "Case Closed",
];

export default function ApplicationsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchValue, setSearchValue] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [savingCell, setSavingCell] = useState(null); // "id-field"

  const role = localStorage.getItem("role");
  const Branch = localStorage.getItem("branch");
  const userId = localStorage.getItem("userId");

  const { data: branchData, isLoading: branchLoading, isError: branchError } =
    useGetAllBranchQuery();

  const queryArgs =
    role === "superAdmin"
      ? { Branch: filterBranch, searchTerm: searchValue, page: currentPage, limit: itemsPerPage }
      : role === "admin" || role === "employee"
        ? { searchTerm: searchValue, Branch, page: currentPage, limit: itemsPerPage }
        : role === "student"
          ? { user_id: userId, page: currentPage, limit: itemsPerPage }
          : null;

  const { data, isLoading } = useGetAllApplicationQuery(queryArgs, { skip: !queryArgs });

  const [updateApplication] = useUpdateApplicationMutation();
  const [deleteApplication] = useDeleteApplicationMutation();

  const applications = useMemo(() => data?.data || [], [data]);

  // Fetch staff for Assignee dropdown
  const { data: staffData } = useGetAllUserQuery(
    { roleMode: "excludeStudent", limit: 100 },
    { skip: role === "student" },
  );

  const staffList = useMemo(() => {
    const all = staffData?.data || [];
    if (role === "superAdmin") return all.filter((u) => u.Role !== "student");
    return all.filter((u) => u.Role !== "student" && u.Branch === Branch);
  }, [staffData, role, Branch]);

  const handleInlineUpdate = async (applicationId, studentId, field, value) => {
    const cellKey = `${applicationId}-${field}`;
    setSavingCell(cellKey);
    try {
      const payload =
        field === "status"
          ? { status: value, user_id: studentId, userId }
          : { assignee: value, user_id: studentId, userId };

      const res = await updateApplication({ id: applicationId, data: payload });
      if (res.data?.success) {
        toast.success("Updated successfully");
      } else {
        toast.error(res.error?.data?.message || "Update failed.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setSavingCell(null);
    }
  };

  const handleDeleteApplication = async (acknowledge) => {
    try {
      const res = await deleteApplication(acknowledge);
      if (res.data?.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.error?.data?.message || "Deletion failed.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  const isSaving = (id, field) => savingCell === `${id}-${field}`;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  };

  const clearFilters = () => {
    setSearchValue("");
    setFilterBranch("");
    setCurrentPage(1);
  };

  return (
    <div className="p-3 sm:p-4 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 bg-white rounded-xl shadow-sm p-3 sm:p-4">
        <Label>
          <span className="text-sm text-gray-700">Search Applications</span>
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="mt-1"
            placeholder="Search..."
          />
        </Label>

        {role === "superAdmin" && (
          <Label>
            <span className="text-sm text-gray-700">Branch</span>
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="w-full border rounded p-2 mt-1"
            >
              <option value="">Select Branch</option>
              {branchLoading && <option disabled>Loading branches...</option>}
              {branchError && <option disabled>Error loading branches</option>}
              {branchData?.data?.map((b) => (
                <option key={b.id || b._id || b.name} value={b.branch || b.name || b.Branch}>
                  {b.branch || b.name || b.Branch}
                </option>
              ))}
            </select>
          </Label>
        )}

        <div className="flex items-end gap-2">
          <Button className="w-full bg-brandBlue text-white" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full w-full border border-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr className="text-left">
              <th className="p-3">Student ID</th>
              <th className="p-3">Ack No</th>
              <th className="p-3">Date Created</th>
              <th className="p-3">Student</th>
              <th className="p-3">University</th>
              <th className="p-3">Program</th>
              <th className="p-3">Intake</th>
              <th className="p-3">Created</th>
              <th className="p-3">Status</th>
              <th className="p-3">Assignee</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="11" className="p-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : applications.length > 0 ? (
              applications.map((program, idx) => (
                <tr
                  key={program.id}
                  className={`text-sm border-t border-gray-200 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="p-3">{program.user_id}</td>
                  <td className="p-3">{program.acknowledge}</td>
                  <td className="p-3">{formatDate(program.createdAt)}</td>
                  <td className="p-3">{program.FirstName} {program.LastName}</td>
                  <td className="p-3">{program.university}</td>
                  <td className="p-3">{program.program}</td>
                  <td className="p-3">{program.intake}</td>
                  <td className="p-3">{program.FirstName} {program.LastName}</td>

                  {/* Status inline dropdown */}
                  <td className="p-3 whitespace-nowrap">
                    <select
                      defaultValue={program.status || ""}
                      disabled={isSaving(program.id, "status")}
                      onChange={(e) =>
                        handleInlineUpdate(program.id, program.user_id, "status", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brandBlue disabled:opacity-50 min-w-[160px]"
                    >
                      <option value="">— Select Status —</option>
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {isSaving(program.id, "status") && (
                      <span className="ml-1 text-xs text-gray-400">saving…</span>
                    )}
                  </td>

                  {/* Assignee inline dropdown */}
                  <td className="p-3 whitespace-nowrap">
                    <select
                      defaultValue={program.assignee || ""}
                      disabled={isSaving(program.id, "assignee")}
                      onChange={(e) =>
                        handleInlineUpdate(program.id, program.user_id, "assignee", e.target.value)
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brandBlue disabled:opacity-50 min-w-[130px]"
                    >
                      <option value="">— Unassigned —</option>
                      {staffList.map((staff) => (
                        <option key={staff.id} value={`${staff.FirstName} ${staff.LastName}`}>
                          {staff.FirstName} {staff.LastName}
                        </option>
                      ))}
                    </select>
                    {isSaving(program.id, "assignee") && (
                      <span className="ml-1 text-xs text-gray-400">saving…</span>
                    )}
                  </td>

                  <td className="p-3 flex gap-3 text-brandBlue">
                    <Link to={`/app/editprofile/${program.user_id}`}>
                      <BiShow fontSize={20} className="cursor-pointer" />
                    </Link>
                    {role === "superAdmin" && (
                      <BiSolidTrashAlt
                        fontSize={18}
                        className="cursor-pointer text-red-500"
                        onClick={() => handleDeleteApplication(program.acknowledge)}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="p-4 text-center text-gray-500">
                  No student applications found.
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
            Loading applications...
          </div>
        ) : applications.length > 0 ? (
          applications.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 break-words">
                    {program.FirstName} {program.LastName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 break-words">
                    {program.university || "N/A"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    ID: {program.user_id || "N/A"} | Ack: {program.acknowledge || "N/A"}
                  </p>
                </div>
                <StatusBadge status={program.status} className="flex-shrink-0" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase text-gray-500">Program</p>
                  <p className="font-medium text-gray-800 break-words">{program.program || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Intake</p>
                  <p className="font-medium text-gray-800 break-words">{program.intake || "N/A"}</p>
                </div>
              </div>

              {/* Mobile inline dropdowns */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs uppercase text-gray-500 mb-1">Status</p>
                  <select
                    defaultValue={program.status || ""}
                    disabled={isSaving(program.id, "status")}
                    onChange={(e) =>
                      handleInlineUpdate(program.id, program.user_id, "status", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brandBlue disabled:opacity-50"
                  >
                    <option value="">— Select Status —</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500 mb-1">Assignee</p>
                  <select
                    defaultValue={program.assignee || ""}
                    disabled={isSaving(program.id, "assignee")}
                    onChange={(e) =>
                      handleInlineUpdate(program.id, program.user_id, "assignee", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-brandBlue disabled:opacity-50"
                  >
                    <option value="">— Unassigned —</option>
                    {staffList.map((staff) => (
                      <option key={staff.id} value={`${staff.FirstName} ${staff.LastName}`}>
                        {staff.FirstName} {staff.LastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/app/editprofile/${program.user_id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-brandBlue px-3 py-2 text-sm text-white"
                >
                  <BiShow />
                  View
                </Link>
                {role === "superAdmin" && (
                  <button
                    type="button"
                    onClick={() => handleDeleteApplication(program.acknowledge)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    <BiSolidTrashAlt />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-6 text-center text-sm text-gray-500 shadow-sm">
            No student applications found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {data?.meta && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 px-2 text-sm text-gray-600">
          <div>
            Showing{" "}
            <strong>
              {(currentPage - 1) * itemsPerPage + 1} –{" "}
              {Math.min(currentPage * itemsPerPage, data.meta.total)}
            </strong>{" "}
            of <strong>{data.meta.total}</strong>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition ${
                currentPage === 1
                  ? "bg-brandDisable cursor-not-allowed"
                  : "bg-brandBlue hover:bg-brandHover"
              }`}
            >
              Prev
            </Button>

            <span className="whitespace-nowrap px-3 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
              Page {currentPage}
            </span>

            <Button
              disabled={currentPage * itemsPerPage >= data.meta.total}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition ${
                currentPage * itemsPerPage >= data.meta.total
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
