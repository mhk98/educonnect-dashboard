import React, { useState } from 'react';
import Select from 'react-select';
import { Input, Label } from '@windmill/react-ui';

const WalletFilter = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [selectedIntakes, setSelectedIntakes] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

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

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
        
        <Label>
          <span>Transaction ID</span>
          <Input className="mt-1" type="text" placeholder="Transaction ID" />
        </Label>

        <Label>
          <span>Date Created</span>
          <Input
            type="date"
            className="mt-1"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Label>


        <Label>
          <span>Ack No.</span>
          <Input className="mt-1" type="text" placeholder="Ack No." />
        </Label>

        <Label>
          <span>Student Name</span>
          <Input className="mt-1" type="text" placeholder="Program Name" />
        </Label>

        <Label>
          <span>Transaction Amount</span>
          <Input className="mt-1" type="text" placeholder="Trans. Amount" />
        </Label>

        <Label>
          <span>Transaction Type</span>
          <Input className="mt-1" type="text" placeholder="Trans. Type" />
        </Label>
        <div className="col-span-1 md:col-span-2 lg:col-span-5 text-left">
          <button className="w-full md:w-auto border border-brandRed text-brandRed font-medium rounded-md px-4 py-2 hover:bg-brandRed-50 transition">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletFilter;
