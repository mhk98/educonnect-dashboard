import React from "react";
import { FaLink, FaTrash } from "react-icons/fa";

// Updated data matching all table headings
const students = [
  {
    transId: "TRX1001",
    dateTime: "06/04/2025 12:30 PM",
    name: "MD Hossain",
    applications: "University of Toronto",
    transAmount: "$500",
    balance: "$1500",
    transType: "Credit",
    transStatus: "Completed",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    transId: "TRX1002",
    dateTime: "21/03/2025 09:15 AM",
    name: "Shadika Shaba",
    applications: "University of Waterloo",
    transAmount: "$300",
    balance: "$1200",
    transType: "Debit",
    transStatus: "Pending",
    statusColor: "bg-yellow-100 text-yellow-700",
  },
  {
    transId: "TRX1003",
    dateTime: "20/03/2025 03:45 PM",
    name: "Mahmudul Hasan",
    applications: "University of Melbourne",
    transAmount: "$700",
    balance: "$800",
    transType: "Credit",
    transStatus: "Failed",
    statusColor: "bg-red-100 text-red-700",
  },
  {
    transId: "TRX1004",
    dateTime: "17/03/2025 10:00 AM",
    name: "MD Ahosanul Ovi",
    applications: "Monash University",
    transAmount: "$400",
    balance: "$1100",
    transType: "Credit",
    transStatus: "Completed",
    statusColor: "bg-green-100 text-green-700",
  },
];

export default function WalletTable() {
  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md p-6">
        <thead className="text-sm text-gray-700">
          <tr className="text-left">
            <th className="p-3">Trans. ID</th>
            <th className="p-3">Date & Time</th>
            <th className="p-3">Student Name</th>
            <th className="p-3">Applications</th>
            <th className="p-3">Trans. Amt</th>
            <th className="p-3">Balance</th>
            <th className="p-3">Trans. Type</th>
            <th className="p-3">Trans. Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, idx) => (
            <tr
              key={idx}
              className={`text-sm border-t border-gray-200 ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="p-3 whitespace-nowrap">{student.transId}</td>
              <td className="p-3 whitespace-nowrap">{student.dateTime}</td>
              <td className="p-3 whitespace-nowrap">{student.name}</td>
              <td className="p-3 whitespace-nowrap">{student.applications}</td>
              <td className="p-3 whitespace-nowrap">{student.transAmount}</td>
              <td className="p-3 whitespace-nowrap">{student.balance}</td>
              <td className="p-3 whitespace-nowrap">{student.transType}</td>
              <td className="p-3 whitespace-nowrap">
                <span className={`text-xs px-2 py-1 rounded ${student.statusColor}`}>
                  {student.transStatus}
                </span>
              </td>
              <td className="p-3 whitespace-nowrap flex gap-3 text-brandRed">
                <FaLink className="cursor-pointer" />
                <FaTrash className="cursor-pointer text-red-500" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
