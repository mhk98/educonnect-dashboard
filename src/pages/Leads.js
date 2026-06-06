import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, Button } from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import {
  useCreateConsultationMutation,
  useDeleteConsultationMutation,
  useGetAllConsultationQuery,
  useUpdateConsultationMutation,
} from "../features/consultation/consultation";
import toast from "react-hot-toast";
import { LiaEditSolid } from "react-icons/lia";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdOutlineGridView } from "react-icons/md";
import axios from "axios";
import { Input, Label } from "@windmill/react-ui";
import { useGetAllBranchQuery } from "../features/branch/branch";
import { Users, Plus } from "lucide-react";
import StatusBadge from "../components/StatusBadge";

function Leads() {
  const today = new Date().toISOString().split("T")[0]; // e.g. "2025-06-23"
  const id = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const branch = localStorage.getItem("branch");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    fullName: "",
    phone: "",
    ieltsScore: "",
    destination: "",
    location: "",
    // month: '',
    startDate: "",
    endDate: "",
    selectedStatus: "",
  });

  const [isModalOpen1, setIsModalOpen1] = useState(false);

  const [leadId, setLeadId] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [todayCallDate, setTodayCallDate] = useState("");
  const [successCase, setSuccessCase] = useState("");
  const [myCase, setMyCase] = useState("");

  const {
    data: branchData,
    isLoading: branchLoading,
    isError: branchError,
  } = useGetAllBranchQuery();

  useEffect(() => {
    if (selectedType === today) {
      setTodayCallDate(selectedType);
    } else {
      setTodayCallDate("");
    }
  }, [selectedType, today]);

  useEffect(() => {
    if (selectedType === "Success Case") {
      setSuccessCase(selectedType);
    } else {
      setSuccessCase("");
    }
  }, [selectedType]);

  useEffect(() => {
    if (selectedType === "My Case") {
      setMyCase(selectedType);
    } else {
      setMyCase("");
    }
  }, [selectedType]);

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: errorsEdit },
  } = useForm();

  // const Params =
  // todayCallDate ? { appointmentDate: todayCallDate }
  //   : successCase ? {type: successCase, user_id:id}
  //   : myCase ? {user_id:id}
  //   :
  //   filters.startDate && filters.endDate ? {
  //       type: "Success Case",
  //       user_id: id,
  //       startDate: filters.startDate,
  //       endDate: filters.endDate
  //     }
  //   : {
  //       type: selectedType,
  //       fullName: filters.fullName,
  //       phone: filters.phone,
  //       ieltsScore: filters.ieltsScore,
  //       destination: filters.destination,
  //     };

  const Params = todayCallDate
    ? { appointmentDate: todayCallDate }
    : successCase
      ? { type: successCase, user_id: id }
      : myCase
        ? { user_id: id }
        : filters.startDate && filters.endDate
          ? {
              // type: "Success Case",
              user_id: id,
              startDate: filters.startDate,
              endDate: filters.endDate,
            }
          : {
              type: selectedType,
              // fullName: filters.fullName,
              // phone: filters.phone,
              // ieltsScore: filters.ieltsScore,
              // destination: filters.destination,
            };

  const queryParams =
    role === "superAdmin"
      ? {
          ...Params,
          searchTerm,
          location: filters.location,
          status: selectedStatus,
          page: currentPage,
          limit: itemsPerPage,
          role, // pass role
        }
      : role === "admin"
        ? {
            ...Params,
            searchTerm,
            location: branch,
            status: selectedStatus,
            page: currentPage,
            limit: itemsPerPage,
            role, // pass role
          }
        : role === "employee"
          ? {
              ...Params,
              searchTerm,
              location: branch,
              status: selectedStatus,
              page: currentPage,
              limit: itemsPerPage,
              role,
              user_id: id,
            }
          : null;

  const { data, isLoading, isError, error } =
    useGetAllConsultationQuery(queryParams);

  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    if (isError) {
      console.error("Error fetching consultations:", error);
    } else if (!isLoading && data?.data) {
      setConsultations(data.data);
    }
  }, [data, isLoading, isError, error]);

  // Form submit handlers for create & update
  const [createConsultation] = useCreateConsultationMutation();
  const [updateConsultation] = useUpdateConsultationMutation();
  const [deleteConsultation] = useDeleteConsultationMutation();

  const onFormSubmit = async (formData) => {
    const dataExtended = {
      ...formData,
      type: "Office Visits",
      url: "leads",
      userId: id,
    };
    const res = await createConsultation(dataExtended);

    if (res?.data?.success) {
      toast.success("Form submitted successfully");
      resetAdd();
      document.getElementById("user_lead_modal").close();
    } else {
      toast.error("Something went wrong");
    }
  };

  // const onFormEdit = async (data) => {
  //   const dataExtended = {
  //     ...data,
  //     userId: id,
  //     location:branch
  //   };

  //   console.log("Submitting Update:", { id: leadId, data: dataExtended });

  //   try {
  //     const res = await updateConsultation({ id: leadId, data }).unwrap(); // .unwrap() throws error on failure
  //     console.log("Update Success:", res);

  //     if (res.success) {
  //       toast.success(res.message || "Updated successfully");
  //       resetEdit();
  //       setIsModalOpen1(false);
  //     } else {
  //       toast.error("Update failed");
  //     }
  //   } catch (err) {
  //     console.error("Update Error:", err);
  //     toast.error(err?.data?.message || "Failed to update");
  //   }
  // };

  const onFormEdit = async (data) => {
    const info = {
      appointmentDate: data.appointmentDate,
      assignedTo: data.assignedTo,
      status: data.status,
      type: data.type,
      userId: id,
      location: branch,
    };

    console.log("Submitting Update:", { id: leadId, info });

    try {
      const res = await updateConsultation({ id: leadId, data: info }).unwrap();

      console.log("Update Success:", res);

      if (res.success) {
        toast.success(res.message || "Updated successfully");
        resetEdit();
        setIsModalOpen1(false);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error("Update Error:", err);
      toast.error(err?.data?.message || "Failed to update");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await deleteConsultation(id);
      if (res?.data?.success) {
        toast.success(res.data.message);
        // Optionally refetch or update consultations state here
        setConsultations((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast.error(res.error?.data?.message || "Failed. Please try again.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  // Fetch users for assignedTo select inputs
  const [admins, setAdmins] = useState([]);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://backend.eaconsultancy.org/api/v1/user/student",
        );
        const allUsers = response.data.data;
        const filteredAdmins = allUsers.filter(
          (user) =>
            user.Role?.toLowerCase() !== "student" &&
            ((user.Role?.toLowerCase() === "admin" && user.Branch === branch) ||
              (user.Role?.toLowerCase() === "employee" &&
                user.Branch === branch)),
        );
        setEmployees(
          allUsers.filter(
            (user) =>
              user.Role?.toLowerCase() === "employee" &&
              user.id === id &&
              user.Branch === branch,
          ),
        );
        setAdmins(filteredAdmins);
        setSuperAdmins(
          allUsers.filter((user) => user.Role?.toLowerCase() !== "student"),
        );
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [branch, id]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      fullName: "",
      phone: "",
      ieltsScore: "",
      destination: "",
      location: "",
      // month: '',
      startDate: "",
      endDate: "",
      selectedStatus: "",
      searchTerm: "",
    });
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const selectCls =
    "w-full border border-gray-200 rounded-xl px-3 py-3 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brandBlue/20 focus:border-brandBlue focus:bg-white transition-colors";

  return (
    <div className="w-full px-4 sm:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-brandBlue flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brandBlue">
              CRM
            </p>
            <h4 className="text-2xl font-bold text-gray-900 leading-tight">
              Lead Management
            </h4>
          </div>
        </div>
        <button
          onClick={() => {
            document.getElementById("user_lead_modal").showModal();
            resetAdd();
          }}
          className="flex items-center gap-2 px-4 py-3 bg-brandBlue hover:bg-blue-800 active:scale-95 transition-all text-white rounded-xl text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* Filter Card */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 mb-5">
        {/* Row 1: Search + Type + Status + Branch */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${role === "superAdmin" ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4 mb-4`}
        >
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Search Leads
            </label>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={selectCls}
              placeholder="Search by name, phone..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Lead Type
            </label>
            <select
              onChange={(e) => setSelectedType(e.target.value)}
              value={selectedType}
              className={selectCls}
            >
              <option value="">All Leads</option>
              <option value="Website Leads">Meta / Website Leads</option>
              <option value="Office Visits">Office Visits</option>
              <option value="My Case">My Case</option>
              <option value="Success Case">Previous Success Case</option>
              <option value={today}>Today Call List</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Lead Status
            </label>
            <select
              onChange={(e) => setSelectedStatus(e.target.value)}
              value={selectedStatus}
              className={selectCls}
            >
              <option value="">All Statuses</option>
              {[
                "Hot Lead",
                "Cool Lead",
                "Open Case",
                "First Call Done",
                "Very Interested",
                "Requires Followup",
                "Blocked",
                "Needs Assistant",
                "Case Closed",
                "Case Converted",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          {role === "superAdmin" && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Branch
              </label>
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className={selectCls}
              >
                <option value="">All Branches</option>
                {branchLoading && <option disabled>Loading...</option>}
                {branchData?.data?.map((b) => (
                  <option
                    key={b.id || b._id || b.name}
                    value={b.branch || b.name || b.Branch}
                  >
                    {b.branch || b.name || b.Branch}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Row 2: Date Range + Clear */}
        <div className="flex flex-col sm:flex-row gap-4 items-end pt-4 border-t border-gray-100">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              From Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              max={filters.endDate || undefined}
              className={selectCls}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              To Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              min={filters.startDate || undefined}
              className={selectCls}
            />
          </div>
          <div className="flex items-center gap-3 pb-0.5">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              <span className="font-semibold text-gray-800">
                {data?.meta?.total ?? consultations.length}
              </span>{" "}
              leads
            </span>
            <button
              onClick={() => {
                setSelectedType("");
                setSelectedStatus("");
                setTodayCallDate("");
                clearFilters();
              }}
              className="px-5 py-3 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {filters.startDate &&
        filters.endDate &&
        Params?.type === "Success Case" &&
        consultations.length > 0 && (
          <div className="alert alert-success my-8">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-lg text-green-800">
                🎉 Congratulations!!
              </span>
              <span className="text-gray-700">
                This month you have completed{" "}
                <strong>{consultations.length}</strong> Success Cases. Total
                Amount: <strong>{consultations.length * 1000} BDT. </strong>
                Bonus Amount:{" "}
                <strong>
                  {Math.floor(consultations.length / 5) * 1000} BDT
                </strong>
                {/* (based on every 5 Success Cases) */}
              </span>
            </div>
          </div>
        )}

      {/* Table */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table
          className="w-full text-sm text-left text-gray-700"
          style={{ minWidth: "1100px" }}
        >
          <thead>
            <tr className="border-b border-gray-100">
              {[
                "Created Date",
                "Name",
                "Assigned",
                "Type",
                "Status",
                "Next Appointment",
                "Destination",
                "Address",
                "Phone",
                "IELTS",
                "Score",
                "Branch",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-400 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {consultations.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">
                  {formatDate(c.createdAt)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">
                  {c.fullName ?? "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {c.assignedTo ?? "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {c.type ?? "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {c.appointmentDate ?? "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {c.destination ?? "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {c.address ?? "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {c.phone ?? "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {c.ielts ?? "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {c.ieltsScore ?? "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {c.location ?? "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {!(c.type === "Success Case" && role === "employee") && (
                      <button
                        title="Edit Lead"
                        onClick={() => {
                          setIsModalOpen1(true);
                          setLeadId(c.id);
                          resetEdit({
                            status: c.status || "",
                            type: c.type || "",
                            email: c.email || "",
                            assignedTo: c.assignedTo || "",
                            appointmentDate: c.appointmentDate || "",
                          });
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-brandBlue hover:text-white transition-colors"
                      >
                        <LiaEditSolid className="text-base" />
                      </button>
                    )}
                    <Link
                      to={`/app/editLeads/${c.id}`}
                      title="View Details"
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-brandBlue hover:text-white transition-colors"
                    >
                      <MdOutlineGridView className="text-base" />
                    </Link>
                    <button
                      title="Delete Lead"
                      onClick={() => handleDeleteUser(c.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-3">
        {consultations.length > 0 ? (
          consultations.map((consultation) => (
            <div
              key={consultation.id}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 break-words">
                    {consultation.fullName ?? ""}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 break-words">
                    {consultation.destination ?? ""}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatDate(consultation.createdAt) ?? ""}
                  </p>
                </div>
                <span className="flex-shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {consultation.status ?? "N/A"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase text-gray-500">Assigned</p>
                  <p className="font-medium text-gray-800 break-words">
                    {consultation.assignedTo ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Type</p>
                  <p className="font-medium text-gray-800 break-words">
                    {consultation.type ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800 break-words">
                    {consultation.phone ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Branch</p>
                  <p className="font-medium text-gray-800 break-words">
                    {consultation.location ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Next Apt</p>
                  <p className="font-medium text-gray-800 break-words">
                    {consultation.appointmentDate ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">IELTS</p>
                  <p className="font-medium text-gray-800 break-words">
                    {consultation.ielts ?? "N/A"}
                    {consultation.ieltsScore
                      ? ` (${consultation.ieltsScore})`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {consultation.type === "Success Case" &&
                role === "employee" ? null : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen1(true);
                      setLeadId(consultation.id);
                      resetEdit({
                        status: consultation.status || "",
                        type: consultation.type || "",
                        email: consultation.email || "",
                        assignedTo: consultation.assignedTo || "",
                        appointmentDate: consultation.appointmentDate || "",
                      });
                    }}
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700"
                  >
                    <LiaEditSolid />
                  </button>
                )}
                <Link
                  to={`/app/editLeads/${consultation.id}`}
                  title="View Details"
                  className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-3 py-2 text-sm text-white"
                >
                  <MdOutlineGridView />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDeleteUser(consultation.id)}
                  className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
            No leads found.
          </div>
        )}
      </div>

      {/* Pagination */}

      {data?.meta && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 px-2 text-sm text-gray-600">
          {/* Left info */}
          <div>
            Showing{" "}
            <strong>
              {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, data?.meta?.total)}
            </strong>{" "}
            of <strong>{data.meta.total}</strong>
          </div>

          {/* Right buttons */}
          <div className="flex w-full sm:w-auto items-center gap-2">
            {/* Prev */}
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition
                        ${
                          currentPage === 1
                            ? "bg-brandDisable cursor-not-allowed"
                            : "bg-brandBlue hover:bg-brandHover"
                        }`}
            >
              ← Prev
            </Button>

            {/* Page number */}
            <span className="whitespace-nowrap px-3 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
              Page {currentPage}
            </span>

            {/* Next */}
            <Button
              disabled={currentPage * itemsPerPage >= data.meta.total}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition
                        ${
                          currentPage * itemsPerPage >= data.meta.total
                            ? "bg-brandDisable cursor-not-allowed"
                            : "bg-brandBlue hover:bg-brandHover"
                        }`}
            >
              Next →
            </Button>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      <dialog id="user_lead_modal" className="modal">
        <div
          className="modal-box w-11/12 max-w-4xl overflow-y-auto p-4 sm:p-6 text-left"
          style={{ maxHeight: "85vh" }}
        >
          <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-4">
            Add New Lead
          </h3>
          <form
            onSubmit={handleSubmitAdd(onFormSubmit)}
            className="w-full mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  {...registerAdd("fullName", { required: true })}
                />
                {errorsAdd.fullName && (
                  <p className="text-red-500 text-sm">Full name is required</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-1"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  placeholder="+8801XXXXXXXXX"
                  {...registerAdd("phone", { required: true })}
                />
                {errorsAdd.phone && (
                  <p className="text-red-500 text-sm">
                    Phone number is required
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  {...registerAdd("email")}
                />
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium mb-1"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  {...registerAdd("date")}
                />
              </div>

              <div>
                <label
                  htmlFor="destination"
                  className="block text-sm font-medium mb-1"
                >
                  Prefd Destination
                </label>
                <select
                  id="destination"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  {...registerAdd("destination")}
                >
                  <option value="">Select your destination</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Germany</option>
                  <option>Belgium</option>
                  <option>Hungary</option>
                  <option>Denmark</option>
                  <option>Austria</option>
                  <option>Finland</option>
                  <option>Sweden</option>
                  <option>Cyprus</option>
                  <option>Malaysia</option>
                  <option>China</option>
                  <option>Dubai</option>
                  <option>Italy</option>
                  <option>Croatia</option>
                  <option>Malta</option>
                  <option>Others</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium mb-1"
                >
                  Full Address
                </label>
                <input
                  id="address"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  {...registerAdd("address")}
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium mb-1"
                >
                  Lead Status{" "}
                </label>
                <select
                  id="status"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  {...registerAdd("status")}
                >
                  <option value="">Select Status</option>
                  <option value="Hot Lead">Hot Lead</option>
                  <option value="Cool Lead">Cool Lead</option>
                  <option value="Open Case">Open Case</option>
                  <option value="First Call Done">First Call Done</option>
                  <option value="Very Interested">Very Interested</option>
                  <option value="Requires Followup">Requires Followup</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Needs Assistant">Needs Assistant</option>
                  <option value="Case Closed">Case Closed</option>
                  <option value="Case Converted">Case Converted</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="ielts"
                  className="block text-sm font-medium mb-1"
                >
                  IELTS
                </label>
                <select
                  id="ielts"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  {...registerAdd("ielts")}
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="ieltsScore"
                  className="block text-sm font-medium mb-1"
                >
                  IELTS Score
                </label>
                <input
                  type="text"
                  id="ieltsScore"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  {...registerAdd("ieltsScore")}
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium mb-1"
                >
                  Appointment Location <span className="text-red-500">*</span>
                </label>
                <select
                  id="location"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  {...registerAdd("location", { required: true })}
                >
                  <option value="">Select Location</option>
                  {branchLoading && (
                    <option disabled>Loading branches...</option>
                  )}
                  {branchError && (
                    <option disabled>Error loading branches</option>
                  )}
                  {branchData?.data?.map((branchItem) => (
                    <option
                      key={branchItem.id || branchItem._id || branchItem.name}
                      value={
                        branchItem.branch ||
                        branchItem.name ||
                        branchItem.Branch
                      }
                    >
                      {branchItem.branch ||
                        branchItem.name ||
                        branchItem.Branch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="applicationCode"
                  className="block text-sm font-medium mb-1"
                >
                  Application Code{" "}
                </label>
                <input
                  id="applicationCode"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  {...registerAdd("applicationCode")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  SSC Year
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  {...registerAdd("sscYear")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  SSC Department
                </label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  {...registerAdd("sscDepartment")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  SSC GPA
                </label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  {...registerAdd("sscCGPA")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  HSC Year
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  {...registerAdd("hscYear")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  HSC Department
                </label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2"
                  {...registerAdd("hscDepartment")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  HSC GPA
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  {...registerAdd("hscCGPA")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Bachelor Year
                </label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  {...registerAdd("bachelorYear")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Bachelor Department
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  {...registerAdd("bachelorDepartment")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Bachelor GPA
                </label>
                <input
                  className="w-full border rounded px-3 py-2"
                  {...registerAdd("bachelorCGPA")}
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-4">
              <button
                type="button"
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
                onClick={() =>
                  document.getElementById("user_lead_modal").close()
                }
              >
                Close
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-brandBlue text-white rounded-xl hover:bg-brandBlue"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Edit Lead Modal */}
      <Modal isOpen={isModalOpen1} onClose={() => setIsModalOpen1(false)}>
        <ModalHeader>Edit Lead</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmitEdit(onFormEdit)} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Lead Type
              </label>
              <select
                {...registerEdit("type")}
                className="input input-bordered w-full shadow-md p-3"
              >
                <option value="">Select Type</option>
                <option value="Website Leads">
                  Meta Leads / Website Leads
                </option>
                <option value="Office Visits">Office Visits</option>
                <option value="Success Case">Previous Success Case</option>
              </select>
              {errorsEdit.type && (
                <p className="text-red-500 text-sm mt-1">
                  {errorsEdit.type.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Lead Status
              </label>
              <select
                {...registerEdit("status")}
                className="input input-bordered w-full shadow-md p-3"
              >
                <option value="">Select Status</option>
                <option value="Hot Lead">Hot Lead</option>
                <option value="Cool Lead">Cool Lead</option>
                <option value="Open Case">Open Case</option>
                <option value="First Call Done">First Call Done</option>
                <option value="Very Interested">Very Interested</option>
                <option value="Requires Followup">Requires Followup</option>
                <option value="Blocked">Blocked</option>
                <option value="Needs Assistant">Needs Assistant</option>
                <option value="Case Closed">Case Closed</option>
                <option value="Case Converted">Case Converted</option>
              </select>
              {errorsEdit.status && (
                <p className="text-red-500 text-sm mt-1">
                  {errorsEdit.status.message}
                </p>
              )}
            </div>
            {/* <div>
              <label className="block text-sm text-gray-700 mb-2">Email</label>
              <input
                type="email"
                {...registerEdit("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
                placeholder="Enter email address"
                className="input input-bordered w-full shadow-md p-3"
              />
              {errorsEdit.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errorsEdit.email.message}
                </p>
              )}
            </div> */}

            <div>
              <label className="block text-sm text-gray-700 mb-2">Email</label>

              <input
                type="email"
                {...registerEdit("email", {
                  required: "Email is required",
                  validate: (value) =>
                    value.trim() !== "" || "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
                placeholder="Enter email address"
                className="input input-bordered w-full shadow-md p-3"
              />

              {errorsEdit.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errorsEdit.email.message}
                </p>
              )}
            </div>
            {(role === "superAdmin" ||
              role === "admin" ||
              role === "employee") && (
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Assigned To
                </label>
                <select
                  {...registerEdit("assignedTo")}
                  className="input input-bordered w-full shadow-md p-3"
                >
                  {(role === "superAdmin"
                    ? superAdmins
                    : role === "admin"
                      ? admins
                      : employees
                  ).map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.FirstName} {user.LastName}
                    </option>
                  ))}
                </select>
                {errorsEdit.assignedTo && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsEdit.assignedTo.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="appointmentDate"
                className="block text-sm font-medium mb-1"
              >
                Next Appointment Date
              </label>
              <input
                type="date"
                id="appointmentDate"
                className="w-full border border-gray-200 rounded-xl px-3 py-2"
                {...registerEdit("appointmentDate")}
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
              <Button
                type="button"
                layout="outline"
                onClick={() => setIsModalOpen1(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                style={{ backgroundColor: "#1B2E6B" }}
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

export default Leads;
