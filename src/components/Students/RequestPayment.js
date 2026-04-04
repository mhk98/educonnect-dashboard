import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button } from "@windmill/react-ui";
import toast from "react-hot-toast";
import {
  useCreateRequestPaymentMutation,
  useDeleteRequestPaymentMutation,
  useGetDataByIdQuery,
  useUpdateRequestPaymentMutation,
} from "../../features/requestPayment/requestPayment";
import { LiaEditSolid } from "react-icons/lia";
import { FaTrash } from "react-icons/fa";
import { Modal, ModalHeader, ModalBody } from "@windmill/react-ui";

function RequestPayment({ id }) {
  const userId = localStorage.getItem("userId");

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [createRequestPayment] = useCreateRequestPaymentMutation();

  const onFormSubmit = async (data) => {
    const info = {
      amount: data.amount,
      paymentReason: data.paymentReason,
      refundCondition: data.refundCondition,
      user_id: id,
      userId: userId,
    };

    try {
      const res = await createRequestPayment(info);
      if (res.data?.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.error?.data?.message || "Failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const { data, isLoading, isError, error } = useGetDataByIdQuery(id);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (isError) {
      console.log("Error fetching", error);
    } else if (!isLoading && data) {
      setPayments(data.data);
    }
  }, [data, isLoading, isError, error]);

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

  const [updateRequestPayment] = useUpdateRequestPaymentMutation();

  const onFormEdit = async (data) => {
    console.log("info", data);
    console.log("paymentId", paymentId);
    console.log("userId", userId);

    try {
      const res = await updateRequestPayment({ id: paymentId, data });
      if (res.data?.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.error?.data?.message || "Failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const [deleteRequestPayment] = useDeleteRequestPaymentMutation();

  const handleDeleteUser = async (id) => {
    try {
      const res = await deleteRequestPayment(id);
      if (res.data?.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.error?.data?.message || "Failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <>
      {/* <PageTitle>Dashboard</PageTitle> */}
      <div className="w-full px-4 py-6 bg-gray-50">
        <div className="w-full  mx-auto flex md:flex-row lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Form Section */}
          <div className="w-full flex justify-between">
            <form onSubmit={handleSubmit(onFormSubmit)} className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Amount */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-700">
                    Amount
                  </label>
                  <Input
                    type="number"
                    {...register("amount")}
                    className="w-full p-3 shadow-md border rounded-md"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                {/* Reason For Payment */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-700">
                    Reason For Payment
                  </label>
                  <Input
                    type="text"
                    {...register("paymentReason")}
                    className="w-full p-3 shadow-md border rounded-md"
                  />
                  {errors.paymentReason && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.paymentReason.message}
                    </p>
                  )}
                </div>

                {/* Refund Condition */}
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-700">
                    Refund Condition
                  </label>
                  <Input
                    type="text"
                    {...register("refundCondition")}
                    className="w-full p-3 shadow-md border rounded-md"
                  />
                  {errors.refundCondition && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.refundCondition.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: "#C71320" }}
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="p-3 min-w-[180px]">Request Date</th>
              <th className="p-3 min-w-[180px]">Payment Reason</th>
              <th className="p-3 min-w-[120px]">Amount</th>
              <th className="p-3 min-w-[160px]">Refund Condition</th>
              <th className="p-3 min-w-[160px]">Status</th>
              <th className="p-3 min-w-[160px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, idx) => (
              <tr
                key={idx}
                className={`border-b border-gray-200 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="p-3 whitespace-nowrap">
                  {formatDate(payment.createdAt)}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {payment.paymentReason}
                </td>
                <td className="p-3 whitespace-nowrap">{payment.amount}</td>
                <td className="p-3 whitespace-nowrap">
                  {payment.refundCondition}
                </td>
                <td className="p-3 whitespace-nowrap">{payment?.status}</td>
                <td className="p-3 whitespace-nowrap flex gap-3 text-brandRed">
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

                <Modal isOpen={isModalOpen} onClose={closeModal}>
                  <ModalHeader className="mb-8">
                    Edit User Information
                  </ModalHeader>
                  <ModalBody>
                    <form onSubmit={handleSubmit(onFormEdit)}>
                      <div className="grid grid-cols-1 gap-4">
                        {/* Left Side */}

                        <div className="mb-4">
                          <label className="block text-sm mb-1 text-gray-700 mb-4">
                            Profile Status
                          </label>
                          <select
                            {...register("status")}
                            className="input input-bordered w-full shadow-md p-3"
                          >
                            <option value="">Select Status</option>
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                          </select>
                          {errors.status && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.status.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-6">
                        <Button
                          type="submit"
                          className="btn"
                          style={{ backgroundColor: "#C71320" }}
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
  );
}

export default RequestPayment;
