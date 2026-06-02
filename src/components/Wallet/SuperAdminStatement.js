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

function SuperAdminStatement() {
  const role = localStorage.getItem("role");
  const branch = localStorage.getItem("branch");
  const user_id = localStorage.getItem("userId");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const queryParams = {
    page: currentPage,
    limit: itemsPerPage,
    user_id: user_id,
  };

  const { data, isLoading, isError, error } =
    useGetAllPendingPaymentQuery(queryParams);
  const [payments, setPayments] = useState([]);

  console.log("superAdminPayment", data);
  useEffect(() => {
    if (isError) {
      console.log("Error fetching", error);
    } else if (!isLoading && data) {
      // const allPayments = data?.data?.data;
      // const filtered = allPayments?.filter(
      //   (payments) => payments.user_id === user_id
      // );

      setPayments(data?.data?.data);
    }
  }, [data, isLoading, isError, error, user_id, branch]);

  console.log("StudentPayment", payments);

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

  const {
    data: data2,
    isLoading: isLoading2,
    isError: isError2,
    error: error2,
  } = useGetAllPendingPaymentWithoutQueryQuery();
  // const [creditPayments, setCreditPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (isError2) {
      console.log("Error fetching", error2);
    } else if (!isLoading2 && data2) {
      const allCreditPayments = data2?.data;

      // ✅ Filter payments with any of the 3 paymentStatus values
      const filtered = allCreditPayments?.filter(
        (payment) =>
          ["Cash-In", "Offline", "Online"].includes(payment.paymentStatus) &&
          payment.status === "PAID" &&
          payment.branch === branch,
      );

      // setCreditPayments(filtered);

      // ✅ Sum amounts
      const total = filtered.reduce((sum, payment) => {
        return sum + Number(payment.amount || 0);
      }, 0);

      setTotalAmount(total);
    }
  }, [data2, isLoading2, isError2, error2, branch]);

  const {
    data: data1,
    isLoading: isLoading1,
    isError: isError1,
    error: error1,
  } = useGetAllPendingPaymentWithoutQueryQuery();
  // const [creditPayments, setCreditPayments] = useState([]);
  const [totalDebitAmount, setTotalDebitAmount] = useState(0);

  useEffect(() => {
    if (isError1) {
      console.log("Error fetching", error1);
    } else if (!isLoading1 && data1) {
      const allCreditPayments = data1?.data;

      // ✅ Filter payments with any of the 3 paymentStatus values
      const filtered = allCreditPayments.filter(
        (payment) =>
          ["Cash-Out"].includes(payment.paymentStatus) &&
          payment.status === "PAID" &&
          payment.branch === branch,
      );

      // setCreditPayments(filtered);

      // ✅ Sum amounts
      const total = filtered.reduce((sum, payment) => {
        return sum + Number(payment.amount || 0);
      }, 0);

      setTotalDebitAmount(total);
    }
  }, [data1, isLoading1, isError1, error1, branch]);

  const balance = totalAmount - totalDebitAmount;

  console.log("balance", balance);

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
  const renderStatementMobileCards = () => (
    <div className="space-y-3 lg:hidden">
      {isLoading ? (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
          Loading statements...
        </div>
      ) : payments.length > 0 ? (
        payments.map((payment, idx) => (
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
                  <LiaEditSolid className="text-md" />
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
          No statement records found.
        </div>
      )}
    </div>
  );
  const renderStatementMobilePagination = () =>
    data?.meta ? (
      <div className="mt-4 flex flex-col items-center justify-between gap-3 px-2 text-sm text-gray-600 lg:hidden">
        <div>
          Showing{" "}
          <strong>
            {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, data.meta.total)}
          </strong>{" "}
          of <strong>{data.meta.total}</strong>
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
            disabled={currentPage * itemsPerPage >= data.meta.total}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`w-full rounded-2xl px-5 py-3 font-semibold text-white transition ${
              currentPage * itemsPerPage >= data.meta.total
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
          {/* <div></div> */}

          {/* <div >
            <select
                            {...register("status")}
                            className="input input-bordered w-full shadow-md p-3"
                            onChange={(e) => setSelectBranch(e.target.value)}
                          >

                            <option value="">Select Branch</option>
                        <option value="Edu Anchor">Edu Anchor</option>

            <option value="Khulna">Khulna</option>
            <option value="Satkhira">Satkhira</option>
            <option value="Tangail">Tangail</option>
            <option value="Jashore">Jashore</option>
            <option value="Rangpur">Rangpur</option>
            <option value="Dinajpur">Dinajpur</option>
            <option value="Gopalganj">Gopalganj</option>
            <option value="Savar">Savar</option>
            <option value="Feni">Feni</option>
                          </select>
                          {errors.status && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.status.message}
                            </p>
        )}

    </div> */}

          <div className="rounded-[24px] border border-red-100 bg-gradient-to-br from-red-50 to-white px-5 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Balance
            </p>
            <div className="mt-3 flex items-center gap-1 text-2xl font-bold text-brandBlue">
              <TbCurrencyTaka className="text-3xl" /> {balance}
            </div>

            {/* Register New Student */}
            {/* <button className="px-4 py-2 bg-brandBlue text-white rounded-md text-sm md:text-base hover:bg-brandBlue-700 transition">
            ADD MONEY
          </button> */}
          </div>
        </div>
      )}

      {renderStatementMobileCards()}
      {renderStatementMobilePagination()}

      <div className="hidden w-full overflow-x-auto rounded-[24px] border border-gray-100 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.06)] lg:block">
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
          {
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
          }
        </table>

        {data?.meta && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-4 text-sm text-gray-600 sm:flex-row">
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
                disabled={currentPage * itemsPerPage >= data.meta.total}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`w-full rounded-2xl px-5 py-3 font-semibold text-white transition sm:w-auto
          ${
            currentPage * itemsPerPage >= data.meta.total
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
  );
}

export default SuperAdminStatement;

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

// function SuperAdminStatement() {
//   const role = localStorage.getItem("role");
//   const branch = localStorage.getItem("branch");
//   const user_id = localStorage.getItem("userId");

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // ------------------ Modal state ------------------
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState(null);

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedPayment(null);
//     reset();
//   };

//   // ------------------ Form (only modal) ------------------
//   const {
//     register,
//     formState: { errors },
//     handleSubmit,
//     reset,
//   } = useForm();

//   const openModal = (payment) => {
//     setSelectedPayment(payment);
//     reset({
//       amount: payment?.amount ?? "",
//       purpose: payment?.purpose ?? "",
//       comment: payment?.comment ?? "",
//       status: payment?.status ?? "",
//     });
//     setIsModalOpen(true);
//   };

//   // ------------------ Queries ------------------
//   const {
//     data: paginatedRes,
//     isLoading: isLoadingPage,
//     isError: isErrorPage,
//     error: errorPage,
//   } = useGetAllPendingPaymentQuery({
//     page: currentPage,
//     limit: itemsPerPage,
//     user_id,
//   });

//   // balance হিসাবের জন্য একবারই all fetch
//   const {
//     data: allRes,
//     isLoading: isLoadingAll,
//     isError: isErrorAll,
//     error: errorAll,
//   } = useGetAllPendingPaymentWithoutQueryQuery(undefined, {
//     // SuperAdminStatement সাধারণত superAdmin ই দেখবে, তবুও safe
//     skip: role !== "superAdmin",
//   });

//   useEffect(() => {
//     if (isErrorPage) console.log("Error fetching page data:", errorPage);
//     if (isErrorAll) console.log("Error fetching all data:", errorAll);
//   }, [isErrorPage, errorPage, isErrorAll, errorAll]);

//   // ------------------ Helpers ------------------
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     });
//   };

//   // API shape handle (তোমার আগের কোড অনুযায়ী)
//   const payments = useMemo(() => {
//     return paginatedRes?.data?.data ?? [];
//   }, [paginatedRes]);

//   const meta = useMemo(() => {
//     return paginatedRes?.data?.meta ?? null;
//   }, [paginatedRes]);

//   const allPayments = useMemo(() => {
//     // all endpoint: data?.data?.data
//     return allRes?.data?.data ?? [];
//   }, [allRes]);

//   const balance = useMemo(() => {
//     // আগের মতো: logged-in user এর branch অনুযায়ী PAID credit - PAID debit
//     const branchPayments = allPayments.filter((p) => p?.branch === branch);

//     const credit = branchPayments
//       .filter(
//         (p) =>
//           ["Cash-In", "Offline", "Online"].includes(p?.paymentStatus) &&
//           p?.status === "PAID"
//       )
//       .reduce((sum, p) => sum + Number(p?.amount ?? 0), 0);

//     const debit = branchPayments
//       .filter((p) => p?.paymentStatus === "Cash-Out" && p?.status === "PAID")
//       .reduce((sum, p) => sum + Number(p?.amount ?? 0), 0);

//     return credit - debit;
//   }, [allPayments, branch]);

//   const invoiceNoFor = (payment) =>
//     `INV-${payment?.id ?? payment?.transactionId ?? "NA"}`;

//   const canEditDelete = (payment) =>
//     ["Cash-In", "Cash-Out", "Offline"].includes(payment?.paymentStatus);

//   // ------------------ Mutations ------------------
//   const [updatePendingPayment, { isLoading: isUpdating }] =
//     useUpdatePendingPaymentMutation();

//   const [deletePendingPayment, { isLoading: isDeleting }] =
//     useDeletePendingPaymentMutation();

//   const onFormEdit = async (formData) => {
//     if (!selectedPayment?.id) return;

//     try {
//       const payload = {
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

//   // ------------------ Pagination ------------------
//   const total = meta?.total ?? 0;
//   const canPrev = currentPage > 1;
//   const canNext = currentPage * itemsPerPage < total;

//   const isLoading = isLoadingPage || (role === "superAdmin" && isLoadingAll);

//   return (
//     <>
//       {role === "superAdmin" && (
//         <div className="mb-4 grid lg:grid-cols-2 xl:grid-cols-2 grid-cols-1">
//           <div className="flex items-center sm:flex-row gap-3">
//             <p>Balances:</p>
//             <button className="px-4 py-2 flex items-center bg-white text-brandBlue border-2 border-brandBlue rounded-md text-sm md:text-base transition">
//               <TbCurrencyTaka /> {balance}
//             </button>
//           </div>
//         </div>
//       )}

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
//             {payments.map((payment, idx) => (
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

//             {!isLoading && payments.length === 0 && (
//               <tr>
//                 <td className="p-4 text-center text-gray-500" colSpan={9}>
//                   No data found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {isLoading && <p className="mt-3 text-sm text-gray-500">Loading...</p>}
//         {(isErrorPage || isErrorAll) && (
//           <p className="mt-3 text-sm text-red-500">Failed to load data</p>
//         )}

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

//       {/* Single Modal */}
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

// export default SuperAdminStatement;
