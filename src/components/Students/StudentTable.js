import React, { useState, useMemo } from "react";
import { FaTrash } from "react-icons/fa";
import { LiaEditSolid } from "react-icons/lia";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { Input, Label } from "@windmill/react-ui";
import {
  useGetAllUserQuery,
  useGetUserDataByIdQuery,
  useUpdateUserMutation,
} from "../../features/auth/auth";
import { FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Modal, ModalHeader, ModalBody, Button } from "@windmill/react-ui";
import { useGetAllBranchQuery } from "../../features/branch/branch";

export default function StudentTable() {
  const [filterBranch, setFilterBranch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stdId, setStdId] = useState("");

  const [searchValue, setSearchValue] = useState("");

  const [page, setPage] = useState(1);
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
      ? {
          // FirstName: firstName,
          // LastName: lastName,
          // id: studentId,
          searchTerm: searchValue,
          Branch: filterBranch,
          roleMode: "onlyStudent",
          page,
          limit,
        }
      : role === "admin" || role === "employee"
        ? {
            Branch: branch,
            // FirstName: firstName,
            // LastName: lastName,
            // id: studentId,
            searchTerm: searchValue,
            page,
            limit,
          }
        : null;

  console.log("StudentQuery", queryParams);

  const { data: allUserData, isLoading } = useGetAllUserQuery(queryParams, {
    skip: !queryParams,
  });

  const { data: currentUserData } = useGetUserDataByIdQuery(userId);

  const students = useMemo(() => {
    let users = [];

    if (role === "student") {
      users = currentUserData?.data ? [currentUserData.data] : [];
    } else {
      users = allUserData?.data || [];
    }

    return users.filter(
      (user) =>
        user.Role?.toLowerCase() === "student" && user.Profile === "active",
    );
  }, [role, allUserData, currentUserData]);

  console.log("students", students);
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm();

  const [updateUser] = useUpdateUserMutation();

  const onFormEdit = async (data) => {
    console.log("Submitting Update:", { id: stdId, data });

    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const res = await updateUser({
        id: stdId,
        data,
      }).unwrap();

      console.log("Update Success:", res);

      if (res.success) {
        toast.success(res.message || "Updated successfully");
        resetEdit();
        setIsModalOpen(false);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error("Update Error:", err);
      toast.error(err?.data?.message || "Failed to update");
    }
  };

  const clearFilters = () => {
    setSearchValue("");
    setFilterBranch("");
  };

  const openEditModal = (student) => {
    setIsModalOpen(true);
    setStdId(student.id);
    resetEdit({
      Status: student.Status || "",
    });
  };

  return (
    <div className="p-3 sm:p-4 max-w-7xl mx-auto">
      {/* Filter Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 bg-white rounded-xl shadow-sm p-3 sm:p-4">
        <Label>
          <span className="text-sm text-gray-700">Search Student</span>
          {/* <span>First Name</span> */}
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="mt-1"
            placeholder="Search by name or email"
          />
        </Label>
        {/* <Label>
          <span>Last Name</span>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1"
            placeholder="First Name"
          />
        </Label>
        <Label>
          <span>Student Id</span>
          <Input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="mt-1"
            placeholder="First Name"
          />
        </Label> */}

        {/* <Label>
          <span>Country</span>
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1"
            placeholder="First Name"
          />
        </Label>
        <Label>
          <span>University</span>
          <Input
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="mt-1"
            placeholder="First Name"
          />
        </Label>
        <Label>
          <span>Intake</span>
          <Input
            value={intake}
            onChange={(e) => setIntake(e.target.value)}
            className="mt-1"
            placeholder="First Name"
          />
        </Label> */}

        <Label>
          <span className="text-sm text-gray-700">Branch</span>
          {/* <span htmlFor="Branch" className="block mb-1">
            Branch
          </span> */}
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
                value={
                  branchItem.branch || branchItem.name || branchItem.Branch
                }
              >
                {branchItem.branch || branchItem.name || branchItem.Branch}
              </option>
            ))}
          </select>
        </Label>

        <div className="flex items-end gap-2">
          <Button
            className="w-full bg-brandRed text-white"
            onClick={clearFilters}
          >
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
                  <td className="p-3 whitespace-nowrap">{student.Assigned}</td>
                  <td className="p-3 whitespace-nowrap">
                    {student.Status || "N/A"}
                  </td>
                  <td className="p-3 whitespace-nowrap flex gap-3 text-brandRed">
                    <LiaEditSolid
                      className="cursor-pointer"
                      title="Edit Lead"
                      onClick={() => openEditModal(student)}
                    />
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
                <span className="flex-shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {student.Status || "N/A"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800 break-words">
                    {student.Phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Assigned To</p>
                  <p className="font-medium text-gray-800 break-words">
                    {student.Assigned || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Created By</p>
                  <p className="font-medium text-gray-800 break-words">
                    {student.CreatedOn || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Created On</p>
                  <p className="font-medium text-gray-800 break-words">
                    {student.createdAt ? formatDate(student.createdAt) : "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(student)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
                >
                  <LiaEditSolid />
                  Edit
                </button>
                <Link
                  to={`/app/editprofile/${student.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brandRed px-3 py-2 text-sm text-white"
                >
                  <FiEye />
                  View
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
      {/* {allUserData?.meta && (
        <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-600">
          <div>
            Showing{" "}
            <strong>
              {(page - 1) * limit + 1} -{" "}
              {Math.min(page * limit, allUserData.meta.total)}
            </strong>{" "}
            of <strong>{allUserData.meta.total}</strong>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <Button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="bg-gray-200"
            >
              Prev
            </Button>
            <Button
              disabled={page * limit >= allUserData.meta.total}
              onClick={() => setPage((prev) => prev + 1)}
              className="bg-gray-200"
            >
              Next
            </Button>
          </div>
        </div>
      )} */}

      {allUserData?.meta && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 px-2 text-sm text-gray-600">
          {/* Left side */}
          <div>
            Showing{" "}
            <strong>
              {(page - 1) * limit + 1} -{" "}
              {Math.min(page * limit, allUserData.meta.total)}
            </strong>{" "}
            of <strong>{allUserData.meta.total}</strong>
          </div>

          {/* Right side */}
          <div className="flex gap-2">
            <Button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition
                ${
                  page === 1
                    ? "bg-brandDisable cursor-not-allowed"
                    : "bg-brandRed hover:bg-brandHover"
                }`}
            >
              Prev
            </Button>

            <Button
              disabled={page * limit >= allUserData.meta.total}
              onClick={() => setPage((prev) => prev + 1)}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition
                ${
                  page * limit >= allUserData.meta.total
                    ? "bg-brandDisable cursor-not-allowed"
                    : "bg-brandRed hover:bg-brandHover"
                }`}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>Edit Lead</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmitEdit(onFormEdit)} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Status</label>
              <select
                {...registerEdit("Status")}
                className="input input-bordered w-full shadow-md p-3"
              >
                <option value="">Select Status</option>

                <option value="File Opened">File Opened</option>
                <option value="Application Submitted">
                  Application Submitted
                </option>
                <option value="Interview Date Received">
                  Interview Date Received
                </option>
                <option value="Offer Received">Offer Received</option>
                <option value="LOA Received">LOA Received</option>
                <option value="Visa Applied">Visa Applied</option>
                <option value="Visa Received">Visa Received</option>
                <option value="archive">Archive</option>
                <option value="Rejected">Rejected</option>
              </select>
              {errorsEdit.Status && (
                <p className="text-red-500 text-sm mt-1">
                  {errorsEdit.Status.message}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
              <Button
                type="button"
                layout="outline"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: "#C71320" }}
                className="w-full sm:w-auto"
              >
                Save
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
