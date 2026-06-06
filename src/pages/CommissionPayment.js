import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, TrendingUp, Plus } from "lucide-react";
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
      <div className="w-full px-4 sm:px-8 py-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-brandBlue flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brandBlue">
                  Commission
                </p>
                <h4 className="text-2xl font-bold text-gray-900 leading-tight">
                  Commission Payment
                </h4>
              </div>
            </div>
            <p className="hidden md:block text-sm text-gray-400">
              Track commission requests and paid transactions in one place
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              {/* Modal */}

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
                        className="btn w-full rounded-2xl bg-brandBlue hover:bg-blue-800 text-white px-8 py-3 font-semibold sm:w-auto"
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
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-brandBlue px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                Request Commission
              </button>
            </div>
          </div>

          {/* Tab Section */}
          <div className="mt-6 w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-100">
              {[
                { id: "inProgress", label: "In Progress", icon: Clock },
                { id: "paid", label: "Paid", icon: CheckCircle },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center py-5 text-sm font-semibold border-b-2 transition-all -mb-px outline-none focus:outline-none ${
                    activeTab === id
                      ? "border-brandBlue text-brandBlue"
                      : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
                  }`}
                >
                  <span
                    className={`w-8 h-8 mr-2.5 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      activeTab === id
                        ? "bg-brandBlue/10 text-brandBlue"
                        : "text-gray-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-5">
              {isInProgress ? (
                <ComissionPaymentInProgress />
              ) : (
                <ComissionPaymentPaid />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommissionPayment;
