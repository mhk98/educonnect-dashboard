import React, { useState } from "react";
import EnquiriesRequestedPanel from "../components/Enquiries/EnquiriesRequestedPanel";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Button,
} from "@windmill/react-ui";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select"; // Correct select import
import { Label } from "@windmill/react-ui";
import { useCreateEnquiriesMutation } from "../features/enquiries/enquiries";
import { useGetAllBranchQuery } from "../features/branch/branch";
import { useGetAllCountryQuery } from "../features/country/country";
import EnquiriesArchivedPanel from "../components/Enquiries/EnquiriesArchivedPanel";

const studyAreaOptions = [
  { value: "engineering", label: "Engineering" },
  { value: "business", label: "Business" },
  { value: "medicine", label: "Medicine" },
  { value: "arts", label: "Arts" },
  { value: "law", label: "Law" },
];

const studyLevelOptions = [
  { value: "bachelor", label: "Bachelor" },
  { value: "master", label: "Master" },
  { value: "phd", label: "PhD" },
  { value: "diploma", label: "Diploma" },
  { value: "certificate", label: "Certificate" },
];

function Enquiries() {
  const [enquiryType, setEnquiryType] = useState("not-in");
  const [activeTab, setActiveTab] = useState("requested");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isRequested = activeTab === "requested";

  const {
    register,
    handleSubmit,
    reset,
    control,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [createEnquiries] = useCreateEnquiriesMutation();

  const {
    data: branchData,
    isLoading: branchLoading,
    isError: branchError,
  } = useGetAllBranchQuery();

  const {
    data: countryData,
    isLoading: countryLoading,
    isError: countryError,
  } = useGetAllCountryQuery();

  const closeModal = () => setIsModalOpen(false);

  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // convert FileList to Array
  };

  // const onFormSubmit = async (data) => {

  //   const formData = new FormData();
  // 	formData.append("studyArea", data.studyArea?.map((option) => option.value));
  // 	formData.append("studyLevel", data.studyLevel?.map((option) => option.value));
  // 	formData.append("firstName", data.firstName);
  // 	formData.append("lastName", data.lastName);
  // 	formData.append("destination", data.destination);
  // 	formData.append("educationCountry", data.educationCountry);
  // 	formData.append("educationLevel", data.educationLevel);

  // 	if (file) {
  // 		formData.append("file", file);
  // 	}

  //   console.log("formdata", formData)
  //   try {
  //     const res = await createEnquiries(formData);
  //     if (res.data?.success) {
  //       toast.success(res.data.message);
  //       reset();
  //       closeModal();
  //     } else {
  //       toast.error(res.error?.data?.message || 'Failed. Please try again.');
  //     }
  //   } catch (error) {
  //     toast.error('An unexpected error occurred.');
  //   }
  // };

  const id = localStorage.getItem("userId");
  const onFormSubmit = async (data) => {
    const formData = new FormData();

    // data.studyArea?.forEach((option) => {
    //   formData.append("studyArea[]", option.value);
    // });

    // data.studyLevel?.forEach((option) => {
    //   formData.append("studyLevel[]", option.value);
    // });

    formData.append(
      "studyArea",
      data.studyArea?.map((option) => option.value),
    );
    formData.append(
      "studyLevel",
      data.studyLevel?.map((option) => option.value),
    );

    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("destination", data.destination);
    formData.append("educationCountry", data.educationCountry);
    formData.append("educationLevel", data.educationLevel);
    formData.append("additionalInfo", data.additionalInfo);
    formData.append("Branch", data.branch);
    formData.append("user_id", id);
    files.forEach((file) => {
      formData.append("files", file); // "files" matches multer's field name
    });

    try {
      const res = await createEnquiries(formData);
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

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };

  return (
    <div className="w-full px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-red-100 bg-gradient-to-br from-white via-red-50/40 to-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brandBlue">
              Manage Enquiries
            </p>
            <h4 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Enquiries
            </h4>
            <p
              onClick={() => setIsModalOpen(true)}
              className="mt-2 cursor-pointer text-sm text-gray-500 sm:text-base"
            >
              Manage your student’s enquiries.
            </p>

            <dialog
              id="enquiries_add_modal"
              className="modal w-[95vw] max-w-5xl rounded-[24px] p-0 backdrop:bg-black/40"
            >
              <div className="max-h-[90vh] overflow-y-auto rounded-[24px] bg-white p-4 shadow-2xl sm:p-6">
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Request For Course Options
                </h3>

                <form
                  onSubmit={handleSubmit(onFormSubmit)}
                  className="space-y-6"
                >
                  <div>
                    <label className="block font-medium mb-2">
                      Select Enquiry Type<span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="enquiryType"
                          value="not-in"
                          checked={enquiryType === "not-in"}
                          onChange={() => setEnquiryType("not-in")}
                          className="accent-blue-600"
                        />
                        Student not in EduAnchor.ai
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="enquiryType"
                          value="in"
                          checked={enquiryType === "in"}
                          onChange={() => setEnquiryType("in")}
                          className="accent-blue-600"
                        />
                        Student in EduAnchor.ai
                      </label>
                    </div>
                  </div>

                  {enquiryType === "in" ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1 font-medium">
                            First Name<span className="text-red-500">*</span>
                          </label>
                          <Input
                            onKeyDown={handleEnter}
                            {...register("firstName", { required: true })}
                            placeholder="Enter First Name"
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-sm">
                              First name is required.
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">
                            Last Name<span className="text-red-500">*</span>
                          </label>
                          <Input
                            onKeyDown={handleEnter}
                            {...register("lastName", { required: true })}
                            placeholder="Enter Last Name"
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-sm">
                              Last name is required.
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block mb-1 font-medium">
                            Select Branch<span className="text-red-500">*</span>
                          </label>
                          <select
                            onKeyDown={handleEnter}
                            {...register("branch", { required: true })}
                            className="w-full border rounded px-3 py-2"
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
                            <p className="text-red-500 text-sm mt-1">
                              {errors.branch.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1 font-medium">
                            Preferred Destination
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            onKeyDown={handleEnter}
                            {...register("destination", { required: true })}
                            className="w-full border rounded px-3 py-2"
                          >
                            <option value="">Select Destination</option>
                            {countryData?.data?.map((country) => (
                              <option key={country._id} value={country.name}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">
                            Student's Country of Education
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            onKeyDown={handleEnter}
                            {...register("educationCountry", {
                              required: true,
                            })}
                            className="w-full border rounded px-3 py-2"
                          >
                            <option value="">Select Country</option>
                            {countryData?.data?.map((country) => (
                              <option key={country._id} value={country.name}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">
                            Highest Education Level
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            onKeyDown={handleEnter}
                            {...register("educationLevel", { required: true })}
                            className="w-full border rounded px-3 py-2"
                          >
                            <option>Select Level</option>
                            <option value="SSC">SSC</option>
                            <option value="HSC">HSC</option>
                            <option value="Bachelor">Bachelor</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>
                            Preferred Study Area{" "}
                            <span className="text-red-500">*</span>
                            <span className="text-sm text-gray-500">
                              {" "}
                              (Max 3)
                            </span>
                          </Label>
                          <Controller
                            onKeyDown={handleEnter}
                            name="studyArea"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                isMulti
                                options={studyAreaOptions}
                                onChange={(selected) => {
                                  field.onChange(selected);
                                  clearErrors("studyArea");
                                }}
                                className="text-sm"
                                placeholder="Select Study Areas"
                              />
                            )}
                          />
                          {errors.studyArea && (
                            <p className="text-red-500 text-sm">
                              Study area is required.
                            </p>
                          )}
                        </div>

                        <div>
                          <Label>
                            Preferred Level{" "}
                            <span className="text-red-500">*</span>
                            <span className="text-sm text-gray-500">
                              {" "}
                              (Max 3)
                            </span>
                          </Label>
                          <Controller
                            onKeyDown={handleEnter}
                            name="studyLevel"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                isMulti
                                options={studyLevelOptions}
                                onChange={(selected) => {
                                  field.onChange(selected);
                                  clearErrors("studyLevel");
                                }}
                                className="text-sm"
                                placeholder="Select Study Levels"
                              />
                            )}
                          />
                          {errors.studyLevel && (
                            <p className="text-red-500 text-sm">
                              Study level is required.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="w-full">
                        <label className="block mb-1 font-medium">
                          Additional Information
                        </label>
                        <textarea
                          onKeyDown={handleEnter}
                          {...register("additionalInfo")}
                          placeholder="Type your message here..."
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={4} // Optional: Adjust height
                        />
                        {errors.additionalInfo && (
                          <p className="text-red-500 text-sm">
                            {errors.additionalInfo.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block mb-1 font-medium">
                          Academic Documents
                        </label>
                        <input
                          type="file"
                          name="files" // use plural
                          accept="image/*,application/pdf"
                          onChange={handleFileChange}
                          className="w-full"
                          multiple // allow multiple file selection
                        />
                      </div>

                      <div className="text-center">
                        <Button
                          type="submit"
                          className="w-full rounded-2xl bg-brandBlue px-6 py-3 font-semibold text-white sm:w-auto"
                        >
                          Request Course Options
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div>
                          <label className="block mb-1 font-medium">
                            First Name<span className="text-red-500">*</span>
                          </label>
                          <Input
                            onKeyDown={handleEnter}
                            {...register("firstName", { required: true })}
                            placeholder="Enter First Name"
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-sm">
                              First name is required.
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">
                            Last Name<span className="text-red-500">*</span>
                          </label>
                          <Input
                            onKeyDown={handleEnter}
                            {...register("lastName", { required: true })}
                            placeholder="Enter Last Name"
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-sm">
                              Last name is required.
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">
                            Select Branch<span className="text-red-500">*</span>
                          </label>
                          <select
                            onKeyDown={handleEnter}
                            {...register("branch", { required: true })}
                            className="w-full border rounded px-3 py-2"
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
                            <p className="text-red-500 text-sm mt-1">
                              {errors.branch.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1 font-medium">
                            Preferred Destination
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            onKeyDown={handleEnter}
                            {...register("destination", { required: true })}
                            className="w-full border rounded px-3 py-2"
                          >
                            <option value="">Select Destination</option>
                            {countryData?.data?.map((country) => (
                              <option key={country._id} value={country.name}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">
                            Student's Country of Education
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            onKeyDown={handleEnter}
                            {...register("educationCountry", {
                              required: true,
                            })}
                            className="w-full border rounded px-3 py-2"
                          >
                            <option value="">Select Country</option>
                            {countryData?.data?.map((country) => (
                              <option key={country._id} value={country.name}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">
                            Highest Education Level
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            onKeyDown={handleEnter}
                            {...register("educationLevel", { required: true })}
                            className="w-full border rounded px-3 py-2"
                          >
                            <option>Select Level</option>
                            <option value="SSC">SSC</option>
                            <option value="HSC">HSC</option>
                            <option value="Bachelor">Bachelor</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>
                            Preferred Study Area{" "}
                            <span className="text-red-500">*</span>
                            <span className="text-sm text-gray-500">
                              {" "}
                              (Max 3)
                            </span>
                          </Label>
                          <Controller
                            onKeyDown={handleEnter}
                            name="studyArea"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                isMulti
                                options={studyAreaOptions}
                                onChange={(selected) => {
                                  field.onChange(selected);
                                  clearErrors("studyArea");
                                }}
                                className="text-sm"
                                placeholder="Select Study Areas"
                              />
                            )}
                          />
                          {errors.studyArea && (
                            <p className="text-red-500 text-sm">
                              Study area is required.
                            </p>
                          )}
                        </div>

                        <div>
                          <Label>
                            Preferred Level{" "}
                            <span className="text-red-500">*</span>
                            <span className="text-sm text-gray-500">
                              {" "}
                              (Max 3)
                            </span>
                          </Label>
                          <Controller
                            onKeyDown={handleEnter}
                            name="studyLevel"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                isMulti
                                options={studyLevelOptions}
                                onChange={(selected) => {
                                  field.onChange(selected);
                                  clearErrors("studyLevel");
                                }}
                                className="text-sm"
                                placeholder="Select Study Levels"
                              />
                            )}
                          />
                          {errors.studyLevel && (
                            <p className="text-red-500 text-sm">
                              Study level is required.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="w-full">
                        <label className="block mb-1 font-medium">
                          Additional Information
                        </label>
                        <textarea
                          onKeyDown={handleEnter}
                          {...register("additionalInfo")}
                          placeholder="Type your message here..."
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={4} // Optional: Adjust height
                        />
                        {errors.additionalInfo && (
                          <p className="text-red-500 text-sm">
                            {errors.additionalInfo.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block mb-1 font-medium">
                          Academic Documents
                        </label>
                        <input
                          type="file"
                          name="files" // use plural
                          accept="image/*,application/pdf"
                          onChange={handleFileChange}
                          className="w-full"
                          multiple // allow multiple file selection
                        />
                      </div>

                      {/* <div className="text-center">
                    <Button
                      style={{ backgroundColor: "#1B2E6B" }}
                      type="submit"
                    >
                      Request Course Options
                    </Button>
                  </div> */}
                      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          className="rounded-2xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                          onClick={() =>
                            document
                              .getElementById("enquiries_add_modal")
                              .close()
                          }
                        >
                          Close
                        </button>
                        <button
                          type="submit"
                          className="rounded-2xl bg-brandBlue px-6 py-3 text-sm font-semibold text-white hover:bg-brandBlue"
                          onClick={() =>
                            document
                              .getElementById("enquiries_add_modal")
                              .close()
                          }
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </dialog>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => {
                document.getElementById("enquiries_add_modal").showModal();
                setIsModalOpen(true);
              }}
              className="rounded-2xl bg-gradient-to-r from-brandBlue to-red-500 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-red-100 transition hover:shadow-xl sm:text-base"
            >
              + Request Program Options from EduAnchor Team
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-7xl rounded-[24px] bg-white/70 p-2 shadow-sm ring-1 ring-gray-100 backdrop-blur">
        <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
          <span
            onClick={() => setActiveTab("requested")}
            className={`cursor-pointer rounded-2xl px-4 py-3 text-center transition-all duration-300 ${
              isRequested
                ? "bg-gradient-to-r from-brandBlue to-red-500 text-brandBlue shadow-lg shadow-red-100"
                : "bg-white text-gray-700 hover:bg-red-50"
            }`}
          >
            Requested
          </span>
          <span
            onClick={() => setActiveTab("paid")}
            className={`cursor-pointer rounded-2xl px-4 py-3 text-center transition-all duration-300 ${
              !isRequested
                ? "bg-gradient-to-r from-brandBlue to-red-500 text-brandBlue shadow-lg shadow-red-100"
                : "bg-white text-gray-700 hover:bg-red-50"
            }`}
          >
            Archived
          </span>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-7xl rounded-[28px] border border-gray-100 bg-white/90 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-4">
        {isRequested ? <EnquiriesRequestedPanel /> : <EnquiriesArchivedPanel />}
      </div>
    </div>
  );
}

export default Enquiries;
