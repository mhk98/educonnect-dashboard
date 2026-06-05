import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import logo from "../assets/img/logo.png";

const DESTINATIONS = [
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
];

const inputCls =
  "w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-colors";

function FormField({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

export default function StudentRegister() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/consultation/create",
        {
          ...data,
          type: "Website Leads",
          status: "Open Case",
          url: "register",
        },
      );
      if (res.data?.success) {
        setSubmitted(true);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "#f0f4ff" }}
      >
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Registration Successful!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Thank you for registering. Our team will review your information and
            contact you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "#f0f4ff" }}
    >
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1B2E6B 0%, #2563eb 100%)",
          }}
          className="px-8 py-8 text-white"
        >
          <div className="flex items-center gap-3 mb-5">
            <img
              src={logo}
              alt="EduConnect"
              className="h-10 object-contain brightness-0 invert"
            />
          </div>
          <h1 className="text-2xl font-bold">Student Registration</h1>
          <p
            className="mt-1.5 text-sm"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Fill in your details to get started with your study abroad journey.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              label="Full Name"
              required
              error={errors.fullName?.message}
            >
              <input
                className={inputCls}
                placeholder="Your full name"
                {...register("fullName", { required: "Full name is required" })}
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
                {...register("phone", { required: "Phone number is required" })}
              />
            </FormField>

            <FormField label="Email" error={errors.email?.message}>
              <input
                type="email"
                className={inputCls}
                placeholder="your@email.com"
                {...register("email")}
              />
            </FormField>

            <FormField
              label="Preferred Destination"
              required
              error={errors.destination?.message}
            >
              <select
                className={inputCls}
                {...register("destination", {
                  required: "Please select a destination",
                })}
              >
                <option value="">Select destination</option>
                {DESTINATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Address" error={undefined}>
              <input
                className={`${inputCls} sm:col-span-2`}
                placeholder="Your current address"
                {...register("address")}
              />
            </FormField>

            <div />

            <FormField label="Do you have IELTS?">
              <select className={inputCls} {...register("ielts")}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </FormField>

            <FormField label="IELTS Score">
              <input
                className={inputCls}
                placeholder="e.g. 6.5"
                {...register("ieltsScore")}
              />
            </FormField>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold text-sm text-white transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #1B2E6B 0%, #2563eb 100%)",
              }}
            >
              {loading ? "Submitting..." : "Submit Registration"}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 pt-1">
            Your information is safe with us. We will never share it with third
            parties.
          </p>
        </form>
      </div>
    </div>
  );
}
