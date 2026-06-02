import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button } from "@windmill/react-ui";
import toast from "react-hot-toast";
import { LiaEditSolid } from "react-icons/lia";
import { FaTrash } from "react-icons/fa";
import { Modal, ModalHeader, ModalBody } from "@windmill/react-ui";
import {
  useDeletePendingPaymentMutation,
  useGetAllPendingPaymentQuery,
  useGetAllPendingPaymentWithoutQueryQuery,
  useUpdatePendingPaymentMutation,
} from "../../features/pendingPayment/pendingPayment";
import Invoice from "./Invoice";
import { TbCurrencyTaka } from "react-icons/tb";
import { useGetAllBranchQuery } from "../../features/branch/branch";

function Amount() {
  const role = localStorage.getItem("role");
  const branch = localStorage.getItem("branch");
  const [selectBranch, setSelectBranch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const {
    data: branchData,
    isLoading: branchLoading,
    isError: branchError,
  } = useGetAllBranchQuery();

  const queryParams = { page: currentPage, limit: itemsPerPage };

  const { data, isLoading, isError, error } =
    useGetAllPendingPaymentQuery(queryParams);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (isError) {
      console.log("Error fetching", error);
    } else if (!isLoading && data) {
      setPayments(data?.data?.data);
    }
  }, [data, isLoading, isError, error]);

  const {
    data: data1,
    isLoading: isLoading1,
    isError: isError1,
    error: error1,
  } = useGetAllPendingPaymentQuery({
    page: currentPage,
    limit: itemsPerPage,
    branch: branch,
  });
  const [adminPayments, setAdminPayments] = useState([]);

  useEffect(() => {
    if (isError1) {
      console.log("Error fetching", error1);
    } else if (!isLoading1 && data1) {
      // const allPayments = data1?.data?.data;

      // // Filter out students
      // const filtered = allPayments.filter(
      //   (payments) => payments.branch === branch
      // );

      setAdminPayments(data1?.data?.data);
    }
  }, [data1, isLoading1, isError1, error1, branch]);

  console.log("StudentPayment", payments);

  const {
    data: data2,
    isLoading: isLoading2,
    isError: isError2,
    error: error2,
  } = useGetAllPendingPaymentWithoutQueryQuery();

  console.log("Adminamount", data2?.data);
  const [filteringPayments, setFilteringPayments] = useState([]);
  const [totalBranchAmount, setTotalBranchAmount] = useState(0);
  const [totalDebitAmount, setTotalDebitAmount] = useState(0);

  useEffect(() => {
    if (isError2) {
      console.log("Error fetching", error2);
    } else if (!isLoading2 && data2) {
      const allPayments = data2?.data;

      // Filter out students
      const filtered = allPayments?.filter(
        (payments) => payments.branch === selectBranch,
      );
      setFilteringPayments(filtered);

      const filteredBranchCredit = filtered.filter(
        (payment) =>
          ["Cash-In", "Offline", "Online"].includes(payment.paymentStatus) &&
          payment.status === "PAID",
      );

      let credit = 0;
      filteredBranchCredit.forEach((payment) => {
        credit += payment.amount;
      });
      setTotalBranchAmount(credit);

      const filteredBranchDebit = filtered.filter(
        (payment) =>
          ["Cash-Out"].includes(payment.paymentStatus) &&
          payment.status === "PAID",
      );

      let debit = 0;
      filteredBranchDebit.forEach((payment) => {
        debit += payment.amount;
      });
      setTotalDebitAmount(debit);
    }
  }, [data2, isLoading2, isError2, error2, branch, selectBranch]);

  console.log("filteringPayments", filteringPayments);

  const branchBalance = totalBranchAmount - totalDebitAmount;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const [paymentId, setPaymentId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  const [updatePendingPayment] = useUpdatePendingPaymentMutation();

  const onFormEdit = async (data) => {
    console.log("info", data);
    console.log("paymentId", paymentId);

    try {
      const res = await updatePendingPayment({ id: paymentId, data });
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

  const [deletePendingPayment] = useDeletePendingPaymentMutation();

  const handleDeleteUser = async (id) => {
    try {
      const res = await deletePendingPayment(id);
      if (res.data?.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.error?.data?.message || "Failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const generateInvoiceNo = () => {
    const now = new Date();
    return `INV-${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now
      .getDate()
      .toString()
      .padStart(2, "0")}-${now.getTime()}`;
  };

  const [invoiceNo, setInvoiceNo] = useState("");

  useEffect(() => {
    const newInvoiceNo = generateInvoiceNo();
    setInvoiceNo(newInvoiceNo);
  }, []);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };

  console.log("data", data?.data);
  console.log("data1", data1);

  const tableWrapClass =
    "w-full overflow-x-auto rounded-[24px] border border-gray-100 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.06)]";
  const thClass =
    "min-w-[160px] border-b border-gray-100 bg-gray-50/90 px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-gray-500";
  const tdClass = "whitespace-nowrap px-4 py-4 text-sm text-gray-700";
  const statusClass = (status) =>
    `inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
      status === "PAID"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-amber-50 text-amber-700"
    }`;
  const canManagePayment = (paymentStatus) =>
    ["Cash-In", "Cash-Out", "Offline"].includes(paymentStatus);
  const renderInvoiceNode = (payment, showGeneratedInvoice) =>
    showGeneratedInvoice ? (
      <Invoice
        invoiceData={{
          invoiceNo: invoiceNo,
          date: formatDate(payment.createdAt),
          studentId: payment.user_id,
          name: payment.name,
          phone: payment.phone,
          address: payment.address,
          branch: payment.branch,
          transactionId: payment.transactionId,
          paymentMethod: payment.paymentStatus,
          items: [
            {
              qty: 1,
              purpose: payment.purpose,
              amount: payment.amount,
            },
          ],
          subTotal: payment.amount,
          discount: 0,
          taxes: 0,
          total: payment.amount,
        }}
      />
    ) : (
      <span className="cursor-pointer">Invoice</span>
    );
  const renderMobileCards = (walletPayments, showGeneratedInvoice, loading) => (
    <div className="space-y-3 lg:hidden">
      {loading ? (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
          Loading payments...
        </div>
      ) : walletPayments.length > 0 ? (
        walletPayments.map((payment, idx) => (
          <div
            key={payment.id || payment.transactionId || idx}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-gray-900">
                  {payment.user_id}
                </h3>
                <p className="break-all text-sm text-gray-600">
                  {payment.transactionId || "N/A"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {formatDate(payment.createdAt)} |{" "}
                  {payment.paymentStatus || "N/A"}
                </p>
              </div>
              <span className={statusClass(payment.status)}>
                {payment.status || "N/A"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs uppercase text-gray-500">Amount</p>
                <p className="flex items-center font-semibold text-gray-900">
                  <TbCurrencyTaka className="text-lg" />
                  {payment.amount}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500">Purpose</p>
                <p className="break-words font-medium text-gray-800">
                  {payment.purpose || "N/A"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs uppercase text-gray-500">Invoice</p>
                <div className="font-semibold text-brandBlue">
                  {renderInvoiceNode(payment, showGeneratedInvoice)}
                </div>
              </div>
            </div>

            {canManagePayment(payment.paymentStatus) && (
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
            )}
          </div>
        ))
      ) : (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
          No payment records found.
        </div>
      )}
    </div>
  );
  const renderMobilePagination = (meta) =>
    meta ? (
      <div className="mt-4 flex flex-col items-center justify-between gap-3 px-2 text-sm text-gray-600 lg:hidden">
        <div>
          Showing{" "}
          <strong>
            {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, meta.total)}
          </strong>{" "}
          of <strong>{meta.total}</strong>
        </div>

        <div className="flex w-full items-center gap-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className={`w-full rounded-2xl px-5 py-3 font-semibold text-white transition ${
              currentPage === 1
                ? "bg-brandDisable cursor-not-allowed"
                : "bg-brandBlue shadow-md shadow-red-100 hover:bg-brandHover"
            }`}
          >
            ← Prev
          </Button>

          <span className="whitespace-nowrap rounded-full bg-gray-100 px-4 py-2 font-semibold text-gray-700">
            {currentPage}
          </span>

          <Button
            disabled={currentPage * itemsPerPage >= meta.total}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`w-full rounded-2xl px-5 py-3 font-semibold text-white transition ${
              currentPage * itemsPerPage >= meta.total
                ? "bg-brandDisable cursor-not-allowed"
                : "bg-brandBlue shadow-md shadow-red-100 hover:bg-brandHover"
            }`}
          >
            Next →
          </Button>
        </div>
      </div>
    ) : null;

  return (
    <>
      {role === "superAdmin" && (
        <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="rounded-[24px] border border-red-100 bg-gradient-to-br from-red-50 to-white px-5 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Branch Balance
            </p>
            <div className="mt-3 flex items-center gap-1 text-2xl font-bold text-brandBlue">
              <TbCurrencyTaka className="text-3xl" /> {branchBalance}
            </div>
          </div>

          <div>
            <select
              {...register("status")}
              className="input input-bordered w-full rounded-2xl border-gray-200 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm focus:border-brandBlue focus:ring-2 focus:ring-red-100"
              onChange={(e) => setSelectBranch(e.target.value)}
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
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>
      )}

      {role === "superAdmin" && selectBranch ? (
        <>
          {renderMobileCards(filteringPayments, false, isLoading2)}
          <div className={`${tableWrapClass} hidden lg:block`}>
            <table className="w-full text-sm text-left text-gray-700 bg-white">
              <thead>
                <tr>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Student ID</th>
                  <th className={thClass}>Transaction ID</th>
                  <th className={thClass}>Amount</th>
                  <th className={thClass}>Purpose</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Mode of Payment</th>
                  <th className={thClass}>Invoice</th>
                  <th className={thClass}>Action</th>

                  {/* <th className="p-3 min-w-[160px]">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {filteringPayments.map((payment, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 bg-white transition hover:bg-red-50/30"
                  >
                    <td className={tdClass}>{formatDate(payment.createdAt)}</td>
                    <td className={tdClass}>{payment.user_id}</td>
                    <td className={tdClass}>{payment.transactionId}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>
                      <TbCurrencyTaka className="inline text-lg" />
                      {payment.amount}
                    </td>
                    <td className={tdClass}>{payment.purpose}</td>
                    <td className={tdClass}>
                      <span className={statusClass(payment.status)}>
                        {payment.status}
                      </span>
                    </td>
                    <td className={tdClass}>{payment.paymentStatus}</td>
                    <td className={`${tdClass} font-semibold text-brandBlue`}>
                      <span className="cursor-pointer">Invoice</span>
                    </td>
                    {["Cash-In", "Cash-Out", "Offline"].includes(
                      payment.paymentStatus,
                    ) && (
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
                    )}

                    {/* Modal should be outside the condition so it's mounted even when hidden */}
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                      <ModalHeader className="mb-6 text-lg font-bold text-gray-900">
                        Edit Statement Information
                      </ModalHeader>
                      <ModalBody>
                        <form onSubmit={handleSubmit(onFormEdit)}>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="mb-2">
                              <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Amount
                              </label>
                              <Input
                                type="number"
                                {...register("amount")}
                                onKeyDown={handleEnter}
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandBlue"
                              />
                              {errors.amount && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.amount.message}
                                </p>
                              )}
                            </div>

                            <div className="mb-2">
                              <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Purpose for Cash-In
                              </label>
                              <Input
                                type="text"
                                {...register("purpose")}
                                onKeyDown={handleEnter}
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandBlue"
                              />
                              {errors.purpose && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.purpose.message}
                                </p>
                              )}
                            </div>

                            <div className="mb-2">
                              <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Comment
                              </label>
                              <Input
                                type="text"
                                {...register("comment")}
                                onKeyDown={handleEnter}
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandBlue"
                              />
                              {errors.comment && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.comment.message}
                                </p>
                              )}
                            </div>

                            <div className="mb-2">
                              <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Status
                              </label>
                              <select
                                {...register("status")}
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
                          </div>

                          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
                            <Button
                              type="submit"
                              className="btn w-full rounded-2xl bg-gradient-to-r from-brandBlue to-red-500 px-8 py-3 font-semibold shadow-lg shadow-red-100 sm:w-auto"
                            >
                              Save
                            </Button>
                          </div>
                        </form>
                      </ModalBody>
                    </Modal>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : role === "superAdmin" ? (
        <>
          {renderMobileCards(payments, true, isLoading)}
          {renderMobilePagination(data?.data?.meta)}
          <div className={`${tableWrapClass} hidden lg:block`}>
            <table className="w-full text-sm text-left text-gray-700 bg-white">
              <thead>
                <tr>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Student ID</th>
                  <th className={thClass}>Transaction ID</th>
                  <th className={thClass}>Amount</th>
                  <th className={thClass}>Purpose</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Mode of Payment</th>
                  <th className={thClass}>Invoice</th>
                  <th className={thClass}>Action</th>

                  {/* <th className="p-3 min-w-[160px]">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 bg-white transition hover:bg-red-50/30"
                  >
                    <td className={tdClass}>{formatDate(payment.createdAt)}</td>
                    <td className={tdClass}>{payment.user_id}</td>
                    <td className={tdClass}>{payment.transactionId}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>
                      <TbCurrencyTaka className="inline text-lg" />
                      {payment.amount}
                    </td>
                    <td className={tdClass}>{payment.purpose}</td>
                    <td className={tdClass}>
                      <span className={statusClass(payment.status)}>
                        {payment.status}
                      </span>
                    </td>
                    <td className={tdClass}>{payment.paymentStatus}</td>
                    <td className={`${tdClass} font-semibold text-brandBlue`}>
                      <Invoice
                        invoiceData={{
                          invoiceNo: invoiceNo,
                          date: formatDate(payment.createdAt), // ✅ Corrected here
                          studentId: payment.user_id,
                          name: payment.name,
                          phone: payment.phone,
                          address: payment.address,
                          branch: payment.branch,
                          transactionId: payment.transactionId,
                          paymentMethod: payment.paymentStatus,
                          items: [
                            {
                              qty: 1,
                              purpose: payment.purpose,
                              amount: payment.amount,
                            },
                          ],
                          subTotal: payment.amount,
                          discount: 0, // Adjusted if no discount
                          taxes: 0,
                          total: payment.amount,
                        }}
                      />
                    </td>

                    {["Cash-In", "Cash-Out", "Offline"].includes(
                      payment.paymentStatus,
                    ) && (
                      <td className="flex gap-2 whitespace-nowrap px-4 py-4 text-black">
                        <LiaEditSolid
                          fontSize={18}
                          onClick={() => {
                            setIsModalOpen(true);
                            setPaymentId(payment.id);
                          }}
                          className="cursor-pointer rounded-xl bg-red-50 p-2.5 transition hover:bg-red-100"
                        />
                        <FaTrash
                          onClick={() => handleDeleteUser(payment.id)}
                          fontSize={18}
                          className="cursor-pointer rounded-xl bg-red-50 p-2.5 text-red-500 transition hover:bg-red-100"
                        />
                      </td>
                    )}

                    {/* Modal should be outside the condition so it's mounted even when hidden */}
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                      <ModalHeader className="mb-6 text-lg font-bold text-gray-900">
                        Edit Statement Information
                      </ModalHeader>
                      <ModalBody>
                        <form onSubmit={handleSubmit(onFormEdit)}>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="mb-2">
                              <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Amount
                              </label>
                              <Input
                                type="number"
                                {...register("amount")}
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandBlue"
                              />
                              {errors.amount && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.amount.message}
                                </p>
                              )}
                            </div>

                            <div className="mb-2">
                              <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Purpose for Cash-In
                              </label>
                              <Input
                                type="text"
                                {...register("purpose")}
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandBlue"
                              />
                              {errors.purpose && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.purpose.message}
                                </p>
                              )}
                            </div>

                            <div className="mb-2">
                              <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Comment
                              </label>
                              <Input
                                type="text"
                                {...register("comment")}
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandBlue"
                              />
                              {errors.comment && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.comment.message}
                                </p>
                              )}
                            </div>

                            <div className="mb-2">
                              <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Status
                              </label>
                              <select
                                {...register("status")}
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
                          </div>

                          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
                            <Button
                              type="submit"
                              className="btn w-full rounded-2xl bg-gradient-to-r from-brandBlue to-red-500 px-8 py-3 font-semibold shadow-lg shadow-red-100 sm:w-auto"
                            >
                              Save
                            </Button>
                          </div>
                        </form>
                      </ModalBody>
                    </Modal>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.data?.meta && (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-4 text-sm text-gray-600 sm:flex-row">
                {/* Left info */}
                <div>
                  Showing{" "}
                  <strong>
                    {(currentPage - 1) * itemsPerPage + 1} -{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      data?.data?.meta?.total,
                    )}
                  </strong>{" "}
                  of <strong>{data.data.meta.total}</strong>
                </div>

                {/* Right buttons */}
                <div className="flex w-full sm:w-auto items-center gap-2">
                  {/* Prev */}
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className={`w-full rounded-2xl px-5 py-3 font-semibold text-white transition sm:w-auto
                    ${
                      currentPage === 1
                        ? "bg-brandDisable cursor-not-allowed"
                        : "bg-brandBlue hover:bg-brandHover shadow-md shadow-red-100"
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
                    disabled={
                      currentPage * itemsPerPage >= data.data.meta.total
                    }
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={`w-full rounded-2xl px-5 py-3 font-semibold text-white transition sm:w-auto
                    ${
                      currentPage * itemsPerPage >= data.data.meta.total
                        ? "bg-brandDisable cursor-not-allowed"
                        : "bg-brandBlue hover:bg-brandHover shadow-md shadow-red-100"
                    }`}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {renderMobileCards(adminPayments, true, isLoading1)}
          {renderMobilePagination(data1?.data?.meta)}
          <div className={`${tableWrapClass} hidden lg:block`}>
            <table className="w-full text-sm text-left text-gray-700 bg-white">
              <thead>
                <tr>
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Student ID</th>
                  <th className={thClass}>Transaction ID</th>
                  <th className={thClass}>Amount</th>
                  <th className={thClass}>Purpose</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Mode of Payment</th>
                  <th className={thClass}>Invoice</th>
                  <th className={thClass}>Action</th>

                  {/* <th className="p-3 min-w-[160px]">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {adminPayments.map((payment, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 bg-white transition hover:bg-red-50/30"
                  >
                    <td className={tdClass}>{formatDate(payment.createdAt)}</td>
                    <td className={tdClass}>{payment.user_id}</td>
                    <td className={tdClass}>{payment.transactionId}</td>
                    <td className={`${tdClass} font-semibold text-gray-900`}>
                      <TbCurrencyTaka className="inline text-lg" />
                      {payment.amount}
                    </td>
                    <td className={tdClass}>{payment.purpose}</td>
                    <td className={tdClass}>
                      <span className={statusClass(payment.status)}>
                        {payment.status}
                      </span>
                    </td>
                    <td className={tdClass}>{payment.paymentStatus}</td>
                    <td className={`${tdClass} font-semibold text-brandBlue`}>
                      <Invoice
                        invoiceData={{
                          invoiceNo: invoiceNo,
                          date: formatDate(payment.createdAt), // ✅ Corrected here
                          studentId: payment.user_id,
                          name: payment.name,
                          phone: payment.phone,
                          address: payment.address,
                          branch: payment.branch,
                          transactionId: payment.transactionId,
                          paymentMethod: payment.paymentStatus,
                          items: [
                            {
                              qty: 1,
                              purpose: payment.purpose,
                              amount: payment.amount,
                            },
                          ],
                          subTotal: payment.amount,
                          discount: 0, // Adjusted if no discount
                          taxes: 0,
                          total: payment.amount,
                        }}
                      />
                    </td>

                    {["Cash-In", "Cash-Out", "Offline"].includes(
                      payment.paymentStatus,
                    ) && (
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
                    )}

                    {/* Modal should be outside the condition so it's mounted even when hidden */}
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                      <ModalHeader className="mb-6 text-lg font-bold text-gray-900">
                        Edit Statement Information
                      </ModalHeader>
                      <ModalBody>
                        <form onSubmit={handleSubmit(onFormEdit)}>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="mb-2">
                              <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Amount
                              </label>
                              <Input
                                type="number"
                                {...register("amount")}
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandBlue"
                              />
                              {errors.amount && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.amount.message}
                                </p>
                              )}
                            </div>

                            <div className="mb-2">
                              <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Purpose for Cash-In
                              </label>
                              <Input
                                type="text"
                                {...register("purpose")}
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandBlue"
                              />
                              {errors.purpose && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.purpose.message}
                                </p>
                              )}
                            </div>

                            <div className="mb-2">
                              <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Comment
                              </label>
                              <Input
                                type="text"
                                {...register("comment")}
                                className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandBlue"
                              />
                              {errors.comment && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.comment.message}
                                </p>
                              )}
                            </div>

                            <div className="mb-2">
                              <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Status
                              </label>
                              <select
                                {...register("status")}
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
                          </div>

                          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
                            <Button
                              type="submit"
                              className="btn w-full rounded-2xl bg-gradient-to-r from-brandBlue to-red-500 px-8 py-3 font-semibold shadow-lg shadow-red-100 sm:w-auto"
                            >
                              Save
                            </Button>
                          </div>
                        </form>
                      </ModalBody>
                    </Modal>
                  </tr>
                ))}
              </tbody>
            </table>
            {data1?.data?.meta && (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-4 text-sm text-gray-600 sm:flex-row">
                {/* Left info */}
                <div>
                  Showing{" "}
                  <strong>
                    {(currentPage - 1) * itemsPerPage + 1} -{" "}
                    {Math.min(
                      currentPage * itemsPerPage,
                      data1.data.meta.total,
                    )}
                  </strong>{" "}
                  of <strong>{data1.data.meta.total}</strong>
                </div>

                {/* Right buttons */}
                <div className="flex w-full sm:w-auto items-center gap-2">
                  {/* Prev */}
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className={`w-full rounded-2xl px-5 py-3 font-semibold text-white transition sm:w-auto
                    ${
                      currentPage === 1
                        ? "bg-brandDisable cursor-not-allowed"
                        : "bg-brandBlue hover:bg-brandHover shadow-md shadow-red-100"
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
                    disabled={
                      currentPage * itemsPerPage >= data1.data.meta.total
                    }
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={`w-full rounded-2xl px-5 py-3 font-semibold text-white transition sm:w-auto
                    ${
                      currentPage * itemsPerPage >= data1.data.meta.total
                        ? "bg-brandDisable cursor-not-allowed"
                        : "bg-brandBlue hover:bg-brandHover shadow-md shadow-red-100"
                    }`}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default Amount;

// import React, { useEffect, useMemo, useState } from "react";
// import { useForm } from "react-hook-form";
// import {
//   Input,
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
// } from "@windmill/react-ui";
// import toast from "react-hot-toast";
// import { LiaEditSolid } from "react-icons/lia";
// import { FaTrash } from "react-icons/fa";
// import { TbCurrencyTaka } from "react-icons/tb";

// import {
//   useDeletePendingPaymentMutation,
//   useGetAllPendingPaymentQuery,
//   useGetAllPendingPaymentWithoutQueryQuery,
//   useUpdatePendingPaymentMutation,
// } from "../../features/pendingPayment/pendingPayment";

// import Invoice from "./Invoice";

// function Amount() {
//   const role = localStorage.getItem("role");
//   const branch = localStorage.getItem("branch");

//   const [selectBranch, setSelectBranch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // ---------- Modal & selected payment ----------
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState(null);

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedPayment(null);
//     reset(); // clean form
//   };

//   const openModal = (payment) => {
//     setSelectedPayment(payment);
//     // Prefill form with existing payment data
//     reset({
//       amount: payment?.amount ?? "",
//       purpose: payment?.purpose ?? "",
//       comment: payment?.comment ?? "",
//       status: payment?.status ?? "",
//     });
//     setIsModalOpen(true);
//   };

//   // ---------- react-hook-form only for modal ----------
//   const {
//     register,
//     formState: { errors },
//     handleSubmit,
//     reset,
//   } = useForm();

//   const handleEnter = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const form = e.target.form;
//       const index = Array.prototype.indexOf.call(form, e.target);
//       form.elements[index + 1]?.focus();
//     }
//   };

//   // ---------- API calls (skip unnecessary) ----------
//   // 1) SuperAdmin, no selectBranch => paginated all payments
//   const shouldFetchPaginatedAll = role === "superAdmin" && !selectBranch;
//   const paginatedAllQuery = useGetAllPendingPaymentQuery(
//     { page: currentPage, limit: itemsPerPage },
//     { skip: !shouldFetchPaginatedAll }
//   );

//   // 2) Non-superAdmin => paginated branch payments
//   const shouldFetchPaginatedBranch = role !== "superAdmin";
//   const paginatedBranchQuery = useGetAllPendingPaymentQuery(
//     { page: currentPage, limit: itemsPerPage, branch },
//     { skip: !shouldFetchPaginatedBranch }
//   );

//   // 3) SuperAdmin selectBranch => need all payments to filter by branch + compute branch balance
//   const shouldFetchAllForBranch = role === "superAdmin" && !!selectBranch;
//   const allPaymentsQuery = useGetAllPendingPaymentWithoutQueryQuery({
//     skip: !shouldFetchAllForBranch,
//   });

//   // ---------- helpers to safely read response ----------
//   const getList = (apiRes) => {
//     // Handles both: {data:{data:[...]}} and {data:{data:{data:[...]}}}
//     const d = apiRes?.data;
//     return d?.data?.data ?? d?.data ?? [];
//   };

//   const getMeta = (apiRes) => {
//     const d = apiRes?.data;
//     return d?.meta ?? d?.data?.meta ?? null;
//   };

//   const isLoading =
//     paginatedAllQuery.isLoading ||
//     paginatedBranchQuery.isLoading ||
//     allPaymentsQuery.isLoading;

//   const isError =
//     paginatedAllQuery.isError ||
//     paginatedBranchQuery.isError ||
//     allPaymentsQuery.isError;

//   const error =
//     paginatedAllQuery.error ||
//     paginatedBranchQuery.error ||
//     allPaymentsQuery.error;

//   useEffect(() => {
//     if (isError) console.log("Error fetching", error);
//   }, [isError, error]);

//   // ---------- DATA: role-based list + meta ----------
//   const tablePayments = useMemo(() => {
//     if (role === "superAdmin" && selectBranch) {
//       const all = getList(allPaymentsQuery.data);
//       return all.filter((p) => p?.branch === selectBranch);
//     }

//     if (role === "superAdmin") {
//       return getList(paginatedAllQuery.data);
//     }

//     return getList(paginatedBranchQuery.data);
//   }, [
//     role,
//     selectBranch,
//     allPaymentsQuery.data,
//     paginatedAllQuery.data,
//     paginatedBranchQuery.data,
//   ]);

//   const meta = useMemo(() => {
//     if (role === "superAdmin" && !selectBranch)
//       return getMeta(paginatedAllQuery.data);
//     if (role !== "superAdmin") return getMeta(paginatedBranchQuery.data);
//     return null; // selectBranch mode: not paginated in your previous behavior
//   }, [role, selectBranch, paginatedAllQuery.data, paginatedBranchQuery.data]);

//   // ---------- SuperAdmin selected branch balance (credit - debit) ----------
//   const branchBalance = useMemo(() => {
//     if (!(role === "superAdmin" && selectBranch)) return 0;

//     const list = tablePayments;

//     const credit = list
//       .filter(
//         (p) =>
//           ["Cash-In", "Offline", "Online"].includes(p?.paymentStatus) &&
//           p?.status === "PAID"
//       )
//       .reduce((sum, p) => sum + Number(p?.amount ?? 0), 0);

//     const debit = list
//       .filter((p) => p?.paymentStatus === "Cash-Out" && p?.status === "PAID")
//       .reduce((sum, p) => sum + Number(p?.amount ?? 0), 0);

//     return credit - debit;
//   }, [role, selectBranch, tablePayments]);

//   // ---------- mutations ----------
//   const [updatePendingPayment, { isLoading: isUpdating }] =
//     useUpdatePendingPaymentMutation();
//   const [deletePendingPayment, { isLoading: isDeleting }] =
//     useDeletePendingPaymentMutation();

//   const onFormEdit = async (formData) => {
//     if (!selectedPayment?.id) return;

//     try {
//       const payload = {
//         // only send relevant fields (optional)
//         amount: formData.amount,
//         purpose: formData.purpose,
//         comment: formData.comment,
//         status: formData.status,
//       };

//       const res = await updatePendingPayment({
//         id: selectedPayment.id,
//         data: payload,
//       }).unwrap();
//       toast.success(res?.message || "Updated successfully");
//       closeModal();
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed. Please try again.");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!id) return;
//     try {
//       const res = await deletePendingPayment(id).unwrap();
//       toast.success(res?.message || "Deleted successfully");
//     } catch (err) {
//       toast.error(err?.data?.message || "Failed. Please try again.");
//     }
//   };

//   // ---------- ui helpers ----------
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     });
//   };

//   const canEditDelete = (payment) =>
//     ["Cash-In", "Cash-Out", "Offline"].includes(payment?.paymentStatus);

//   const invoiceNoFor = (payment) =>
//     `INV-${payment?.id ?? payment?.transactionId ?? "NA"}`;

//   // pagination controls
//   const total = meta?.total ?? 0;
//   const canPrev = currentPage > 1;
//   const canNext = currentPage * itemsPerPage < total;

//   return (
//     <>
//       {/* Super Admin: branch selector + balance */}
//       {role === "superAdmin" && (
//         <div className="mb-4 grid lg:grid-cols-2 xl:grid-cols-2 grid-cols-1 gap-4">
//           <div>
//             <p>Balance:</p>
//             <button className="px-4 py-2 flex items-center bg-white text-brandBlue border-2 border-brandBlue rounded-md text-sm md:text-base transition">
//               <TbCurrencyTaka /> {selectBranch ? branchBalance : 0}
//             </button>
//           </div>

//           <div>
//             <select
//               className="input input-bordered w-full shadow-md p-3"
//               value={selectBranch}
//               onChange={(e) => {
//                 setSelectBranch(e.target.value);
//                 setCurrentPage(1); // reset page when branch changes
//               }}
//             >
//               <option value="">Select Branch</option>
//               <option value="Edu Anchor">Edu Anchor</option>
//               <option value="Dhaka">Dhaka</option>
//               <option value="Khulna">Khulna</option>
//               <option value="Satkhira">Satkhira</option>
//               <option value="Jashore">Jashore</option>
//               <option value="Feni">Feni</option>
//               <option value="Nord Edu">Nord Edu</option>
//             </select>
//           </div>
//         </div>
//       )}

//       {/* Table */}
//       <div className="w-full overflow-x-auto">
//         <table className="w-full text-sm text-left text-gray-700 bg-white shadow-md rounded-lg">
//           <thead className="bg-gray-100 border-b border-gray-200">
//             <tr>
//               <th className="p-3 min-w-[180px]">Date</th>
//               <th className="p-3 min-w-[180px]">Student ID</th>
//               <th className="p-3 min-w-[180px]">Transaction ID</th>
//               <th className="p-3 min-w-[180px]">Amount</th>
//               <th className="p-3 min-w-[120px]">Purpose</th>
//               <th className="p-3 min-w-[160px]">Status</th>
//               <th className="p-3 min-w-[160px]">Mode of Payment</th>
//               <th className="p-3 min-w-[160px]">Invoice</th>
//               <th className="p-3 min-w-[160px]">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {tablePayments?.map((payment, idx) => (
//               <tr
//                 key={payment?.id ?? idx}
//                 className={`border-b border-gray-200 ${
//                   idx % 2 === 0 ? "bg-gray-50" : "bg-white"
//                 }`}
//               >
//                 <td className="p-3 whitespace-nowrap">
//                   {formatDate(payment?.createdAt)}
//                 </td>
//                 <td className="p-3 whitespace-nowrap">{payment?.user_id}</td>
//                 <td className="p-3 whitespace-nowrap">
//                   {payment?.transactionId}
//                 </td>
//                 <td className="p-3 whitespace-nowrap">{payment?.amount}</td>
//                 <td className="p-3 whitespace-nowrap">{payment?.purpose}</td>
//                 <td className="p-3 whitespace-nowrap">{payment?.status}</td>
//                 <td className="p-3 whitespace-nowrap">
//                   {payment?.paymentStatus}
//                 </td>

//                 <td className="p-3 whitespace-nowrap text-brandBlue cursor-pointer">
//                   <Invoice
//                     invoiceData={{
//                       invoiceNo: invoiceNoFor(payment),
//                       date: formatDate(payment?.createdAt),
//                       studentId: payment?.user_id,
//                       name: payment?.name,
//                       phone: payment?.phone,
//                       address: payment?.address,
//                       branch: payment?.branch,
//                       transactionId: payment?.transactionId,
//                       paymentMethod: payment?.paymentStatus,
//                       items: [
//                         {
//                           qty: 1,
//                           purpose: payment?.purpose,
//                           amount: payment?.amount,
//                         },
//                       ],
//                       subTotal: payment?.amount,
//                       discount: 0,
//                       taxes: 0,
//                       total: payment?.amount,
//                     }}
//                   />
//                 </td>

//                 <td className="p-3 whitespace-nowrap">
//                   {canEditDelete(payment) ? (
//                     <div className="flex gap-3 text-brandBlue">
//                       <LiaEditSolid
//                         fontSize={20}
//                         onClick={() => openModal(payment)}
//                         className="cursor-pointer"
//                       />
//                       <FaTrash
//                         onClick={() => handleDelete(payment?.id)}
//                         fontSize={18}
//                         className={`cursor-pointer text-red-500 ${
//                           isDeleting ? "opacity-60" : ""
//                         }`}
//                       />
//                     </div>
//                   ) : (
//                     <span className="text-gray-400">-</span>
//                   )}
//                 </td>
//               </tr>
//             ))}

//             {!isLoading && (!tablePayments || tablePayments.length === 0) && (
//               <tr>
//                 <td className="p-4 text-center text-gray-500" colSpan={9}>
//                   No data found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {/* Loading/Error */}
//         {isLoading && <p className="mt-3 text-sm text-gray-500">Loading...</p>}
//         {isError && (
//           <p className="mt-3 text-sm text-red-500">Failed to load data</p>
//         )}

//         {/* Pagination only for paginated modes */}
//         {meta && (
//           <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-600">
//             <div>
//               Showing{" "}
//               <strong>
//                 {(currentPage - 1) * itemsPerPage + 1} -{" "}
//                 {Math.min(currentPage * itemsPerPage, total)}
//               </strong>{" "}
//               of <strong>{total}</strong>
//             </div>

//             <div className="flex gap-2">
//               <Button
//                 disabled={!canPrev}
//                 onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//               >
//                 Prev
//               </Button>

//               <Button
//                 disabled={!canNext}
//                 onClick={() => setCurrentPage((p) => p + 1)}
//               >
//                 Next
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Single Modal (only once) */}
//       <Modal isOpen={isModalOpen} onClose={closeModal}>
//         <ModalHeader className="mb-8">Edit Statement Information</ModalHeader>
//         <ModalBody>
//           <form onSubmit={handleSubmit(onFormEdit)}>
//             <div className="grid grid-cols-1 gap-4">
//               <div className="mb-4">
//                 <label className="block text-sm mb-1 text-gray-700">
//                   Amount
//                 </label>
//                 <Input
//                   type="number"
//                   {...register("amount")}
//                   onKeyDown={handleEnter}
//                   className="w-full p-3 shadow-md border rounded-md"
//                 />
//                 {errors.amount && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.amount.message}
//                   </p>
//                 )}
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm mb-1 text-gray-700">
//                   Purpose
//                 </label>
//                 <Input
//                   type="text"
//                   {...register("purpose")}
//                   onKeyDown={handleEnter}
//                   className="w-full p-3 shadow-md border rounded-md"
//                 />
//                 {errors.purpose && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.purpose.message}
//                   </p>
//                 )}
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm mb-1 text-gray-700">
//                   Comment
//                 </label>
//                 <Input
//                   type="text"
//                   {...register("comment")}
//                   onKeyDown={handleEnter}
//                   className="w-full p-3 shadow-md border rounded-md"
//                 />
//                 {errors.comment && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.comment.message}
//                   </p>
//                 )}
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm mb-1 text-gray-700 mb-4">
//                   Status
//                 </label>
//                 <select
//                   {...register("status")}
//                   onKeyDown={handleEnter}
//                   className="input input-bordered w-full shadow-md p-3"
//                 >
//                   <option value="">Select Status</option>
//                   <option value="PAID">PAID</option>
//                   <option value="PENDING">PENDING</option>
//                 </select>
//                 {errors.status && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.status.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 mt-6">
//               <Button
//                 type="submit"
//                 className="btn"
//                 style={{ backgroundColor: "#1B2E6B" }}
//                 disabled={isUpdating}
//               >
//                 {isUpdating ? "Saving..." : "Save"}
//               </Button>
//             </div>
//           </form>
//         </ModalBody>
//       </Modal>
//     </>
//   );
// }

// export default Amount;
