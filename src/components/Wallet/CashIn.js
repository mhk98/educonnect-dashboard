import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Input, Button } from "@windmill/react-ui";
import { useInitPendingPaymentMutation } from "../../features/pendingPayment/pendingPayment";

const CashIn = ({ id }) => {
  const branch = localStorage.getItem("branch");
  const FirstName = localStorage.getItem("FirstName");
  const LastName = localStorage.getItem("LastName");
  const userId = localStorage.getItem("userId");

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [initPendingPayment] = useInitPendingPaymentMutation();

  const onFormSubmit = async (data) => {
    let status = "Cash-In";
    const info = {
      amount: data.amount,
      purpose: data.purpose,
      employee: `${FirstName} ${LastName}`,
      paymentStatus: status,
      branch: branch,
      user_id: userId,
    };

    try {
      const res = await initPendingPayment(info);
      if (res.data?.success) {
        toast.success(res.data.message);
        reset();
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

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="w-full rounded-[24px] border border-gray-100 bg-gradient-to-br from-white to-gray-50/60 p-4 shadow-sm sm:p-6"
      >
        <div className="grid grid-cols-1 gap-4">
          {/* Amount */}
          {/* <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-700">Transaction Id</label>
                    <Input
                      type="text"
                      {...register("transactionId")}
                      className="w-full p-3 shadow-md border rounded-md"
                    />
                    {errors.transactionId && (
                      <p className="text-red-500 text-sm mt-1">{errors.transactionId.message}</p>
                    )}
                  </div> */}

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Amount
            </label>
            <Input
              type="number"
              {...register("amount")}
              onKeyDown={handleEnter}
              className="w-full rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition focus:border-brandBlue focus:ring-2 focus:ring-red-100"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Reason For Payment */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Purpose for Cash-In
            </label>
            <Input
              type="text"
              {...register("purpose")}
              onKeyDown={handleEnter}
              className="w-full rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition focus:border-brandBlue focus:ring-2 focus:ring-red-100"
            />
            {errors.purpose && (
              <p className="text-red-500 text-sm mt-1">
                {errors.purpose.message}
              </p>
            )}
          </div>

          {/* {
                    role === "admin" &&
                      <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-700 mb-4">Employee</label>
                    <select
                      {...register("employee")}
                      onKeyDown = {handleEnter}
                      className="input input-bordered w-full shadow-md p-3"
                    >
                      <option value="">Select Employee</option>
                      {
                        
                      employees.map((employee) => (
                        <option
                          key={employee.id}
                          value={`${employee.FirstName} ${employee.LastName}`}
                        >
                          {employee.FirstName} {employee.LastName}
                        </option>
                      ))
                      
                      }
                    </select>
                    {errors.employee && (
                      <p className="text-red-500 text-sm mt-1">{errors.employee.message}</p>
                    )}
                  </div> 
                    
                  }
                 
                  {
                    role === "admin" && 
                    <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-2">
                      Branch
                    </label>
                    <select
                      {...register("branch")}
                      onKeyDown = {handleEnter}
                      className="input input-bordered w-full shadow-md p-3"
                    >
                      <option value="">Select Branch</option>
                      {branchLoading && <option disabled>Loading branches...</option>}
                      {branchError && <option disabled>Error loading branches</option>}
                      {branchData?.data?.map((branchItem) => (
                        <option key={branchItem.id || branchItem._id || branchItem.name} value={branchItem.branch || branchItem.name || branchItem.Branch}>
                          {branchItem.branch || branchItem.name || branchItem.Branch}
                        </option>
                      ))}
                    </select>
                    {errors.branch && (
                      <p className="text-red-500 text-sm mt-1">{errors.branch.message}</p>
                    )}
                  </div>
                  } */}
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            className="btn w-full rounded-2xl bg-gradient-to-r from-brandBlue to-red-500 px-6 py-3 font-semibold shadow-lg shadow-red-100 sm:w-auto"
          >
            Submit Request
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CashIn;
