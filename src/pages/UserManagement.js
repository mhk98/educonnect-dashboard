import React, { useState } from "react";
import UserManagementFilter from "../components/UserManagement/UserManagementFilter";

import { Input } from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useUserRegisterMutation } from "../features/auth/auth";
import { useGetAllBranchQuery } from "../features/branch/branch";

function UserManagement() {
  function closeModal() {
    document.getElementById("user_add_modal")?.close();
  }

  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [userRegister] = useUserRegisterMutation();

  const {
    data: branchData,
    isLoading: branchLoading,
    isError: branchError,
  } = useGetAllBranchQuery();

  const First_Name = localStorage.getItem("FirstName");
  const Last_Name = localStorage.getItem("LastName");
  const id = localStorage.getItem("userId");

  const onFormSubmit = async (data) => {
    console.log("formData", data);
    const formData = new FormData();
    formData.append("FirstName", data.FirstName);
    formData.append("LastName", data.LastName);
    formData.append("Email", data.Email);
    formData.append("CreatedOn", `${First_Name} ${Last_Name}`);
    formData.append("Password", data.Password);
    formData.append("Phone", data.Phone);
    formData.append("Address", data.Address);
    formData.append("Role", data.Role);
    formData.append("Branch", data.Branch);
    formData.append("userId", id);
    if (file) {
      formData.append("image", file);
    }

    try {
      const res = await userRegister(formData);
      if (res.data?.success) {
        toast.success(res.data.message);
        reset();
        setFile(null);
        closeModal();
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
    <>
      {/* <PageTitle>Dashboard</PageTitle> */}
      <div className="w-full px-2 sm:px-4 py-4 sm:py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          {/* Header Section */}
          <div>
            <h4 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
              User Management
            </h4>

            <dialog id="user_add_modal" className="modal">
              <div
                className="modal-box w-11/12 max-w-2xl text-left p-4 sm:p-6 overflow-y-auto"
                style={{ maxHeight: "90vh" }}
              >
                <h3 className="font-bold text-lg sm:text-xl text-gray-900">
                  Add New User
                </h3>
                <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4">
                  {/* Left Side */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                    <label className="block text-sm mb-1 text-gray-700">
                      First Name
                    </label>
                    <Input
                      type="text"
                      {...register("FirstName")}
                      onKeyDown={handleEnter}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.FirstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.FirstName.message}
                      </p>
                    )}
                    </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      {...register("LastName")}
                      onKeyDown={handleEnter}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.LastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.LastName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">
                      Mobile Number
                    </label>
                    <Input
                      type="number"
                      {...register("Phone")}
                      onKeyDown={handleEnter}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.Phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.Phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">
                      Address
                    </label>
                    <Input
                      type="text"
                      {...register("Address")}
                      onKeyDown={handleEnter}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.Address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.Address.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-gray-700">
                      Email
                    </label>
                    <Input
                      type="email"
                      {...register("Email")}
                      onKeyDown={handleEnter}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.Email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.Email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700">
                      Password
                    </label>
                    <Input
                      type="password"
                      {...register("Password")}
                      onKeyDown={handleEnter}
                      className="input input-bordered w-full form-control shadow-md p-3"
                    />
                    {errors.Password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.Password.message}
                      </p>
                    )}
                  </div>
                  <div>
                    {/* <label className="block text-sm text-gray-700 mb-2">
                      Role
                    </label> */}
                    <select
                      {...register("Role")}
                      onKeyDown={handleEnter}
                      className="input input-bordered w-full p-3 border border-gray-300"
                    >
                      <option value="">Select Role</option>
                      <option value="student">Student</option>
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                      <option value="superAdmin">Super Admin</option>
                    </select>

                    {errors.Role && (
                      <p className="text-red-500 text-sm">
                        {errors.Role.message}
                      </p>
                    )}
                  </div>
                  <div>
                    {/* <label className="block text-sm text-gray-700 mb-2">
                      Branch
                    </label> */}
                    <select
                      {...register("Branch")}
                      onKeyDown={handleEnter}
                      className="input input-bordered border border-gray-300 w-full shadow-md p-3"
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
                            branchItem.id || branchItem._id || branchItem.name
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
                    {errors.Branch && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.Branch.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm mb-1 text-gray-700">
                      Profile Image
                    </label>
                    <input
                      onKeyDown={handleEnter}
                      type="file"
                      accept="image/*"
                      className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm"
                      onChange={handleFileChange}
                    />
                  </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
                    <button
                      type="button"
                      className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 bg-brandBlue text-white rounded hover:bg-brandBlue"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </dialog>
          </div>
          {/* Right Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => {
                document.getElementById("user_add_modal").showModal();
              }}
              className="w-full sm:w-auto px-4 py-2 bg-brandBlue text-white rounded-md text-sm md:text-base hover:bg-brandBlue-700 transition"
            >
              + Add New User
            </button>
          </div>
        </div>
      </div>
      {/* <CTA /> */}

      <UserManagementFilter />
      {/* <UserManagementTable/> */}
    </>
  );
}

export default UserManagement;
