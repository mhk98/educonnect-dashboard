import React from "react";
import { FaRegCopy, FaPrint } from "react-icons/fa";

const StudentQRCard = () => {
  const qrLink = "https://yourdomain.com/student-registration";

  const handleCopy = () => {
    navigator.clipboard.writeText(qrLink);
    alert("Link copied to clipboard!");
  };

  const handlePrint = () => {
    const printWindow = window.open();
    printWindow.document.write(
      `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrLink)}" />`,
    );
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="w-full px-0">
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 w-full text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
          Student Registration
        </h2>

        <div className="flex justify-center mb-4 sm:mb-6">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrLink)}`}
            alt="QR Code"
            className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleCopy}
            className="flex-1 border border-brandRed text-brandRed hover:bg-brandRed-50 px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
          >
            <span>Copy Link</span>
            <FaRegCopy />
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 bg-brandRed text-white hover:bg-brandRed-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition-all text-sm sm:text-base"
          >
            <span>Print QR</span>
            <FaPrint />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentQRCard;
