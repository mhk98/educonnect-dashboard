import React, { useEffect, useState } from "react";
import { FaPhoneAlt, FaBell, FaTimes } from "react-icons/fa";
import { useGetAllConsultationQuery } from "../features/consultation/consultation";
import { useGetAllNoticeQuery } from "../features/notice/notice";

const callList = [
  { name: "Priya Akter", phone: "+880 1922-526444" },
  { name: "Rajib Hasan", phone: "+880 1931-036171" },
  { name: "Kamal Uddin", phone: "+880 1698-897899" },
  { name: "Rezaul Rahman", phone: "+880 1783-195779" },
  { name: "Nafis Hasan", phone: "+880 1896-053404" },
];

const DashboardList = () => {
  const userId = localStorage.getItem("userId");
  const [leads, setLeads] = useState([]);
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const formatDate = (date) => new Date(date).toLocaleDateString("en-CA");

  const today = formatDate(new Date());

  // Fetch consultations
  const { data, isLoading, isError, error } = useGetAllConsultationQuery({
    user_id: userId,
    appointmentDate: today,
  });

  // Fetch all notices
  const {
    data: noticeData,
    isLoading: noticeLoading,
    isError: noticeError,
  } = useGetAllNoticeQuery();

  // Extract and sort notices
  useEffect(() => {
    if (noticeData?.data) {
      const allNotices = Array.isArray(noticeData.data)
        ? noticeData.data
        : [noticeData.data];

      // Copy to avoid mutating read-only API response arrays, then sort by createdAt (latest first) and get top 5
      const latestNotices = [...allNotices]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setNotices(latestNotices);
    }
  }, [noticeData]);

  useEffect(() => {
    if (isError) {
      console.error("Error fetching consultations:", error);
    } else if (!isLoading && data?.data) {
      setLeads(data.data);
    }
  }, [data, isLoading, isError, error]);

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setShowModal(true);
  };

  const formatDateDisplay = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  console.log("todayAppointment", leads);
  console.log("latestNotices", notices);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
      {/* Call List */}
      <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5">
        <div className="flex justify-between mb-4 sm:mb-5">
          <h2 className="text-sm sm:text-base font-semibold text-slate-700">
            📞 Today's Call List
          </h2>
          <span className="text-gray-400 cursor-pointer">•••</span>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3">
          {leads.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center hover:bg-slate-50 p-2 sm:p-3 rounded-lg transition"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-800 truncate">
                  {item.fullName}
                </p>
                <p className="text-xs text-slate-500 truncate">{item.phone}</p>
              </div>
              <FaPhoneAlt className="text-green-500" />
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500 mt-4">Remaining Follow-Ups</p>
      </div>

      {/* Notice */}
      <div className="bg-white rounded-none border border-slate-200 p-4 sm:p-5 min-h-[300px]">
        <div className="flex justify-between items-center mb-4 sm:mb-5">
          <h2 className="text-sm sm:text-base font-semibold text-slate-700">
            Notice from Head Office
          </h2>
          <span className="text-gray-400 cursor-pointer">•••</span>
        </div>

        {noticeLoading ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-xs sm:text-sm">
              Loading notices...
            </p>
          </div>
        ) : noticeError ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-xs sm:text-sm">
              Failed to load notices
            </p>
          </div>
        ) : notices.length > 0 ? (
          <div className="flex flex-col gap-2 sm:gap-3">
            {notices.map((notice) => (
              <div
                key={notice._id}
                onClick={() => handleNoticeClick(notice)}
                className="flex items-start gap-2 sm:gap-3 cursor-pointer hover:bg-slate-50 p-2 sm:p-3 rounded-lg transition"
              >
                <div className="bg-red-100 text-red-600 p-2 rounded-full mt-0.5 flex-shrink-0">
                  <FaBell size={12} className="sm:hidden" />
                  <FaBell size={14} className="hidden sm:block" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-700 truncate">
                    {notice.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDateDisplay(notice.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-500 text-xs sm:text-sm">
              No notices available
            </p>
          </div>
        )}
      </div>

      {/* Notice Detail Modal */}
      {showModal && selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Notice Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 transition text-xl sm:text-2xl flex-shrink-0"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                  {selectedNotice.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {formatDateDisplay(selectedNotice.createdAt)}
                </p>
              </div>

              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {selectedNotice.description}
                </p>
              </div>

              {selectedNotice.updatedAt && (
                <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                  Last Updated: {formatDateDisplay(selectedNotice.updatedAt)}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-200 flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 sm:px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardList;
