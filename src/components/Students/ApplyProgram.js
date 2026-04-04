import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Select } from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import { useCreateApplicationMutation } from "../../features/application/application";
import toast from "react-hot-toast";
import { useGetAllprogramYearQuery } from "../../features/programYears/programYears";
import { useGetAllProgramCountryQuery } from "../../features/programCountry/programCountry";
import { useGetAllprogramIntakeQuery } from "../../features/programIntake/programIntake";
import { useGetAllprogramUniversityQuery } from "../../features/programUniversity/programUniversity";
import { useGetAllprogramNameQuery } from "../../features/programName/programName";

const ApplyProgram = ({ id }) => {
  const userId = localStorage.getItem("userId");

  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedUniversityId, setSelectedUniversityId] = useState("");

  console.log("selectedCountryId", selectedCountryId);
  console.log("selectedUniversityId", selectedUniversityId);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      year: "",
      intake: "",
      university: "",
      program: "",
      priority: "",
      country: "",
    },
  });

  const [createApplication] = useCreateApplicationMutation();

  const onFormSubmit = async (info) => {
    const data = {
      year: info.year,
      intake: info.intake,
      university: info.university,
      program: info.program,
      priority: info.priority,
      country: info.country,
      user_id: id,
      userId: userId,
    };

    try {
      const res = await createApplication(data);
      if (res.data.success === true) {
        toast.success(res.data.message);
        reset({
          year: "",
          intake: "",
          university: "",
          program: "",
          priority: "",
          country: "",
        });
      } else {
        toast.error(res?.error?.data?.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Program Year
  const {
    data: yearData,
    isError,
    error,
    isLoading,
  } = useGetAllprogramYearQuery();
  const [years, setYears] = useState([]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Failed to load year data");
    } else if (!isLoading && yearData) {
      setYears(yearData.data);
    }
  }, [yearData, isLoading, isError, error]);

  // Program Country
  const {
    data: countryData,
    isError: isErrorCountry,
    error: errorCountry,
    isLoading: isLoadingCountry,
  } = useGetAllProgramCountryQuery();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (isErrorCountry) {
      toast.error(errorCountry?.data?.message || "Failed to load countries");
    } else if (!isLoadingCountry && countryData) {
      setCountries(countryData.data);
    }
  }, [countryData, isLoadingCountry, isErrorCountry, errorCountry]);

  // Program Intake
  const {
    data: intakeData,
    isError: isErrorIntake,
    error: errorIntake,
    isLoading: isLoadingIntake,
  } = useGetAllprogramIntakeQuery();
  const [intakes, setIntakes] = useState([]);

  useEffect(() => {
    if (isErrorIntake) {
      toast.error(errorIntake?.data?.message || "Failed to load intakes");
    } else if (!isLoadingIntake && intakeData) {
      setIntakes(intakeData.data);
    }
  }, [intakeData, isLoadingIntake, isErrorIntake, errorIntake]);

  // Program University
  const {
    data: universityData,
    isError: isErrorUniversity,
    error: errorUniversity,
    isLoading: isLoadingUniversity,
  } = useGetAllprogramUniversityQuery({ country_id: selectedCountryId });
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    if (isErrorUniversity) {
      toast.error(
        errorUniversity?.data?.message || "Failed to load universities"
      );
    } else if (!isLoadingUniversity && universityData) {
      setUniversities(universityData.data);
    }
  }, [universityData, isLoadingUniversity, isErrorUniversity, errorUniversity]);

  console.log("universities", universities);

  // Program Name
  const {
    data: programData,
    isError: isErrorProgram,
    error: errorProgram,
    isLoading: isLoadingProgram,
  } = useGetAllprogramNameQuery({
    country_id: selectedCountryId,
    university_id: selectedUniversityId,
  });
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    if (isErrorProgram) {
      toast.error(errorProgram?.data?.message || "Failed to load programs");
    } else if (!isLoadingProgram && programData) {
      setPrograms(programData.data);
    }
  }, [programData, isLoadingProgram, isErrorProgram, errorProgram]);

  return (
    <div className="bg-gray-50 p-4 rounded shadow-sm w-full">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-brandRed">
          Quick Add Program
        </h2>
      </div>

      <div className="bg-white p-4 rounded border border-gray-200 mb-4 text-sm text-gray-600">
        We only show eligible programs for this student for the selected intake,
        year and university. To understand why certain programs are not eligible
        for this student, please go to Search Program.
      </div>

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center"
      >
        {/* Country */}
        <div className="mt-4">
          <Select
            name="country"
            {...register("country", {
              onChange: (e) => {
                const value = e.target.value;
                setSelectedCountryId(value); // update your local state
              },
            })}
            className="mt-1"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.country}
              </option>
            ))}
          </Select>
          {errors.country && (
            <p className="text-red-500 text-xs mt-1">
              {errors.country.message}
            </p>
          )}
        </div>
        {/* University */}
        <div className="mt-4">
          {/* <Select name="university" {...register('university')} className="mt-1">
            <option value="">Select University</option>
            {universities.map((university) => (
              <option key={university.id} value={university.university}>
                {university.university}
              </option>
            ))}
          </Select> */}

          <Select
            name="university"
            {...register("university", {
              onChange: (e) => {
                const value = e.target.value;
                setSelectedUniversityId(value); // update your local state
              },
            })}
            className="mt-1"
          >
            <option value="">Select University</option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.university}
              </option>
            ))}
          </Select>
          {errors.university && (
            <p className="text-red-500 text-xs mt-1">
              {errors.university.message}
            </p>
          )}
        </div>

        {/* Program */}
        <div className="mt-4">
          <Select name="program" {...register("program")} className="mt-1">
            <option value="">Select Program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.program}>
                {program.program}
              </option>
            ))}
          </Select>
          {errors.program && (
            <p className="text-red-500 text-xs mt-1">
              {errors.program.message}
            </p>
          )}
        </div>

        {/* Intake */}
        <div className="mt-4">
          <Select name="intake" {...register("intake")} className="mt-1">
            <option value="">Select Intake</option>
            {intakes.map((intake) => (
              <option key={intake.id} value={intake.intake}>
                {intake.intake}
              </option>
            ))}
          </Select>
          {errors.intake && (
            <p className="text-red-500 text-xs mt-1">{errors.intake.message}</p>
          )}
        </div>

        {/* Year */}
        <div className="mt-4">
          <Select name="year" {...register("year")} className="mt-1">
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year.id} value={year.year}>
                {year.year}
              </option>
            ))}
          </Select>
          {errors.year && (
            <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>
          )}
        </div>

        {/* Priority */}
        <div className="mt-4">
          <Select name="priority" {...register("priority")} className="mt-1">
            <option value="">Select Priority</option>
            <option>1st Priority</option>
            <option>2nd Priority</option>
            <option>3rd Priority</option>
          </Select>
          {errors.priority && (
            <p className="text-red-500 text-xs mt-1">
              {errors.priority.message}
            </p>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="bg-brandRed mt-4 hover:bg-brandRed text-white px-4 py-2 rounded flex items-center justify-center gap-2 text-sm"
        >
          <FaPlus /> Add
        </button>
      </form>
    </div>
  );
};

export default ApplyProgram;
