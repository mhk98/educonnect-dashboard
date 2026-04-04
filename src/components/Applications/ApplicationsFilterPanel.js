import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { Input, Label } from '@windmill/react-ui';
import axios from 'axios';

const ApplicationsFilterPanel = () => {
  const { control, handleSubmit, setValue } = useForm();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const intakeOptions = [
    { value: 'january', label: 'January' },
    { value: 'may', label: 'May' },
    { value: 'september', label: 'September' },
  ];

  const yearOptions = [
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
  ];

  const countryOptions = [
    { value: 'usa', label: 'USA' },
    { value: 'canada', label: 'Canada' },
    { value: 'australia', label: 'Australia' },
  ];

  const universityOptions = [
    { value: 'harvard', label: 'Harvard' },
    { value: 'toronto', label: 'University of Toronto' },
    { value: 'sydney', label: 'University of Sydney' },
  ];

  const statusOptions = [
    { value: 'app_incomplete', label: 'App. Incomplete' },
    { value: 'app_submitted', label: 'App. Submitted' },
    { value: 'offer_received', label: 'Offer Received' },
  ];

  // Handle form submission
  const onSubmit = async (data) => {
    const formData = {
      startDate,
      endDate,
      countries: data.countries.map(option => option.value), // Send countries as an array of values
      universities: data.universities.map(option => option.value), // Send universities as an array of values
      intakes: data.intakes.map(option => option.value), // Send intakes as an array of values
      years: data.years.map(option => option.value), // Send years as an array of values
      statuses: data.statuses.map(option => option.value), // Send statuses as an array of values
      ackNo: data.ackNo,
      programName: data.programName,
      studentName: data.studentName
    };

    console.log("formData", data.countries)
    try {
      const response = await axios.post('/your-api-endpoint', formData);
      console.log('Data submitted successfully', response);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
        
        {/* Date From */}
        <Label>
          <span>From</span>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1"
          />
        </Label>

        {/* Date To */}
        <Label>
          <span>To</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1"
          />
        </Label>

        {/* Country */}
        <Label>
          <span>Country</span>
          <Controller
            control={control}
            name="countries"
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={countryOptions}
                onChange={(selected) => setValue('countries', selected)}
                className="text-sm"
                placeholder="Select Country"
              />
            )}
          />
        </Label>

        {/* University */}
        <Label>
          <span>University</span>
          <Controller
            control={control}
            name="universities"
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={universityOptions}
                onChange={(selected) => setValue('universities', selected)}
                className="text-sm"
                placeholder="Select University"
              />
            )}
          />
        </Label>

        {/* Intake */}
        <Label>
          <span>Intake</span>
          <Controller
            control={control}
            name="intakes"
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={intakeOptions}
                onChange={(selected) => setValue('intakes', selected)}
                className="text-sm"
                placeholder="Select Intake"
              />
            )}
          />
        </Label>

        {/* Year */}
        <Label>
          <span>Year</span>
          <Controller
            control={control}
            name="years"
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={yearOptions}
                onChange={(selected) => setValue('years', selected)}
                className="text-sm"
                placeholder="Select Year"
              />
            )}
          />
        </Label>

        {/* Status */}
        <Label>
          <span>Status</span>
          <Controller
            control={control}
            name="statuses"
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={statusOptions}
                onChange={(selected) => setValue('statuses', selected)}
                className="text-sm"
                placeholder="Select Status"
              />
            )}
          />
        </Label>

        {/* Ack No. */}
        <Label>
          <span>Acknowledgement No.</span>
          <Input
            className="mt-1"
            type="text"
            placeholder="Ack No."
            {...control.register('ackNo')}
          />
        </Label>

        {/* Program Name */}
        <Label>
          <span>Program Name</span>
          <Input
            className="mt-1"
            type="text"
            placeholder="Program Name"
            {...control.register('programName')}
          />
        </Label>

        {/* Student Name */}
        <Label>
          <span>Student Name</span>
          <Input
            className="mt-1"
            type="text"
            placeholder="Student Name"
            {...control.register('studentName')}
          />
        </Label>

        {/* Search Button */}
        <div className="col-span-1 md:col-span-2 lg:col-span-5 text-left">
          <button
            type="submit"
            className="w-full md:w-auto border border-brandRed text-brandRed font-medium rounded-md px-4 py-2 hover:bg-brandRed-50 transition"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationsFilterPanel;
