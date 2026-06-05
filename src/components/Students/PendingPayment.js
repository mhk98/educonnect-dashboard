import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Button } from "@windmill/react-ui";
import toast from "react-hot-toast";
import { useInitPendingPaymentMutation } from "../../features/pendingPayment/pendingPayment";
import axios from "axios";

function PendingPayment({ id }) {
  const branch = localStorage.getItem("branch");
  const FirstName = localStorage.getItem("FirstName");
  const LastName = localStorage.getItem("LastName");
  const [activeTab, setActiveTab] = useState("online");
  const [file, setFile] = useState(null);
  const userId = localStorage.getItem("userId");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [initPendingPayment] = useInitPendingPaymentMutation();

  const onFormSubmit = async (data) => {
    let status = "Online";
    // const formData = new FormData();
    // formData.append("amount", data.amount);
    // formData.append("paymentReason", data.paymentReason);
    // formData.append("refundCondition", data.refundCondition);
    // formData.append("status", online);
    // if (file) {
    //     formData.append("file", file);
    // }

    const info = {
      amount: data.amount,
      paymentStatus: status,
      purpose: data.purpose,
      user_id: id,
      branch: branch,
      userId: userId,
    };

    try {
      const res = await initPendingPayment(info);
      if (res.data?.success) {
        toast.success(res.data.message);
        console.log("paymentInit", res.data.data);
        window.open(res.data.data);
      } else {
        toast.error(res.error?.data?.message || "Failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const onFormSubmit1 = async (data) => {
    let status = "Offline";
    const formData = new FormData();
    formData.append("amount", data.amount);
    formData.append("paymentStatus", status);
    formData.append("purpose", data.purpose);
    formData.append("employee", `${FirstName} ${LastName}`);
    formData.append("branch", branch);
    formData.append("user_id", id);
    formData.append("userId", userId);
    if (file) {
      formData.append("file", file);
    }

    console.log("formData", formData);

    try {
      const res = await initPendingPayment(formData);
      if (res.data?.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.error?.data?.message || "Failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  // const [employees, setEmployees] = useState([]);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:5000/api/v1/user");
  //       const allUsers = response.data.data;

  //       // ফিল্টার লজিক
  //       const filtered = allUsers.filter(user => {
  //         const role = user.Role?.toLowerCase(); // রোল lowercase করে নিচ্ছি
  //         return role && role === "employee" &&  user.Branch === branch
  //       });

  //       setEmployees(filtered);
  //     } catch (err) {
  //       console.error("Error fetching users:", err);
  //     }
  //   };

  //   fetchUsers();
  // }, [branch]);

  const [superAdminEmployees, setSuperAdminEmployees] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/user",
        );
        const allUsers = response.data.data;

        // ফিল্টার লজিক
        const filtered = allUsers.filter((user) => {
          const role = user.Role?.toLowerCase(); // রোল lowercase করে নিচ্ছি
          return role && role === "employee";
        });

        setSuperAdminEmployees(filtered);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [branch]);

  return (
    <>
      {/* <PageTitle>Dashboard</PageTitle> */}

      <div className="w-full bg-white shadow-sm">
        <div className="flex justify-center gap-6 border-b border-gray-200">
          <div className="relative">
            <p
              onClick={() => setActiveTab("online")}
              className={`cursor-pointer py-4 px-2 text-sm sm:text-base font-semibold transition-all ${
                activeTab === "online" ? "text-brandBlue" : "text-gray-800"
              }`}
            >
              Online Payment
            </p>
            {activeTab === "online" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brandBlue" />
            )}
          </div>

          <div className="relative">
            <p
              onClick={() => setActiveTab("offline")}
              className={`cursor-pointer py-4 px-2 text-sm sm:text-base font-semibold transition-all ${
                activeTab === "offline" ? "text-brandBlue" : "text-gray-800"
              }`}
            >
              Offline Payment
            </p>
            {activeTab === "offline" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brandBlue" />
            )}
          </div>
        </div>

        <div className="p-4">
          {activeTab === "online" ? (
            <div className="w-full px-4 py-6 bg-gray-50">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Form Section */}
                <div className="w-full flex justify-center">
                  <form
                    onSubmit={handleSubmit(onFormSubmit)}
                    className="w-full max-w-md"
                  >
                    <div className="grid grid-cols-1 gap-4">
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

                      <div className="mb-4">
                        <label className="block text-sm mb-1 text-gray-700">
                          Payment Purpose
                        </label>
                        <Input
                          type="text"
                          {...register("purpose")}
                          className="w-full p-3 shadow-md border rounded-md"
                        />
                        {errors.purpose && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.purpose.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end mt-6">
                      <Button
                        type="submit"
                        className="btn"
                        style={{ backgroundColor: "#1B2E6B" }}
                      >
                        Pay Online
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="w-full px-4 py-6 bg-gray-50">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Form Section */}
                  <div className="w-full flex justify-center">
                    <form
                      onSubmit={handleSubmit(onFormSubmit1)}
                      className="w-full max-w-md"
                    >
                      <div className="grid grid-cols-1 gap-4">
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

                        <div className="mb-4">
                          <label className="block text-sm mb-1 text-gray-700">
                            Payment Purpose
                          </label>
                          <Input
                            type="text"
                            {...register("purpose")}
                            className="w-full p-3 shadow-md border rounded-md"
                          />
                          {errors.purpose && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.purpose.message}
                            </p>
                          )}
                        </div>

                        {/* <div className="mb-4">
                    <label className="block text-sm mb-1 text-gray-700 mb-4">Employee</label>
                    <select
                      {...register("employee")}
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
                  </div> */}

                        <div>
                          <label className="block text-sm mb-1 text-gray-700">
                            Upload Payment Documents
                          </label>
                          <input
                            type="file"
                            name="file"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            required
                            className="input"
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end mt-6">
                        <Button
                          type="submit"
                          className="btn"
                          style={{ backgroundColor: "#1B2E6B" }}
                        >
                          Pay Offline
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PendingPayment;
