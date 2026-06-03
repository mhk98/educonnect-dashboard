import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody } from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import {
  useGetDataByIdQuery,
  useUpdateConsultationMutation,
} from "../../features/consultation/consultation";
import { useGetAllBranchQuery } from "../../features/branch/branch";
import toast from "react-hot-toast";
import { FaInfoCircle } from "react-icons/fa";

const inputCls =
  "w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brandBlue/20 focus:border-brandBlue focus:bg-white transition-colors";

function FormField({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}

function Client({ id }) {
  //   const id = localStorage.getItem("userId");
  const branch = localStorage.getItem("branch");
  const userId = localStorage.getItem("userId");

  const [consultationId, setConsultationId] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const { data, isLoading, isError, error } = useGetDataByIdQuery(id);

  const { data: branchData, isLoading: branchLoading } = useGetAllBranchQuery();

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
  }, [isModalOpen, consultation, setValue]);

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

  const val = (v) => v || <span className="text-gray-300">—</span>;

  const statusColors = {
    "Hot Lead": "bg-red-50 text-red-600 border border-red-200",
    "Cool Lead": "bg-sky-50 text-sky-600 border border-sky-200",
    "Case Closed": "bg-gray-100 text-gray-500 border border-gray-200",
  };
  const statusClass =
    statusColors[consultation?.status] ||
    "bg-gray-100 text-gray-500 border border-gray-200";

  return (
    <>
      <div className="p-6">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brandBlue/10 flex items-center justify-center">
              <FaInfoCircle className="w-3.5 h-3.5 text-brandBlue" />
            </div>
            <h3 className="font-semibold text-gray-800 text-base">
              Client Information
            </h3>
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brandBlue text-white text-xs font-semibold hover:bg-blue-800 transition-colors"
          >
            Request Edit
          </button>
        </div>

        {/* Section: Personal Info */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Personal Information
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            <Field label="Full Name" value={val(consultation?.fullName)} />
            <Field label="Phone" value={val(consultation?.phone)} />
            <Field label="Email" value={val(consultation?.email)} />
            <Field label="Date of Birth" value={val(consultation?.date)} />
            <Field label="Address" value={val(consultation?.address)} />
            <Field
              label="Pref. Destination"
              value={val(consultation?.destination)}
            />
          </div>
        </div>

        <div className="border-t border-gray-100 mb-6" />

        {/* Section: Lead Details */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Lead Details
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            <div>
              <p className="text-xs text-gray-400 mb-1">Status</p>
              {consultation?.status ? (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${statusClass}`}
                >
                  {consultation.status}
                </span>
              ) : (
                <span className="text-gray-300">—</span>
              )}
            </div>
            <Field label="Type" value={val(consultation?.type)} />
            <Field
              label="Next Appointment"
              value={val(consultation?.appointmentDate)}
            />
            <Field label="IELTS" value={val(consultation?.ielts)} />
            <Field label="IELTS Score" value={val(consultation?.ieltsScore)} />
            <Field
              label="Application Code"
              value={val(consultation?.applicationCode)}
            />
            <Field label="Branch" value={val(consultation?.location)} />
          </div>
        </div>

        <div className="border-t border-gray-100 mb-6" />

        {/* Section: Academic Background */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Academic Background
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5">
            <Field label="SSC Year" value={val(consultation?.sscYear)} />
            <Field
              label="SSC Department"
              value={val(consultation?.sscDepartment)}
            />
            <Field label="SSC CGPA" value={val(consultation?.sscCGPA)} />
            <Field label="HSC Year" value={val(consultation?.hscYear)} />
            <Field
              label="HSC Department"
              value={val(consultation?.hscDepartment)}
            />
            <Field label="HSC CGPA" value={val(consultation?.hscCGPA)} />
            <Field
              label="Bachelor Year"
              value={val(consultation?.bachelorYear)}
            />
            <Field
              label="Bachelor Dept."
              value={val(consultation?.bachelorDepartment)}
            />
            <Field
              label="Bachelor CGPA"
              value={val(consultation?.bachelorCGPA)}
            />
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brandBlue/10 flex items-center justify-center">
              <FaInfoCircle className="w-3 h-3 text-brandBlue" />
            </div>
            <span className="text-base font-semibold text-gray-800 p-3 transition-colors">
              Edit Lead Information
            </span>
          </div>
        </ModalHeader>

        <ModalBody style={{ padding: 0, overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "calc(85vh - 120px)",
            }}
          >
            <div style={{ overflowY: "auto", flex: 1, padding: "16px 12px" }}>
              <form
                id="lead-edit-form"
                onSubmit={handleSubmit(onFormEdit)}
                className="w-full mx-auto space-y-7"
              >
                {/* Personal Information */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                    Personal Information
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <FormField
                      label="Full Name"
                      required
                      error={errors.fullName?.message}
                    >
                      <input
                        className={inputCls}
                        {...register("fullName", { required: "Required" })}
                      />
                    </FormField>
                    <FormField
                      label="Phone Number"
                      required
                      error={errors.phone?.message}
                    >
                      <input
                        type="tel"
                        className={inputCls}
                        placeholder="+8801XXXXXXXXX"
                        {...register("phone", { required: "Required" })}
                      />
                    </FormField>
                    <FormField label="Email">
                      <input
                        type="email"
                        className={inputCls}
                        {...register("email")}
                      />
                    </FormField>
                    <FormField label="Date of Birth">
                      <input
                        type="date"
                        className={inputCls}
                        {...register("date")}
                      />
                    </FormField>
                    <FormField label="Preferred Destination">
                      <select className={inputCls} {...register("destination")}>
                        <option value="">Select destination</option>
                        {[
                          "USA",
                          "UK",
                          "Canada",
                          "Australia",
                          "Germany",
                          "Belgium",
                          "Hungary",
                          "Denmark",
                          "Austria",
                          "Finland",
                          "Sweden",
                          "Cyprus",
                          "Malaysia",
                          "China",
                          "Dubai",
                          "Italy",
                          "Croatia",
                          "Malta",
                          "Others",
                        ].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="Full Address">
                      <input className={inputCls} {...register("address")} />
                    </FormField>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Lead Details */}
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                    Lead Details
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <FormField label="Lead Status">
                      <select className={inputCls} {...register("status")}>
                        <option value="">Select Status</option>
                        <option>Hot Lead</option>
                        <option>Cool Lead</option>
                      </select>
                    </FormField>
                    <FormField label="IELTS">
                      <select className={inputCls} {...register("ielts")}>
                        <option value="">Select</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </FormField>
                    <FormField label="IELTS Score">
                      <input
                        type="text"
                        className={inputCls}
                        {...register("ieltsScore")}
                      />
                    </FormField>
                    <FormField label="Next Appointment Date">
                      <input
                        type="date"
                        className={inputCls}
                        {...register("appointmentDate")}
                      />
                    </FormField>
                    <FormField
                      label="Appointment Location"
                      required
                      error={errors.location?.message}
                    >
                      <select className={inputCls} {...register("location")}>
                        <option value="">Select Location</option>
                        {branchLoading && <option disabled>Loading...</option>}
                        {branchData?.data?.map((b) => (
                          <option
                            key={b.id || b._id || b.name}
                            value={b.branch || b.name || b.Branch}
                          >
                            {b.branch || b.name || b.Branch}
                          </option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="Application Code">
                      <input
                        className={inputCls}
                        {...register("applicationCode")}
                      />
                    </FormField>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Academic Background */}
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                    Academic Background
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <FormField label="SSC Year">
                      <input
                        type="number"
                        className={inputCls}
                        {...register("sscYear")}
                      />
                    </FormField>
                    <FormField label="SSC Department">
                      <input
                        className={inputCls}
                        {...register("sscDepartment")}
                      />
                    </FormField>
                    <FormField label="SSC GPA">
                      <input className={inputCls} {...register("sscCGPA")} />
                    </FormField>
                    <FormField label="HSC Year">
                      <input
                        type="number"
                        className={inputCls}
                        {...register("hscYear")}
                      />
                    </FormField>
                    <FormField label="HSC Department">
                      <input
                        className={inputCls}
                        {...register("hscDepartment")}
                      />
                    </FormField>
                    <FormField label="HSC GPA">
                      <input className={inputCls} {...register("hscCGPA")} />
                    </FormField>
                    <FormField label="Bachelor Year">
                      <input
                        type="number"
                        className={inputCls}
                        {...register("bachelorYear")}
                      />
                    </FormField>
                    <FormField label="Bachelor Department">
                      <input
                        className={inputCls}
                        {...register("bachelorDepartment")}
                      />
                    </FormField>
                    <FormField label="Bachelor GPA">
                      <input
                        className={inputCls}
                        {...register("bachelorCGPA")}
                      />
                    </FormField>
                  </div>
                </div>
              </form>
            </div>

            {/* Sticky Footer */}
            <div className="flex justify-end gap-3 px-4 py-4 border-t border-gray-100 bg-white flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="lead-edit-form"
                className="px-8 py-3 rounded-xl bg-brandBlue text-white text-sm font-semibold hover:bg-blue-800 active:scale-95 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Client;
