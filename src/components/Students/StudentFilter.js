import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

const StudentFilter = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [intake, setIntake] = useState([]);
  const [year, setYear] = useState([]);
  const [country, setCountry] = useState([]);

  const intakes = ["January", "February", "March" ];

  const years = [
    2025, 2024, 2023, 2022, 2021
  ];

  const countries = [ 'USA', 'Canada', 'Australia', ];

  const status = [ 'Received Application at EduAnchor', 'Application in Progress', 'Application Hold On - EduAnchor', ];

  const {
      register,
      formState: { errors },
      handleSubmit,
      reset,
    } = useForm()
    const onEditSubmit = (data) => {
      console.log(data)
    }


  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
        
        {/* From Date */}
        <div className="flex flex-col">
          <label className="text-sm text-black mb-1">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded p-1 text-black bg-white"
          />
        </div>

        {/* To Date */}
        <div className="flex flex-col">
          <label className="text-sm text-black mb-1">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded p-1 text-black bg-white"
          />
        </div>

        {/* Intake */}
        {/* <div className="flex flex-col">
          <label className="text-sm text-black mb-1">Intake</label>
          <Select
            options={intakeOptions}
            onChange={setIntake}
            className="text-sm"
            placeholder="Select Intake"
          />
        </div> */}

<div>
  <label className="block text-sm mb-1 text-gray-700">Intake</label>
  <select
    name="intake"
    {...register('intake')}
    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full text-sm"
  >
    {intakes.map((intake, index) => (
      <option key={index} value={intake}>
        {intake}
      </option>
    ))}
  </select>
  {errors.intake && (
    <p style={{ color: "red", marginTop: "5px" }}>
      {errors.intake.message}
    </p>
  )}
</div>

        {/* Year */}
        <div>
  <label className="block text-sm mb-1 text-gray-700">Year</label>
  <select
    name="year"
    {...register('year')}
    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full text-sm"
  >
    {years.map((year, index) => (
      <option key={index} value={year}>
        {year}
      </option>
    ))}
  </select>
  {errors.year && (
    <p style={{ color: "red", marginTop: "5px" }}>
      {errors.year.message}
    </p>
  )}
</div>

        {/* Country */}
        <div>
  <label className="block text-sm mb-1 text-gray-700">Country</label>
  <select
    name="country"
    {...register('country')}
    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full text-sm"
  >
    {countries.map((country, index) => (
      <option key={index} value={country}>
        {country}
      </option>
    ))}
  </select>
  {errors.country && (
    <p style={{ color: "red", marginTop: "5px" }}>
      {errors.country.message}
    </p>
  )}
</div>

        {/* Status */}
        <div className="mb-4">
  <label className="block text-sm mb-1 text-gray-700">Status</label>
  <select
    name="status"
    {...register('status')}
    className="mt-1 border border-gray-300 rounded px-3 py-2 w-full text-sm"
  >
    {status.map((item, index) => (
      <option key={index} value={item}>
        {item}
      </option>
    ))}
  </select>
  {errors.status && (
    <p style={{ color: "red", marginTop: "5px" }}>
      {errors.status.message}
    </p>
  )}
</div>

        {/* Apply Button */}
        <div className="lg:col-span-5 text-left">
          <button className="w-full md:w-auto border border-brandRed text-brandRed font-medium rounded-md px-4 py-2 hover:bg-brandRed-50 transition">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentFilter;
