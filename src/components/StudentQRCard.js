import React from "react";
import { FaRegCopy, FaPrint } from "react-icons/fa";
import { FiLink } from "react-icons/fi";
import toast from "react-hot-toast";

const QR_URL = `${window.location.origin}/register`;

const StudentQRCard = () => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(QR_URL)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(QR_URL)}" />`,
    );
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 flex flex-col items-center text-center">
      <div className="flex items-center gap-2 mb-1 self-start">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <FiLink size={15} />
        </div>
        <h2 className="text-base font-bold text-gray-800">
          Student Registration
        </h2>
      </div>
      <p className="text-xs text-gray-400 mb-4 self-start ml-10">
        Share this QR for student self-registration
      </p>

      <div className="flex justify-center mb-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(QR_URL)}`}
          alt="QR Code"
          className="w-36 h-36 sm:w-44 sm:h-44"
        />
      </div>

      <div className="flex w-full gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition"
        >
          <FaRegCopy size={13} />
          Copy Link
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-white transition"
          style={{
            background: "linear-gradient(135deg, #1B2E6B 0%, #2196F3 100%)",
          }}
        >
          <FaPrint size={13} />
          Print QR
        </button>
      </div>
    </div>
  );
};

export default StudentQRCard;
