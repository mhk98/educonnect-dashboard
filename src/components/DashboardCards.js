import React, { useState } from "react";

const DashboardCards = () => {
  const submittedOptions = {
    All: 1,
    Online: 3,
    Offline: 2,
  };

  const offersOptions = {
    All: 0,
    Conditional: 5,
    Unconditional: 2,
  };

  const [selectedSubmitted, setSelectedSubmitted] = useState("All");
  const [selectedOffers, setSelectedOffers] = useState("All");

  const cards = [
    {
      label: "Submitted",
      count: submittedOptions[selectedSubmitted],
      border: "border-l-4 border-brandRed",
      dropdown: {
        value: selectedSubmitted,
        onChange: (e) => setSelectedSubmitted(e.target.value),
        options: Object.keys(submittedOptions),
      },
    },
    {
      label: "Offers",
      count: offersOptions[selectedOffers],
      border: "border-l-4 border-brandRed",
      dropdown: {
        value: selectedOffers,
        onChange: (e) => setSelectedOffers(e.target.value),
        options: Object.keys(offersOptions),
      },
    },
    { label: "Payments", count: 0, border: "border-l-4 border-green-400" },
    {
      label: "Visas Received",
      count: 0,
      border: "border-l-4 border-green-400",
    },
    { label: "Visas Rejected", count: 0, border: "border-l-4 border-red-500" },
    {
      label: "Non-Enrolments",
      count: 0,
      border: "border-l-4 border-yellow-500",
    },
    { label: "Deferrals", count: 0, border: "border-l-4 border-yellow-500" },
    {
      label: "Pending from Partner",
      count: 0,
      border: "border-l-4 border-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-8">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-white rounded-lg shadow-sm p-4 ${card.border}`}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-800">{card.label}</h4>
            {card.dropdown && (
              <select
                value={card.dropdown.value}
                onChange={card.dropdown.onChange}
                className="text-sm border border-gray-300 rounded-md px-1 py-0.5 text-gray-600 bg-white focus:outline-none"
              >
                {card.dropdown.options.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="text-2xl font-semibold text-gray-800">
            {card.count}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
