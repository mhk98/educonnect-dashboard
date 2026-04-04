import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody } from "@windmill/react-ui";
import { useForm, Controller } from "react-hook-form";
import {
  useGetDataByIdQuery,
  useUpdateConsultationMutation,
} from "../../features/consultation/consultation";
import { useGetAllBranchQuery } from "../../features/branch/branch";
import toast from "react-hot-toast";
import { FaInfoCircle } from "react-icons/fa";

function Client({ id }) {
  //   const id = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const branch = localStorage.getItem("branch");
  const userId = localStorage.getItem("userId");

  const [consultationId, setConsultationId] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const { data, isLoading, isError, error } = useGetDataByIdQuery(id);

  const {
    data: branchData,
    isLoading: branchLoading,
    isError: branchError,
  } = useGetAllBranchQuery();

  const [consultation, setConsultation] = useState(null);

  useEffect(() => {
    if (isError) {
      console.log("Error fetching", error);
    } else if (!isLoading && data?.data) {
      setConsultation(data.data);
    }
  }, [data, isLoading, isError, error]);

  // Set form values when modal opens with consultation data
  useEffect(() => {
    if (isModalOpen && consultation) {
      setValue("date", consultation?.date || "");
      setValue("appointmentDate", consultation?.appointmentDate || "");
      setValue("status", consultation?.status || "");
      setValue("type", consultation?.type || "");
      setValue("fullName", consultation?.fullName || "");
      setValue("phone", consultation?.phone || "");
      setValue("email", consultation?.email || "");
      setValue("destination", consultation?.destination || "");
      setValue("address", consultation?.address || "");
      setValue("ielts", consultation?.ielts || "");
      setValue("ieltsScore", consultation?.ieltsScore || "");
      setValue("location", consultation?.location || "");
      setValue("applicationCode", consultation?.applicationCode || "");
      setValue("sscYear", consultation?.sscYear || "");
      setValue("sscDepartment", consultation?.sscDepartment || "");
      setValue("sscCGPA", consultation?.sscCGPA || "");
      setValue("hscYear", consultation?.hscYear || "");
      setValue("hscDepartment", consultation?.hscDepartment || "");
      setValue("hscCGPA", consultation?.hscCGPA || "");
      setValue("bachelorYear", consultation?.bachelorYear || "");
      setValue("bachelorDepartment", consultation?.bachelorDepartment || "");
      setValue("bachelorCGPA", consultation?.bachelorCGPA || "");
    }
  }, [isModalOpen, consultation]);

  console.log("consultations", consultation?.fullName);

  const [updateConsultation] = useUpdateConsultationMutation();

  const onFormEdit = async (formData) => {
    console.log("Form Data received:", formData);

    const dataExtended = {
      ...formData,
      userId: userId,
      location: branch,
      appointmentDate: formData.appointmentDate,
      status: formData.status,
      type: formData.type,
    };

    console.log("Data Extended:", dataExtended);
    console.log("Consultation ID:", consultationId);

    try {
      const res = await updateConsultation({
        id: consultationId,
        data: dataExtended,
      });
      console.log("Response:", res);

      if (res.data?.success) {
        toast.success(res.data.message);
        reset();
        setIsModalOpen(false);
      } else {
        toast.error(res.error?.data?.message || "Failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <>
      <div className="w-full px-4 py-6 bg-gray-50">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-brandRed font-semibold text-sm">
              <FaInfoCircle className="w-5 h-5" />
              Client Information
            </div>
            <button
              onClick={() => {
                reset({
                  date: consultation?.date || "",
                  appointmentDate: consultation?.appointmentDate || "",
                  status: consultation?.status || "",
                  type: consultation?.type || "",
                  fullName: consultation?.fullName || "",
                  phone: consultation?.phone || "",
                  email: consultation?.email || "",
                  destination: consultation?.destination || "",
                  address: consultation?.address || "",
                  ielts: consultation?.ielts || "",
                  ieltsScore: consultation?.ieltsScore || "",
                  location: consultation?.location || "",
                  applicationCode: consultation?.applicationCode || "",
                  sscYear: consultation?.sscYear || "",
                  sscDepartment: consultation?.sscDepartment || "",
                  sscCGPA: consultation?.sscCGPA || "",
                  hscYear: consultation?.hscYear || "",
                  hscDepartment: consultation?.hscDepartment || "",
                  hscCGPA: consultation?.hscCGPA || "",
                  bachelorYear: consultation?.bachelorYear || "",
                  bachelorDepartment: consultation?.bachelorDepartment || "",
                  bachelorCGPA: consultation?.bachelorCGPA || "",
                });
                setIsModalOpen(true);
                setConsultationId(consultation.id);
              }}
              className="btn btn-outline btn-sm text-brandRed bg-brandLight p-2 rounded-sm"
            >
              Request Edit
            </button>
          </div>

          <div className="card-body p-8 shadow-md bg-base-100 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-md">
                <span className="text-gray-600">Full Name</span>
                <br />
                <span>{consultation?.fullName}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Email</span>
                <br />
                <span>{consultation?.email}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Next Appointment Date</span>
                <br />
                <span>{consultation?.appointmentDate}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Status</span>
                <br />
                <span>{consultation?.status}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Type</span>
                <br />
                <span>{consultation?.type}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Date of birth</span>
                <br />
                <span>{consultation?.date}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Date of birth</span>
                <br />
                <span>{consultation?.appointmentDate}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Prefd Destination</span>
                <br />
                <span>{consultation?.destination}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Address</span>
                <br />
                <span>{consultation?.address}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Phone</span>
                <br />
                <span>{consultation?.phone}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">IELTS</span>
                <br />
                <span>{consultation?.ielts}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">IELTS Score</span>
                <br />
                <span>{consultation?.ieltsScore}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">SSC Year</span>
                <br />
                <span>{consultation?.sscYear}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">SSC Department</span>
                <br />
                <span>{consultation?.sscDepartment}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">SSC CGPA</span>
                <br />
                <span>{consultation?.sscCGPA}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">HSC Year</span>
                <br />
                <span>{consultation?.hscYear}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">HSC Department</span>
                <br />
                <span>{consultation?.hscDepartment}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">HSC CGPA</span>
                <br />
                <span>{consultation?.hscCGPA}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Bachelor Year</span>
                <br />
                <span>{consultation?.bachelorYear}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Bachelor Department</span>
                <br />
                <span>{consultation?.bachelorDepartment}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Bachelor CGPA</span>
                <br />
                <span>{consultation?.bachelorCGPA}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Branch</span>
                <br />
                <span>{consultation?.bachelorCGPA}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Application Code</span>
                <br />
                <span>{consultation?.bachelorCGPA}</span>
              </div>
              <div className="text-md">
                <span className="text-gray-600">Bachelor CGPA</span>
                <br />
                <span>{consultation?.bachelorCGPA}</span>
              </div>
            </div>
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <ModalHeader>Lead Management</ModalHeader>

            <ModalBody className="w-full max-w-screen-lg max-h-[70vh] overflow-y-auto">
              <div className="max-h-[80vh] overflow-y-auto px-4 py-2">
                <form
                  onSubmit={handleSubmit(onFormEdit)}
                  className="w-full mx-auto"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {/* FULL NAME */}
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium mb-1"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        className="w-full border rounded px-3 py-2"
                        value={watch("fullName") || ""}
                        {...register("fullName", { required: true })}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm">
                          Fullname is required
                        </p>
                      )}
                    </div>

                    {/* PHONE */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium mb-1"
                      >
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className="w-full border rounded px-3 py-2"
                        placeholder="+8801XXXXXXXXX"
                        value={watch("phone") || ""}
                        {...register("phone", { required: true })}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm">
                          Phone number is required
                        </p>
                      )}
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-1"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full border rounded px-3 py-2"
                        value={watch("email") || ""}
                        {...register("email")}
                      />
                    </div>

                    {/* DATE */}
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium mb-1"
                      >
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        id="date"
                        className="w-full border rounded px-3 py-2"
                        value={watch("date") || ""}
                        {...register("date")}
                      />
                    </div>

                    {/* DESTINATION */}
                    <div>
                      <label
                        htmlFor="destination"
                        className="block text-sm font-medium mb-1"
                      >
                        Prefd Destination
                      </label>
                      <select
                        id="destination"
                        className="w-full border rounded px-3 py-2"
                        value={watch("destination") || ""}
                        {...register("destination")}
                      >
                        <option value="">Select your destination</option>
                        <option>USA</option>
                        <option>UK</option>
                        <option>Canada</option>
                        <option>Australia</option>
                        <option>Germany</option>
                        <option>Belgium</option>
                        <option>Hungary</option>
                        <option>Denmark</option>
                        <option>Austria</option>
                        <option>Finland</option>
                        <option>Sweden</option>
                        <option>Cyprus</option>
                        <option>Malaysia</option>
                        <option>China</option>
                        <option>Dubai</option>
                        <option>Italy</option>
                        <option>Croatia</option>
                        <option>Malta</option>
                        <option>Others</option>
                      </select>
                    </div>

                    {/* ADDRESS */}
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium mb-1"
                      >
                        Full Address
                      </label>
                      <input
                        id="address"
                        className="w-full border rounded px-3 py-2"
                        {...register("address")}
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label
                        htmlFor="ielts"
                        className="block text-sm font-medium mb-1"
                      >
                        Lead Status
                      </label>
                      <select
                        id="status"
                        className="w-full border rounded px-3 py-2"
                        value={watch("status") || ""}
                        {...register("status")}
                      >
                        <option value="">Select Status</option>
                        <option className="Hot Lead">Hot Lead</option>
                        <option className="Cool Lead">Cool Lead</option>
                      </select>
                      {errors.status && (
                        <p className="text-red-500 text-sm">
                          Status selection is required
                        </p>
                      )}
                    </div>

                    {/* IELTS */}
                    <div>
                      <label
                        htmlFor="ielts"
                        className="block text-sm font-medium mb-1"
                      >
                        IELTS
                      </label>
                      <select
                        id="ielts"
                        className="w-full border rounded px-3 py-2"
                        value={watch("ielts") || ""}
                        {...register("ielts")}
                      >
                        <option value="">Select</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                      {errors.ielts && (
                        <p className="text-red-500 text-sm">
                          IELTS selection is required
                        </p>
                      )}
                    </div>

                    {/* IELTS SCORE */}
                    <div>
                      <label
                        htmlFor="ieltsScore"
                        className="block text-sm font-medium mb-1"
                      >
                        IELTS Score
                      </label>
                      <input
                        type="text"
                        id="ieltsScore"
                        className="w-full border rounded px-3 py-2"
                        value={watch("ieltsScore") || ""}
                        {...register("ieltsScore")}
                      />
                      {errors.ieltsScore && (
                        <p className="text-red-500 text-sm">
                          Score is required
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="appointmentDate"
                        className="block text-sm font-medium mb-1"
                      >
                        Next Appointment Date
                      </label>
                      <input
                        type="date"
                        id="appointmentDate"
                        className="w-full border rounded px-3 py-2"
                        value={watch("appointmentDate") || ""}
                        {...register("appointmentDate")}
                      />
                    </div>

                    {/* LOCATION */}
                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium mb-1"
                      >
                        Appointment Location
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="location"
                        className="w-full border rounded px-3 py-2"
                        value={watch("location") || ""}
                        {...register("location")}
                      >
                        <option value="">Select Location</option>
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
                      {errors.location && (
                        <p className="text-red-500 text-sm">
                          Location is required
                        </p>
                      )}
                    </div>

                    {/* APPLICATION CODE */}
                    <div>
                      <label
                        htmlFor="applicationCode"
                        className="block text-sm font-medium mb-1"
                      >
                        Application Code
                      </label>
                      <input
                        id="applicationCode"
                        className="w-full border rounded px-3 py-2"
                        value={watch("applicationCode") || ""}
                        {...register("applicationCode")}
                      />
                      {errors.applicationCode && (
                        <p className="text-red-500 text-sm">Required</p>
                      )}
                    </div>

                    {/* Academic Fields */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        SSC Year
                      </label>
                      <input
                        type="number"
                        className="w-full border rounded px-3 py-2"
                        value={watch("sscYear") || ""}
                        {...register("sscYear")}
                      />
                      {errors.sscYear && (
                        <p className="text-red-500 text-sm">
                          SSC Year required
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        SSC Department
                      </label>
                      <input
                        className="w-full border rounded px-3 py-2"
                        value={watch("sscDepartment") || ""}
                        {...register("sscDepartment")}
                      />
                      {errors.sscDepartment && (
                        <p className="text-red-500 text-sm">Required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        SSC GPA
                      </label>
                      <input
                        className="w-full border rounded px-3 py-2"
                        value={watch("sscCGPA") || ""}
                        {...register("sscCGPA")}
                      />
                      {errors.sscCGPA && (
                        <p className="text-red-500 text-sm">Required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        HSC Year
                      </label>
                      <input
                        type="number"
                        className="w-full border rounded px-3 py-2"
                        value={watch("hscYear") || ""}
                        {...register("hscYear")}
                      />
                      {errors.hscYear && (
                        <p className="text-red-500 text-sm">Required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        HSC Department
                      </label>
                      <input
                        className="w-full border rounded px-3 py-2"
                        value={watch("hscDepartment") || ""}
                        {...register("hscDepartment")}
                      />
                      {errors.hscDepartment && (
                        <p className="text-red-500 text-sm">Required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        HSC GPA
                      </label>
                      <input
                        className="w-full border rounded px-3 py-2"
                        value={watch("hscCGPA") || ""}
                        {...register("hscCGPA")}
                      />
                      {errors.hscCGPA && (
                        <p className="text-red-500 text-sm">Required</p>
                      )}
                    </div>

                    {/* Bachelor (Optional) */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Bachelor Year
                      </label>
                      <input
                        type="number"
                        className="w-full border rounded px-3 py-2"
                        value={watch("bachelorYear") || ""}
                        {...register("bachelorYear")}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Bachelor Department
                      </label>
                      <input
                        className="w-full border rounded px-3 py-2"
                        value={watch("bachelorDepartment") || ""}
                        {...register("bachelorDepartment")}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Bachelor GPA
                      </label>
                      <input
                        className="w-full border rounded px-3 py-2"
                        value={watch("bachelorCGPA") || ""}
                        {...register("bachelorCGPA")}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Client;
