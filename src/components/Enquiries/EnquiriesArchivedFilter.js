import React, { useState } from 'react';
import Select from 'react-select';
import { Input, Label } from '@windmill/react-ui';

const EnquiriesArchivedFilter = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [selectedIntakes, setSelectedIntakes] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedUniversities, setSelectedUniversities] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

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

  const statusOptions = [
    { value: 'Sent To Partner', label: 'Sent To Partner' },
    { value: 'Invoice Uploaded', label: 'Invoice Uploaded' },
    { value: 'Revisions In Invoice Needed', label: 'Revisions In Invoice Needed' },
  ];

  const universityOptions = [
    { value: 'EA Consultancy', label: 'EA Consultancy'}
  ];

//   const statusOptions = [
//     { value: 'app_incomplete', label: 'App. Incomplete' },
//     { value: 'app_submitted', label: 'App. Submitted' },
//     { value: 'offer_received', label: 'Offer Received' },
//   ];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
        
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

     {/* Program Name */}
     <Label>
          <span>University Name</span>
          <Input className="mt-1" type="text" placeholder="Search by commission Note Number" />
        </Label>
        {/* Country */}
        <Label>
          <span>Status</span>
          <Select
            isMulti
            options={statusOptions}
            onChange={(opts) => setSelectedStatus(opts.map(o => o.value))}
            className="text-sm"
            placeholder="Select Status"
          />
        </Label>

        {/* University */}
        <Label>
          <span>Company</span>
          <Select
            isMulti
            options={universityOptions}
            onChange={(opts) => setSelectedUniversities(opts.map(o => o.value))}
            className="text-sm"
            placeholder="Select Company"
          />
        </Label>

        {/* Status */}
        <Label>
          <span>Status</span>
          <Select
            isMulti
            options={statusOptions}
            onChange={(opts) => setSelectedStatuses(opts.map(o => o.value))}
            className="text-sm"
            placeholder="Select Status"
          />
        </Label>

            {/* Program Name */}
        <Label>
          <span>University Name</span>
          <Input className="mt-1" type="text" placeholder="University Name" />
        </Label>
        {/* Ack No. */}
        <Label>
            <span>Student Name/Email</span>
          <Input className="mt-1" type="text" placeholder="Search by Student Name/Email" />
        </Label>
        <Label>
          <span>Acknowledgement No.</span>
          <Input className="mt-1" type="text" placeholder="Ack No." />
        </Label>


        {/* Student Name */}
        <Label>
          <span>Student Name</span>
          <Input className="mt-1" type="text" placeholder="Student Name" />
        </Label>

        {/* Search Button */}
        <div className="col-span-1 md:col-span-2 lg:col-span-5 text-left">
          <button className="w-full md:w-auto border border-brandRed text-brandRed font-medium rounded-md px-4 py-2 hover:bg-brandRed-50 transition">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnquiriesArchivedFilter;
