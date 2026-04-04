import React from "react";

const commissionData = [
  {
    id: "KCOEPL/CN/2425/16887",
    company: "EA Consultancy",
    amount: "2,17,813",
    createdOn: "20-01-2025 05:06:51 PM",
    updatedOn: "23-01-2025 08:35:54 AM",
    isActive: true,
  },
  {
    id: "KCOEPL/CN/2425/15731",
    company: "EA Consultancy",
    amount: "2,35,483",
    createdOn: "31-12-2024 06:13:47 PM",
    updatedOn: "30-01-2025 12:25:33 PM",
    isActive: false,
  },
];

const CommissionCard = ({ data }) => (
  <div
    className={`border rounded-md shadow-sm p-4 mb-4 ${
      data.isActive ? "bg-brandRed-50 border-brandRed-400" : "bg-white"
    }`}
  >
    <div className="flex justify-between items-center flex-wrap gap-2">
      <h3 className="text-sm font-bold text-gray-800">
        {data.id}
      </h3>
      <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
        Commission Payment
      </span>
    </div>

    <p className="text-sm text-gray-600 mt-2">{data.company}</p>

    <p className="text-sm mt-1">
      <span className="font-semibold">Commission Amount is </span>
      <span className="text-brandRed-700 font-bold">INR {data.amount}</span>
    </p>

    <p className="text-sm mt-1">
      <span className="font-semibold">Created On:</span>{" "}
      {data.createdOn}
    </p>

    <p className="text-sm mt-1">
      <span className="font-semibold">Last Updated On:</span>{" "}
      {data.updatedOn}
    </p>
  </div>
);

const CommissionPaymentList = () => {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      {commissionData.map((item, idx) => (
        <CommissionCard data={item} key={idx} />
      ))}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
        <div className="flex items-center space-x-2">
          <button className="px-2 py-1 bg-brandRed text-white text-sm rounded">
            &lt;
          </button>
          <span className="px-3 py-1 bg-brandRed text-white text-sm rounded">
            1
          </span>
          <button className="px-2 py-1 bg-brandRed text-white text-sm rounded">
            &gt;
          </button>
        </div>

        <select className="border rounded px-2 py-1 text-sm">
          <option>25/page</option>
          <option>50/page</option>
          <option>100/page</option>
        </select>
      </div>
    </div>
  );
};

export default CommissionPaymentList;
