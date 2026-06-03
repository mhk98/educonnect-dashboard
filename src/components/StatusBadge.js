import React from "react";

const STATUS_STYLES = {
  "HOT LEAD": "bg-red-100 text-red-700 border-red-200",
  "COOL LEAD": "bg-blue-100 text-blue-700 border-blue-200",
  "OPEN CASE": "bg-blue-100 text-blue-700 border-blue-200",
  "FIRST CALL DONE": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "VERY INTERESTED": "bg-green-100 text-green-700 border-green-200",
  "REQUIRES FOLLOWUP": "bg-yellow-100 text-yellow-800 border-yellow-200",
  BLOCKED: "bg-red-100 text-red-700 border-red-200",
  "NEEDS ASSISTANT": "bg-purple-100 text-purple-700 border-purple-200",
  "CASE CLOSED": "bg-gray-100 text-gray-600 border-gray-200",
  "CASE CONVERTED": "bg-teal-100 text-teal-700 border-teal-200",
  PENDING: "bg-orange-100 text-orange-800 border-orange-200",
  PAID: "bg-green-100 text-green-800 border-green-200",
  ONLINE: "bg-green-100 text-green-700 border-green-200",
  OFFLINE: "bg-gray-100 text-gray-600 border-gray-200",
  OPEN: "bg-blue-100 text-brandBlue border-blue-200",
  IN_PROGRESS: "bg-orange-100 text-orange-800 border-orange-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  "APPLICATION SUBMITTED": "bg-green-100 text-green-700 border-green-200",
  "UNIVERSITY APPLICATION INITIATED":
    "bg-yellow-100 text-yellow-800 border-yellow-200",
  "OFFER RECIEVED": "bg-red-100 text-red-700 border-red-200",
  "OFFER RECEIVED": "bg-red-100 text-red-700 border-red-200",
  "TUITION FEES PAID": "bg-blue-100 text-blue-700 border-blue-200",
  "LOA RECEIVED": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "VISA SUBMITTED": "bg-purple-100 text-purple-700 border-purple-200",
  "VISA RECEIVED": "bg-green-100 text-green-700 border-green-200",
  "RECEIVED APPLICATION AT EDUCONNECT":
    "bg-blue-100 text-blue-700 border-blue-200",
  "APPLICATION IN PROGRESS":
    "bg-orange-100 text-orange-800 border-orange-200",
  "APPLICATION HOLD ON - EDUCONNECT":
    "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const STATUS_ACCENTS = {
  "HOT LEAD": "#ef4444",
  "COOL LEAD": "#3b82f6",
  "OPEN CASE": "#3b82f6",
  "FIRST CALL DONE": "#6366f1",
  "VERY INTERESTED": "#22c55e",
  "REQUIRES FOLLOWUP": "#f59e0b",
  BLOCKED: "#ef4444",
  "NEEDS ASSISTANT": "#8b5cf6",
  "CASE CLOSED": "#64748b",
  "CASE CONVERTED": "#14b8a6",
  PENDING: "#f97316",
  PAID: "#22c55e",
  OPEN: "#1b2e6b",
  IN_PROGRESS: "#f97316",
  COMPLETED: "#22c55e",
  "APPLICATION SUBMITTED": "#22c55e",
  "UNIVERSITY APPLICATION INITIATED": "#f59e0b",
  "OFFER RECIEVED": "#ef4444",
  "OFFER RECEIVED": "#ef4444",
  "TUITION FEES PAID": "#3b82f6",
  "LOA RECEIVED": "#6366f1",
  "VISA SUBMITTED": "#8b5cf6",
  "VISA RECEIVED": "#10b981",
};

const normalizeStatus = (status) => String(status || "").trim().toUpperCase();

export const getStatusBadgeClass = (status) =>
  STATUS_STYLES[normalizeStatus(status)] ||
  "bg-gray-100 text-gray-600 border-gray-200";

export const getStatusAccentColor = (status) =>
  STATUS_ACCENTS[normalizeStatus(status)] || "#94a3b8";

const StatusBadge = ({ status, className = "", emptyLabel = "N/A" }) => {
  const label = status || emptyLabel;

  if (!label) {
    return <span className="text-gray-300">—</span>;
  }

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-2 py-1 text-xs font-semibold whitespace-nowrap ${getStatusBadgeClass(
        label,
      )} ${className}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
