import React, { useEffect, useState } from "react";
import {
  useDeleteCommissionMutation,
  useGetAllCommissionQuery,
  useUpdateCommissionMutation,
} from "../../features/commission/commission";
import toast from "react-hot-toast";
import { LiaEditSolid } from "react-icons/lia";
import { FaTrash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { Modal, ModalHeader, ModalBody, Button } from "@windmill/react-ui";
import StatusBadge from "../StatusBadge";

const ComissionPaymentInProgress = () => {
  const user_id = localStorage.getItem("userId");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const { data, isLoading, isError, error } = useGetAllCommissionQuery({
    page: currentPage,
    limit: itemsPerPage,
    user_id,
    assignedTo_id: user_id,
  });
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (isError) {
      console.log("Error fetching", error);
    } else if (!isLoading && data) {
      const filteredPayments = data.data.filter(
        (item) => item.status === "PAID",
      );
      setPayments(filteredPayments);
    }
  }, [data, isLoading, isError, error]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [paymentId, setPaymentId] = useState("");

  const [updateCommission] = useUpdateCommissionMutation();

  const onFormEdit = async (data) => {
    const formData = new FormData();
    formData.append("status", data.status);

    if (file) {
      formData.append("file", file);
    }

    try {
      const res = await updateCommission({ id: paymentId, data: formData });
      if (res.data?.success) {
        toast.success(res.data.message);
        reset();
        setIsModalOpen(false);
      } else {
        toast.error(res.error?.data?.message || "Failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const [deleteCommission] = useDeleteCommissionMutation();

  const handleDeleteUser = async (id) => {
    try {
      const res = await deleteCommission(id);
      if (res.data?.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.error?.data?.message || "Failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };

  const tableWrapClass =
    "hidden w-full overflow-x-auto rounded-[24px] border border-gray-100 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.06)] lg:block";
  const thClass =
    "min-w-[160px] border-b border-gray-100 bg-gray-50/90 px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-gray-500";
  const tdClass = "whitespace-nowrap px-4 py-4 text-sm text-gray-700";

  return (
    <div className="w-full">
      <div className="space-y-3 lg:hidden">
        {isLoading ? (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
            Loading paid commissions...
          </div>
        ) : payments.length > 0 ? (
          payments.map((payment, idx) => (
            <div
              key={payment.id || idx}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-gray-900">
                    {payment.Branch || "N/A"}
                  </h3>
                  <p className="break-words text-sm text-gray-600">
                    {payment.purpose || "N/A"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatDate(payment.createdAt)}
                  </p>
                </div>
                <StatusBadge status={payment.status} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase text-gray-500">Amount</p>
                  <p className="font-semibold text-gray-900">
                    {payment.amount}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Branch</p>
                  <p className="break-words font-medium text-gray-800">
                    {payment.Branch || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(true);
                    setPaymentId(payment.id);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700"
                >
                  <LiaEditSolid className="text-lg" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteUser(payment.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
                >
                  <FaTrash className="text-sm" />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
            No paid commission records found.
          </div>
        )}
      </div>

      <div className={tableWrapClass}>
      <table className="w-full bg-white text-left text-sm text-gray-700">
        <thead>
          <tr>
            <th className={thClass}>Date</th>
            <th className={thClass}>Amount</th>
            <th className={thClass}>Purpose</th>
            <th className={thClass}>Branch</th>
            <th className={thClass}>Status</th>
            <th className={thClass}>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-100 bg-white transition hover:bg-red-50/30"
            >
              <td className={tdClass}>
                {formatDate(payment.createdAt)}
              </td>
              <td className={`${tdClass} font-semibold text-gray-900`}>
                {payment.amount}
              </td>
              <td className={tdClass}>{payment.purpose}</td>
              <td className={tdClass}>{payment.Branch}</td>
              <td className={tdClass}>
                <StatusBadge status={payment.status} />
              </td>
              <td className="flex gap-2 whitespace-nowrap px-4 py-4 text-brandBlue">
                <LiaEditSolid
                  fontSize={26}
                  onClick={() => {
                    setIsModalOpen(true);
                    setPaymentId(payment.id);
                  }}
                  className="cursor-pointer rounded-xl bg-red-50 p-2.5 transition hover:bg-red-100"
                />
                <FaTrash
                  onClick={() => handleDeleteUser(payment.id)}
                  fontSize={24}
                  className="cursor-pointer rounded-xl bg-red-50 p-2.5 text-red-500 transition hover:bg-red-100"
                />
              </td>
            </tr>
          ))}
        </tbody>
        {/* ): (
                              <tbody>
                              {superAdminPayments.map((payment, idx) => (
                                <tr
                                  key={idx}
                                  className={`border-b border-gray-200 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                                >
                                  <td className="p-3 whitespace-nowrap">{formatDate(payment.createdAt)}</td>
                                  <td className="p-3 whitespace-nowrap">{payment.amount}</td>
                                  <td className="p-3 whitespace-nowrap">{payment.purpose}</td>
                                  <td className="p-3 whitespace-nowrap">{payment.branch}</td>
                                  <td className="p-3 whitespace-nowrap">{payment.status}</td>
                                  <td className="p-3 whitespace-nowrap flex gap-3 text-brandBlue">
                                    <LiaEditSolid
                                      fontSize={20}
                                      onClick={() => {
                                        setIsModalOpen(true);
                                        setPaymentId(payment.id);
                                     
                                      }}
                                      className="cursor-pointer"
                                    />
                                    <FaTrash
                                      onClick={() => handleDeleteUser(payment.id)}
                                      fontSize={20}
                                      className="cursor-pointer text-red-500"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            )
                          } */}

        {/* ✅ Move this modal outside the map */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalHeader className="mb-6 text-lg font-bold text-gray-900">
            Edit Commission Information
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onFormEdit)}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Payment Status
                  </label>
                  <select
                    {...register("status", { required: "Status is required" })}
                    onKeyDown={handleEnter}
                    className="input input-bordered w-full rounded-2xl border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandBlue"
                  >
                    <option value="">Select Status</option>
                    <option value="PAID">PAID</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.status.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Upload Payment Documents
                  </label>
                  <input
                    type="file"
                    name="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="block w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  type="submit"
                  className="btn w-full rounded-2xl bg-brandBlue hover:bg-blue-800 text-white px-8 py-3 font-semibold sm:w-auto"
                >
                  Save
                </Button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      </table>
      </div>

      {data?.meta && (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 px-2 text-sm text-gray-600 sm:flex-row">
          {/* Left info */}
          <div>
            Showing{" "}
            <strong>
              {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, data.meta.total)}
            </strong>{" "}
            of <strong>{data.meta.total}</strong>
          </div>

          {/* Right buttons */}
          <div className="flex w-full items-center gap-2 sm:w-auto">
            {/* Prev */}
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className={`w-full rounded-2xl px-5 py-3 font-semibold text-white transition sm:w-auto
                ${
                  currentPage === 1
                    ? "bg-brandDisable cursor-not-allowed"
                    : "bg-brandBlue hover:bg-brandHover"
                }`}
            >
              ← Prev
            </Button>

            {/* Page number */}
            <span className="whitespace-nowrap rounded-full bg-gray-100 px-4 py-2 font-semibold text-gray-700">
              Page {currentPage}
            </span>

            {/* Next */}
            <Button
              disabled={currentPage * itemsPerPage >= data.meta.total}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`w-full rounded-2xl px-5 py-3 font-semibold text-white transition sm:w-auto
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
    </div>
  );
};

export default ComissionPaymentInProgress;
