import React, { useState } from "react";
import StudentTable from "../components/Students/StudentTable";
import { useForm } from "react-hook-form";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Button,
} from "@windmill/react-ui";
import { useUserRegisterMutation } from "../features/auth/auth";
import { Link } from "react-router-dom/cjs/react-router-dom";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useGetAllBranchQuery } from "../features/branch/branch";

function Students() {
  const [phone, setPhone] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
    setImage(null);
    setPhone("");
    reset();
  }

  const {
    data: branchData,
    isLoading: branchLoading,
    isError: branchError,
  } = useGetAllBranchQuery();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [userRegister] = useUserRegisterMutation();

  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const First_Name = localStorage.getItem("FirstName");
  const Last_Name = localStorage.getItem("LastName");
  const id = localStorage.getItem("userId");

  const onFormSubmit = async (data) => {
    const role = "student";
    console.log("formData", data);
    const formData = new FormData();
    formData.append("FirstName", data.FirstName);
    formData.append("LastName", data.LastName);
    formData.append("CreatedOn", `${First_Name} ${Last_Name}`);
    formData.append("Email", data.Email);
    formData.append("Password", data.Password);
    // formData.append("Phone", `${data.CountryCode}${data.Phone}`);
    formData.append("Phone", phone); // phone from PhoneInput state
    formData.append("Branch", data.Branch);
    formData.append("Address", data.Address);
    formData.append("Role", role);
    formData.append("userId", id);

    if (image) {
      formData.append("image", image);
    }

    console.log("formData", formData);

    try {
      const res = await userRegister(formData);
      if (res.data?.success) {
        toast.success(res.data.message);
        closeModal();
      } else {
        toast.error(
          res.error?.data?.message || "Registration failed. Please try again.",
        );
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
      <div className="w-full px-3 sm:px-4 py-4 sm:py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Title and Subtitle */}
          <div>
            <h4 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Students
            </h4>
            <p className="text-sm md:text-sm text-gray-500 mt-1">
              Manage your Students and their Profiles
            </p>
          </div>

          {/* Right: Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
            {/* Request Program Options */}
            <Link
              to="/app/archive-student"
              className="w-full px-4 py-2 bg-white text-brandRed border-2 border-brandRed rounded-lg text-sm md:text-base transition text-center"
            >
              Archived Students
            </Link>

            {/* Register New Student */}
            <button
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="w-full px-4 py-2 bg-brandRed text-white rounded-lg text-sm md:text-base hover:bg-brandRed-700 transition"
            >
              + Register New Student
            </button>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <ModalHeader>Register New Student</ModalHeader>
              <ModalBody className="overflow-y-auto" style={{ maxHeight: "80vh" }}>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Side */}

                    <div className="mb-4">
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
                    <div className="mb-4">
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

                    {/* <div className="mb-4">
                  <label className="block text-sm mb-1 text-gray-700">Mobile Number</label>
                  <Input
                    type="number"
                    {...register("Phone")}
                    onKeyDown =  {handleEnter}
                    className="input input-bordered w-full form-control shadow-md p-3"
                  />
                  {errors.Phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.Phone.message}</p>
                  )}
                </div> */}

                    {/* <div className="mb-4">
              <label className="block text-sm mb-1 text-gray-700">Mobile Number</label>
              <div className="flex">
                <select
                  className="input input-bordered shadow-md p-3 rounded-l-md"
                  style={{ borderRight: "none" }}
                  defaultValue="+880"
                  {...register("CountryCode")}
                >
                  <option value="+880">🇧🇩 +880</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <Input
                  type="tel"
                  {...register("Phone")}
                  onKeyDown={handleEnter}
                  placeholder="1XXXXXXXXX"
                  className="input input-bordered shadow-md p-3 rounded-r-md"
                />
              </div>
              {errors.Phone && <p className="text-red-500 text-sm mt-1">{errors.Phone.message}</p>}
            </div> */}

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Mobile Number
                      </label>
                      <PhoneInput
                        country={"bd"}
                        value={phone}
                        onChange={setPhone}
                        inputProps={{
                          name: "Phone",
                          required: true,
                          className:
                            "w-full px-10 py-3 rounded border border-gray-300 shadow-sm",
                        }}
                        containerStyle={{ width: "100%" }}
                      />
                    </div>

                    <div className="mb-4">
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

                    <div className="mb-4">
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
                    <div className="mb-4">
                      <label className="block text-sm text-gray-700 mb-2">
                        Branch
                      </label>
                      <select
                        {...register("Branch")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full shadow-md p-3"
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
                    <div className="mb-4">
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

                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1 text-gray-700">
                        Profile Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm"
                        onChange={handleImageChange}
                      />
                      {/* <input type="file" accept="application/pdf" onChange={handleImageChange} /> */}
                    </div>
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
                    <Button
                      type="button"
                      layout="outline"
                      onClick={closeModal}
                      className="w-full sm:w-auto"
                    >
                      Close
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto btn bg-brandRed"
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </div>
      {/* <CTA /> */}

      {/* <StudentFilter/> */}
      <StudentTable />
    </>
  );
}

export default Students;
