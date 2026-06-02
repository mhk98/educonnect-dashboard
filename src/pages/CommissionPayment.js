import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Button,
} from "@windmill/react-ui";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useCreateCommissionMutation } from "../features/commission/commission";
import ComissionPaymentInProgress from "../components/ComissionPayment/ComissionPaymentInProgress";
import ComissionPaymentPaid from "../components/ComissionPayment/ComissionPaymentPaid";
import axios from "axios";
import { useGetAllBranchQuery } from "../features/branch/branch";

function CommissionPayment() {
  const first_Name = localStorage.getItem("FirstName");
  const last_Name = localStorage.getItem("LastName");

  const [admins, setAdmins] = useState([]);
  // Tab logic
  const [activeTab, setActiveTab] = useState("inProgress");
  const isInProgress = activeTab === "inProgress";

  // Modal logic
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const id = localStorage.getItem("userId");
  const [createCommission] = useCreateCommissionMutation();

  const {
    data: branchData,
    isLoading: branchLoading,
    isError: branchError,
  } = useGetAllBranchQuery();

  const onFormSubmit = async (data) => {
    const info = {
      user_id: id,
      amount: data.amount,
      purpose: data.purpose,
      id: data.branch,
      assignor: `${first_Name} ${last_Name}`,
    };

    console.log("info", info);
    try {
      const res = await createCommission(info);
      if (res.data?.success) {
        toast.success(res.data.message);
        reset();
        setIsModalOpen(false);

        reset();
      } else {
        toast.error(res.error?.data?.message || "Failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://backend.eaconsultancy.org/api/v1/user/student",
        );
        const allUsers = response.data.data;

        // Filter users with Role "admin" or "superadmin"
        const filtered = allUsers.filter(
          (user) =>
            user.Role?.toLowerCase() !== "student" &&
            user.Role?.toLowerCase() !== "employee",
        );
        setAdmins(filtered);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  console.log("Admins:", admins);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };

  return (
    <>
      <div className="w-full px-3 py-4 sm:px-4 sm:py-6">
        <div className="mx-auto max-w-7xl rounded-[28px] border border-red-100 bg-gradient-to-br from-white via-red-50/40 to-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Header Section */}
            <div>
              <p className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brandBlue">
                Commission
              </p>
              <h4 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Commission Payment
              </h4>
              <p className="mt-2 max-w-xl text-sm text-gray-500 sm:text-base">
                Track commission requests and paid transactions in one place.
              </p>

              {/* Modal */}
              <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalHeader className="text-lg font-bold text-gray-900">
                  Commission Request
                </ModalHeader>
                <ModalBody>
                  <form onSubmit={handleSubmit(onFormSubmit)}>
                    <div className="grid grid-cols-1 gap-4">
                      {/* Left Side */}

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Amount
                        </label>
                        <Input
                          type="text"
                          {...register("amount")}
                          onKeyDown={handleEnter}
                          className="input input-bordered w-full rounded-2xl border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandBlue"
                        />
                        {errors.amount && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.amount.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Purpose
                        </label>
                        <Input
                          type="text"
                          {...register("purpose")}
                          onKeyDown={handleEnter}
                          className="input input-bordered w-full rounded-2xl border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandBlue"
                        />
                        {errors.purpose && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.purpose.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Branch
                        </label>
                        <select
                          {...register("branch")}
                          onKeyDown={handleEnter}
                          className="input input-bordered w-full rounded-2xl border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandBlue"
                        >
                          <option value="">Select Branch</option>
                          {branchLoading && (
                            <option disabled>Loading branches...</option>
                          )}
                          {branchError && (
                            <option disabled>Error loading branches</option>
                          )}
                          {branchData?.data?.map((branchItem) => (
                            <option
                              key={
                                branchItem.id ||
                                branchItem._id ||
                                branchItem.name
                              }
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
                        {errors.branch && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.branch.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
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
            </div>

            {/* Right Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                }}
                className="rounded-2xl bg-gradient-to-r from-brandBlue to-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-100 transition hover:shadow-xl sm:text-base"
              >
                + Request Commission
              </button>
            </div>
          </div>

          {/* Tab Section */}

          <div className="mt-6 w-full rounded-[24px] bg-white/70 p-2 shadow-sm ring-1 ring-gray-100 backdrop-blur sm:w-auto">
            <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
              <span
                className={`cursor-pointer rounded-2xl px-4 py-3 text-center transition-all duration-300 ${
                  isInProgress
                    ? "bg-gradient-to-r from-brandBlue to-red-500 text-brandBlue shadow-lg shadow-red-100"
                    : "bg-white text-gray-700 hover:bg-red-50"
                }`}
                onClick={() => setActiveTab("inProgress")}
              >
                In Progress
              </span>
              <span
                className={`cursor-pointer rounded-2xl px-4 py-3 text-center transition-all duration-300 ${
                  !isInProgress
                    ? "bg-gradient-to-r from-brandBlue to-red-500 text-brandBlue shadow-lg shadow-red-100"
                    : "bg-white text-gray-700 hover:bg-red-50"
                }`}
                onClick={() => setActiveTab("paid")}
              >
                Paid
              </span>
            </div>
          </div>

          {/* Conditional Tab Content */}
          <div className="mt-4 rounded-[28px] border border-gray-100 bg-white/90 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-5">
            {isInProgress ? (
              <ComissionPaymentInProgress />
            ) : (
              <ComissionPaymentPaid />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CommissionPayment;
