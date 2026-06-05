import React, { useEffect, useState } from "react";
import { Input } from "@windmill/react-ui";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  Globe,
  Building2,
  BookOpen,
  Calendar,
  Plus,
  Loader2,
  GraduationCap,
} from "lucide-react";

import {
  useCreateProgramCountryMutation,
  useGetAllProgramCountryQuery,
} from "../features/programCountry/programCountry";

import { useCreateprogramUniversityMutation } from "../features/programUniversity/programUniversity";
import { useCreateprogramNameMutation } from "../features/programName/programName";
import { useCreateprogramIntakeMutation } from "../features/programIntake/programIntake";
import { useCreateprogramYearMutation } from "../features/programYears/programYears";
import axios from "axios";

const TABS = [
  {
    id: "country",
    label: "Country",
    icon: Globe,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "university",
    label: "University",
    icon: Building2,
    color: "bg-purple-50 text-purple-600",
  },
  {
    id: "program",
    label: "Program",
    icon: BookOpen,
    color: "bg-orange-50 text-orange-600",
  },
  {
    id: "intake-year",
    label: "Intake & Year",
    icon: Calendar,
    color: "bg-pink-50 text-pink-600",
  },
];

function SectionHeader({ icon: Icon, label, colorClass, description }) {
  return (
    <div className="flex items-start gap-3 mb-6 pb-5 border-b border-gray-100">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 text-base">{label}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function SubmitButton({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full sm:w-auto bg-brandBlue text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-blue-800 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      {loading ? "Saving..." : label}
    </button>
  );
}

function FieldError({ error }) {
  if (!error) return null;
  return <p className="text-red-500 text-xs mt-1">{error.message}</p>;
}

function Programs() {
  const [activeTab, setActiveTab] = useState("country");
  const [countries, setCountries] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = (key, val) =>
    setLoadingStates((prev) => ({ ...prev, [key]: val }));

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };

  const {
    data: countryData,
    isError: countryErr,
    error: errCountry,
  } = useGetAllProgramCountryQuery();

  useEffect(() => {
    if (countryData?.data) setCountries(countryData.data);
    if (countryErr) console.log(errCountry?.data?.message);
  }, [countryData, countryErr, errCountry]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/programUniversity/",
          { params: { country_id: selectedCountryId } },
        );
        if (res.data?.success) setUniversities(res.data.data);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
      }
    };
    fetchUniversities();
  }, [selectedCountryId]);

  const [createProgramCountry] = useCreateProgramCountryMutation();
  const [createprogramUniversity] = useCreateprogramUniversityMutation();
  const [createprogramName] = useCreateprogramNameMutation();
  const [createprogramIntake] = useCreateprogramIntakeMutation();
  const [createprogramYear] = useCreateprogramYearMutation();

  const {
    register: regCountry,
    handleSubmit: submitCountry,
    reset: resetCountry,
    formState: { errors: errCountryForm },
  } = useForm();
  const onSubmitCountry = async (data) => {
    setLoading("country", true);
    const res = await createProgramCountry(data);
    setLoading("country", false);
    if (res.data?.success) {
      toast.success(res.data.message);
      resetCountry();
    } else toast.error(res.error?.data?.message || "Failed to add country");
  };

  const {
    register: regUniversity,
    handleSubmit: submitUniversity,
    reset: resetUniversity,
    formState: { errors: errUniversityForm },
  } = useForm();
  const onSubmitUniversity = async (info) => {
    setLoading("university", true);
    const res = await createprogramUniversity({
      university: info.university,
      country_id: info.country,
    });
    setLoading("university", false);
    if (res.data?.success) {
      toast.success(res.data.message);
      resetUniversity();
    } else toast.error(res.error?.data?.message || "Failed to add university");
  };

  const {
    register: regProgram,
    handleSubmit: submitProgram,
    reset: resetProgram,
    formState: { errors: errProgramForm },
  } = useForm();
  const onSubmitProgram = async (info) => {
    setLoading("program", true);
    const res = await createprogramName({
      program: info.program,
      country_id: info.country,
      university_id: info.university,
    });
    setLoading("program", false);
    if (res.data?.success) {
      toast.success(res.data.message);
      resetProgram();
    } else toast.error(res.error?.data?.message || "Failed to add program");
  };

  const {
    register: regIntake,
    handleSubmit: submitIntake,
    reset: resetIntake,
    formState: { errors: errIntakeForm },
  } = useForm();
  const onSubmitIntake = async (data) => {
    setLoading("intake", true);
    const res = await createprogramIntake(data);
    setLoading("intake", false);
    if (res.data?.success) {
      toast.success(res.data.message);
      resetIntake();
    } else toast.error(res.error?.data?.message || "Failed to add intake");
  };

  const {
    register: regYear,
    handleSubmit: submitYear,
    reset: resetYear,
    formState: { errors: errYearForm },
  } = useForm();
  const onSubmitYear = async (data) => {
    setLoading("year", true);
    const res = await createprogramYear(data);
    setLoading("year", false);
    if (res.data?.success) {
      toast.success(res.data.message);
      resetYear();
    } else toast.error(res.error?.data?.message || "Failed to add year");
  };

  const inputClass =
    "w-full rounded-xl border-gray-200 bg-gray-50 text-sm focus:bg-white transition-colors";
  const selectClass =
    "w-full px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brandBlue/20 focus:border-brandBlue focus:bg-white transition-colors";

  return (
    <div className="w-full px-4 sm:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-brandBlue flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brandBlue">
              Program Settings
            </p>
            <h4 className="text-2xl font-bold text-gray-900 leading-tight">
              Add Programs
            </h4>
          </div>
        </div>
        <p className="hidden md:block text-sm text-gray-400">
          Manage countries, universities, programs, intakes & years
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tab Navigation — underline style */}
        <div className="flex border-b border-gray-100">
          {TABS.map(({ id, label, icon: Icon, color }) => (
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
                  activeTab === id ? color : "text-gray-400"
                }`}
              >
                <Icon className="w-4 h-4" />
              </span>
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Tab: Country */}
          {activeTab === "country" && (
            <form onSubmit={submitCountry(onSubmitCountry)}>
              <SectionHeader
                icon={Globe}
                label="Add Country"
                colorClass="bg-emerald-50 text-emerald-600"
                description="Add a new destination country for programs"
              />
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end max-w-2xl">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Country Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    {...regCountry("country", {
                      required: "Country is required",
                    })}
                    onKeyDown={handleEnter}
                    className={inputClass}
                    placeholder="e.g. Canada, Australia, UK"
                  />
                  <FieldError error={errCountryForm.country} />
                </div>
                <SubmitButton
                  loading={loadingStates.country}
                  label="Add Country"
                />
              </div>
            </form>
          )}

          {/* Tab: University */}
          {activeTab === "university" && (
            <form onSubmit={submitUniversity(onSubmitUniversity)}>
              <SectionHeader
                icon={Building2}
                label="Add University"
                colorClass="bg-purple-50 text-purple-600"
                description="Link a university to an existing country"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    {...regUniversity("university", {
                      required: "University is required",
                    })}
                    onKeyDown={handleEnter}
                    className={inputClass}
                    placeholder="e.g. University of Toronto"
                  />
                  <FieldError error={errUniversityForm.university} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-400">*</span>
                  </label>
                  <select
                    {...regUniversity("country", {
                      required: "Country is required",
                    })}
                    onKeyDown={handleEnter}
                    className={selectClass}
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.country}
                      </option>
                    ))}
                  </select>
                  <FieldError error={errUniversityForm.country} />
                </div>
              </div>
              <SubmitButton
                loading={loadingStates.university}
                label="Add University"
              />
            </form>
          )}

          {/* Tab: Program */}
          {activeTab === "program" && (
            <form onSubmit={submitProgram(onSubmitProgram)}>
              <SectionHeader
                icon={BookOpen}
                label="Add Program"
                colorClass="bg-orange-50 text-orange-600"
                description="Add a program under a specific university and country"
              />
              <div className="flex flex-col gap-5 mb-6 max-w-3xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    {...regProgram("program", {
                      required: "Program name is required",
                    })}
                    onKeyDown={handleEnter}
                    className={inputClass}
                    placeholder="e.g. Master of Business Administration"
                  />
                  <FieldError error={errProgramForm.program} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      className={selectClass}
                      onKeyDown={handleEnter}
                      {...regProgram("country", {
                        onChange: (e) => setSelectedCountryId(e.target.value),
                      })}
                    >
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.country}
                        </option>
                      ))}
                    </select>
                    <FieldError error={errProgramForm.country} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      University <span className="text-red-400">*</span>
                    </label>
                    <select
                      {...regProgram("university", {
                        required: "University is required",
                      })}
                      className={selectClass}
                      onKeyDown={handleEnter}
                    >
                      <option value="">
                        {selectedCountryId
                          ? "Select University"
                          : "Select a country first"}
                      </option>
                      {universities.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.university}
                        </option>
                      ))}
                    </select>
                    <FieldError error={errProgramForm.university} />
                  </div>
                </div>
              </div>
              <SubmitButton
                loading={loadingStates.program}
                label="Add Program"
              />
            </form>
          )}

          {/* Tab: Intake & Year */}
          {activeTab === "intake-year" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <form
                onSubmit={submitIntake(onSubmitIntake)}
                className="border border-gray-100 rounded-2xl p-6"
              >
                <SectionHeader
                  icon={Calendar}
                  label="Add Intake"
                  colorClass="bg-pink-50 text-pink-600"
                  description="Add a semester or intake period"
                />
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intake Period <span className="text-red-400">*</span>
                  </label>
                  <Input
                    {...regIntake("intake", { required: "Intake is required" })}
                    placeholder="e.g. September 2025"
                    className={inputClass}
                  />
                  <FieldError error={errIntakeForm.intake} />
                </div>
                <SubmitButton
                  loading={loadingStates.intake}
                  label="Add Intake"
                />
              </form>

              <form
                onSubmit={submitYear(onSubmitYear)}
                className="border border-gray-100 rounded-2xl p-6"
              >
                <SectionHeader
                  icon={Calendar}
                  label="Add Year"
                  colorClass="bg-sky-50 text-sky-600"
                  description="Add an academic year"
                />
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year <span className="text-red-400">*</span>
                  </label>
                  <Input
                    {...regYear("year", { required: "Year is required" })}
                    placeholder="e.g. 2025"
                    className={inputClass}
                  />
                  <FieldError error={errYearForm.year} />
                </div>
                <SubmitButton loading={loadingStates.year} label="Add Year" />
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Programs;
