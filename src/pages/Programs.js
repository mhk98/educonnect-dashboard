import React, { useEffect, useState } from "react";
import { Input } from "@windmill/react-ui";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import {
  useCreateProgramCountryMutation,
  useGetAllProgramCountryQuery,
} from "../features/programCountry/programCountry";

import {
  useCreateprogramUniversityMutation,
} from "../features/programUniversity/programUniversity";

import { useCreateprogramNameMutation } from "../features/programName/programName";
import { useCreateprogramIntakeMutation } from "../features/programIntake/programIntake";
import { useCreateprogramYearMutation } from "../features/programYears/programYears";
import axios from "axios";

function Programs() {
  const [countries, setCountries] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");

  console.log("selectedCountryId", selectedCountryId);

  console.log("countries", countries);
  console.log("universities", universities);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };

  // === FETCH DATA ===
  const {
    data: countryData,
    isError: countryErr,
    error: errCountry,
  } = useGetAllProgramCountryQuery();
  useEffect(() => {
    if (countryData?.data) setCountries(countryData.data);
    if (countryErr) console.log(errCountry?.data?.message);
  }, [countryData, countryErr, errCountry]);

  //   const { data: universityData, isError: universityErr, error: errUniversity } = useGetAllprogramUniversityQuery()

  // useEffect(() => {
  //     if (universityData?.data) setUniversities(universityData.data)
  //     if (universityErr) console.log(errUniversity?.data?.message)
  //   }, [universityData, universityErr, errUniversity])

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await axios.get(
          "https://backend.eaconsultancy.org/api/v1/programUniversity/",
          {
            params: {
              country_id: selectedCountryId,
            },
          },
        );

        if (res.data?.success) {
          setUniversities(res.data.data);
        } else {
          console.error("Failed to fetch universities:", res.data?.message);
        }
      } catch (err) {
        console.error(
          "Axios error:",
          err.response?.data?.message || err.message,
        );
      }
    };

    fetchUniversities();
  }, [selectedCountryId]);

  // === MUTATIONS ===
  const [createProgramCountry] = useCreateProgramCountryMutation();
  const [createprogramUniversity] = useCreateprogramUniversityMutation();
  const [createprogramName] = useCreateprogramNameMutation();
  const [createprogramIntake] = useCreateprogramIntakeMutation();
  const [createprogramYear] = useCreateprogramYearMutation();

  // === FORM 1: Country ===
  const {
    register: regCountry,
    handleSubmit: submitCountry,
    reset: resetCountry,
    formState: { errors: errCountryForm },
  } = useForm();

  const onSubmitCountry = async (data) => {
    const res = await createProgramCountry(data);
    if (res.data?.success) {
      toast.success(res.data.message);
      resetCountry();
    } else toast.error(res.error?.data?.message || "Failed to add country");
  };

  // === FORM 2: University ===
  const {
    register: regUniversity,
    handleSubmit: submitUniversity,
    reset: resetUniversity,
    formState: { errors: errUniversityForm },
  } = useForm();

  const onSubmitUniversity = async (info) => {
    const data = {
      university: info.university,
      country_id: info.country,
    };
    const res = await createprogramUniversity(data);
    if (res.data?.success) {
      toast.success(res.data.message);
      resetUniversity();
    } else toast.error(res.error?.data?.message || "Failed to add university");
  };

  // === FORM 3: Program Name ===
  const {
    register: regProgram,
    handleSubmit: submitProgram,
    reset: resetProgram,
    formState: { errors: errProgramForm },
  } = useForm();

  const onSubmitProgram = async (info) => {
    const data = {
      program: info.program,
      country_id: info.country,
      university_id: info.university,
    };
    const res = await createprogramName(data);
    if (res.data?.success) {
      toast.success(res.data.message);
      resetProgram();
    } else toast.error(res.error?.data?.message || "Failed to add program");
  };

  // === FORM 4: Intake ===
  const {
    register: regIntake,
    handleSubmit: submitIntake,
    reset: resetIntake,
    formState: { errors: errIntakeForm },
  } = useForm();

  const onSubmitIntake = async (data) => {
    const res = await createprogramIntake(data);
    if (res.data?.success) {
      toast.success(res.data.message);
      resetIntake();
    } else toast.error(res.error?.data?.message || "Failed to add intake");
  };

  // === FORM 5: Year ===
  const {
    register: regYear,
    handleSubmit: submitYear,
    reset: resetYear,
    formState: { errors: errYearForm },
  } = useForm();

  const onSubmitYear = async (data) => {
    const res = await createprogramYear(data);
    if (res.data?.success) {
      toast.success(res.data.message);
      resetYear();
    } else toast.error(res.error?.data?.message || "Failed to add year");
  };

  return (
    <div className="w-full px-3 sm:px-4 py-4 sm:py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8 rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-brandRed">
            Program Settings
          </p>
          <h4 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900">
            Add Programs
          </h4>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Manage countries, universities, program names, intakes, and years.
          </p>
        </div>

        {/* === FORM 1: Country === */}
        <form
          onSubmit={submitCountry(onSubmitCountry)}
          className="mb-5 sm:mb-6 rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-gray-100"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Country
              </label>
            <Input
              {...regCountry("country", { required: "Country is required" })}
              onKeyDown={handleEnter}
              className="w-full rounded-xl border-gray-200 bg-gray-50 text-sm"
              placeholder="Enter country name"
            />
            {errCountryForm.country && (
              <p className="text-red-500 text-sm">
                {errCountryForm.country.message}
              </p>
            )}
            </div>
            <button className="w-full md:w-auto bg-brandRed text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-sm">
              Add Country
            </button>
          </div>
        </form>

        {/* === FORM 2: University === */}
        <form
          onSubmit={submitUniversity(onSubmitUniversity)}
          className="mb-5 sm:mb-6 rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-gray-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University
              </label>
              <Input
                {...regUniversity("university", {
                  required: "University is required",
                })}
                onKeyDown={handleEnter}
                className="w-full rounded-xl border-gray-200 bg-gray-50 text-sm"
                placeholder="Enter university name"
              />
              {errUniversityForm.university && (
                <p className="text-red-500 text-sm">
                  {errUniversityForm.university.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                {...regUniversity("country", {
                  required: "Country is required",
                })}
                onKeyDown={handleEnter}
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm"
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.country}
                  </option>
                ))}
              </select>
              {errUniversityForm.country && (
                <p className="text-red-500 text-sm">
                  {errUniversityForm.country.message}
                </p>
              )}
            </div>
          </div>
          <button className="mt-4 w-full sm:w-auto bg-brandRed text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-sm">
            Add University
          </button>
        </form>

        {/* === FORM 3: Program Name === */}
        <form
          onSubmit={submitProgram(onSubmitProgram)}
          className="mb-5 sm:mb-6 rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-gray-100"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program
              </label>
              <Input
                {...regProgram("program", {
                  required: "Program name is required",
                })}
                onKeyDown={handleEnter}
                className="w-full rounded-xl border-gray-200 bg-gray-50 text-sm"
                placeholder="Enter program name"
              />
              {errProgramForm.program && (
                <p className="text-red-500 text-sm">
                  {errProgramForm.program.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
            {/* <select {...regProgram('country', { required: 'Country is required' })} className="w-full p-2 border rounded" onKeyDown={handleEnter}>
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.country}</option>
              ))}
            </select> */}
            <select
              className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm"
              onKeyDown={handleEnter}
              name="country"
              {...regProgram("country", {
                onChange: (e) => {
                  const value = e.target.value;
                  setSelectedCountryId(value); // update your local state
                },
              })}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.country}
                </option>
              ))}
            </select>
            {errProgramForm.country && (
              <p className="text-red-500 text-sm">
                {errProgramForm.country.message}
              </p>
            )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University
              </label>
              <select
                {...regProgram("university", {
                  required: "University is required",
                })}
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm"
                onKeyDown={handleEnter}
              >
                <option value="">Select University</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.university}
                  </option>
                ))}
              </select>
              {errProgramForm.university && (
                <p className="text-red-500 text-sm">
                  {errProgramForm.university.message}
                </p>
              )}
            </div>
          </div>

          <button className="mt-4 w-full sm:w-auto bg-brandRed text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-sm">
            Add Program
          </button>
        </form>

        {/* === FORM 4: Intake === */}
        <form
          onSubmit={submitIntake(onSubmitIntake)}
          className="mb-5 sm:mb-6 rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-gray-100"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intake
              </label>
              <Input
                {...regIntake("intake", { required: "Intake is required" })}
                placeholder="Enter intake"
                className="w-full rounded-xl border-gray-200 bg-gray-50 text-sm"
              />
              {errIntakeForm.intake && (
                <p className="text-red-500 text-sm">
                  {errIntakeForm.intake.message}
                </p>
              )}
            </div>
            <button className="w-full md:w-auto bg-brandRed text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-sm">
              Add Intake
            </button>
          </div>
        </form>

        {/* === FORM 5: Year === */}
        <form
          onSubmit={submitYear(onSubmitYear)}
          className="mb-6 rounded-2xl bg-white p-4 sm:p-6 shadow-sm border border-gray-100"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <Input
                {...regYear("year", { required: "Year is required" })}
                placeholder="Enter year"
                className="w-full rounded-xl border-gray-200 bg-gray-50 text-sm"
              />
              {errYearForm.year && (
                <p className="text-red-500 text-sm">
                  {errYearForm.year.message}
                </p>
              )}
            </div>
            <button className="w-full md:w-auto bg-brandRed text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-sm">
              Add Year
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Programs;
