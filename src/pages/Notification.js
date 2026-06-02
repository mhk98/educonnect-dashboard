// import React, { useEffect, useState } from "react";
// import {
//   useGetDataByIdQuery,
//   useUpdateNotificationMutation,
// } from "../features/notification/notification";

// const Notification = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [startPage, setStartPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [pagesPerSet, setPagesPerSet] = useState(10);
//   const [itemsPerPage] = useState(10);

//   const [notifications, setNotifications] = useState([]);
//   const branch = localStorage.getItem("branch");
//   const userId = localStorage.getItem("userId");

//   const { data, isLoading, isError, error, refetch } = useGetDataByIdQuery({
//     page: 1,
//     limit: 10,
//     userId,
//     branch,
//     refetchOnMountOrArgChange: true,
//   });

//   console.log("notification", notifications);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 640) setPagesPerSet(5);
//       else if (window.innerWidth < 1024) setPagesPerSet(7);
//       else setPagesPerSet(10);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Update total pages based on meta data from API
//   useEffect(() => {
//     if (isError) {
//       console.error("Error fetching user data", error);
//     } else if (!isLoading && data) {
//       setNotifications(data.data);
//       setTotalPages(Math.ceil(data.meta.total / itemsPerPage));
//     }
//   }, [data, isLoading, isError, error, itemsPerPage]);

//   // Pagination Logic
//   const endPage = Math.min(startPage + pagesPerSet - 1, totalPages);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handlePreviousSet = () =>
//     setStartPage(Math.max(startPage - pagesPerSet, 1));

//   const handleNextSet = () =>
//     setStartPage(
//       Math.min(
//         startPage + pagesPerSet,
//         Math.max(1, totalPages - pagesPerSet + 1)
//       )
//     );

//   const [updateNotification] = useUpdateNotificationMutation();

//   const markAsRead = async (id) => {
//     const res = await updateNotification({ id, userId }).unwrap();
//     console.log("Notification marked as read successfully:", res);
//   };

//   return (
//     <div className="w-full bg-white rounded-lg shadow-sm p-4">
//       <div className="w-full overflow-x-auto">
//         <table className="w-full text-sm text-left text-gray-700 bg-white shadow-md rounded-lg">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-3">Notification</th>
//               <th className="p-3">Time/Details</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {isLoading ? (
//               <tr>
//                 <td colSpan="3" className="p-10 text-center">
//                   Loading...
//                 </td>
//               </tr>
//             ) : (
//               /* NOTICE: notifications.data is used here because of pagination wrapper */
//               notifications?.map((notification, idx) => (
//                 <tr
//                   key={notification.id || idx}
//                   className={`${
//                     idx % 2 === 0 ? "bg-gray-50" : "bg-white"
//                   } border-t`}
//                 >
//                   <td className="p-3">{notification.message || "No Title"}</td>
//                   <td className="p-3">{notification.createdAt || "N/A"}</td>
//                   <td className="p-3">
//                     <button className="text-blue-600 hover:underline">
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//             {!isLoading && notifications?.data?.length === 0 && (
//               <tr>
//                 <td colSpan="3" className="p-10 text-center">
//                   No notifications found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       <div className="flex items-center justify-center space-x-2 mt-6">
//         <button
//           onClick={handlePreviousSet}
//           disabled={startPage === 1}
//           className="px-3 py-2 text-white bg-brandBlue rounded-md disabled:bg-gray-300"
//         >
//           Prev
//         </button>

//         {[...Array(endPage - startPage + 1)].map((_, idx) => {
//           const pageNum = startPage + idx;
//           if (pageNum > totalPages) return null;
//           return (
//             <button
//               key={pageNum}
//               onClick={() => handlePageChange(pageNum)}
//               className={`px-3 py-2 text-white rounded-md transition ${
//                 pageNum === currentPage
//                   ? "bg-brandBlue"
//                   : "bg-gray-300 hover:bg-brandBlue"
//               }`}
//             >
//               {pageNum}
//             </button>
//           );
//         })}

//         <button
//           onClick={handleNextSet}
//           disabled={endPage >= totalPages}
//           className="px-3 py-2 text-white bg-brandBlue rounded-md disabled:bg-gray-300"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Notification;

// import React, { useEffect, useState } from "react";
// import {
//   useGetDataByIdQuery,
//   useUpdateNotificationMutation,
// } from "../features/notification/notification";

// const timeAgo = (dateString) => {
//   const now = new Date();
//   const past = new Date(dateString);
//   const diff = Math.floor((now - past) / 1000);

//   if (diff < 60) return "Just now";
//   const min = Math.floor(diff / 60);
//   if (min < 60) return `${min}m ago`;
//   const hr = Math.floor(min / 60);
//   if (hr < 24) return `${hr}h ago`;
//   return `${Math.floor(hr / 24)}d ago`;
// };

// const Notification = () => {
//   const branch = localStorage.getItem("branch");
//   const userId = localStorage.getItem("userId");

//   const [notifications, setNotifications] = useState([]);

//   const { data, isLoading } = useGetDataByIdQuery({
//     page: 1,
//     limit: 10,
//     userId,
//     branch,
//   });

//   const [updateNotification] = useUpdateNotificationMutation();

//   useEffect(() => {
//     if (data?.data) setNotifications(data.data);
//   }, [data]);

//   const markAsRead = async (id) => {
//     await updateNotification({ id, userId });
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
//     );
//   };

//   return (
//     <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm border mt-4">
//       {/* Header */}
//       <div className="px-5 py-4 border-b flex items-center justify-between">
//         <h2 className="text-lg font-semibold">Notifications</h2>
//         <span className="text-sm text-gray-500">
//           {notifications.filter((n) => !n.isRead).length} unread
//         </span>
//       </div>

//       {/* List */}
//       <div className="max-h-[70vh] overflow-y-auto divide-y">
//         {isLoading ? (
//           <p className="p-6 text-center text-gray-500">Loading...</p>
//         ) : notifications.length === 0 ? (
//           <p className="p-6 text-center text-gray-500">
//             No notifications found
//           </p>
//         ) : (
//           notifications.map((item) => (
//             <div
//               key={item.id}
//               className={`flex gap-4 px-5 py-4 cursor-pointer transition
//                 ${!item.isRead ? "bg-blue-50" : "hover:bg-gray-50"}
//               `}
//               onClick={() => !item.isRead && markAsRead(item.id)}
//             >
//               {/* Dot */}
//               {!item.isRead && (
//                 <span className="mt-2 h-2 w-2 bg-blue-600 rounded-full"></span>
//               )}

//               {/* Content */}
//               <div className="flex-1">
//                 <p className="text-sm text-gray-800 leading-relaxed">
//                   {item.message}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   {timeAgo(item.createdAt)}
//                 </p>
//               </div>

//               {/* Action */}
//               {!item.isRead && (
//                 <button className="text-xs text-blue-600 hover:underline">
//                   Mark as read
//                 </button>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Notification;

import React, { useEffect, useState } from "react";
import {
  useGetDataByIdQuery,
  useUpdateNotificationMutation,
} from "../features/notification/notification";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Button } from "@windmill/react-ui";

const Notification = () => {
  const branch = localStorage.getItem("branch");
  const userId = localStorage.getItem("userId");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const history = useHistory();
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 10;

  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isError, error } = useGetDataByIdQuery({
    page: currentPage,
    limit: itemsPerPage,
    userId,
    branch,
  });

  const [updateNotification] = useUpdateNotificationMutation();

  const notifications = data?.data || [];
  // const totalPages = Math.ceil((data?.meta?.total || 0) / limit);

  const markAsRead = async (id) => {
    try {
      const res = await updateNotification({ id, userId }).unwrap();
      history.push(`/app/${res.data.url}`);
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
      </div>

      {/* Content */}
      <div className="divide-y max-h-[500px] overflow-y-auto">
        {isLoading && (
          <p className="p-6 text-center text-gray-500">Loading...</p>
        )}

        {isError && (
          <p className="p-6 text-center text-red-500">
            Failed to load notifications
          </p>
        )}

        {!isLoading && notifications.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No notifications found
          </p>
        )}

        {notifications.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition ${
              !item.isRead ? "bg-blue-50" : ""
            }`}
          >
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brandBlue/10 flex items-center justify-center">
              🔔
            </div>

            {/* Message */}
            <div className="flex-1">
              <p className="text-sm text-gray-800">
                {item.message || "No message"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Action */}
            {!item.isRead && (
              <button
                onClick={() => markAsRead(item.id)}
                className="text-xs text-brandBlue font-medium hover:underline"
              >
                View
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {/* {totalPages > 1 && (
        <div className="flex justify-center gap-2 p-4 border-t">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 text-sm rounded bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded ${
                  page === currentPage
                    ? "bg-brandBlue text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 text-sm rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )} */}

      {/* {data?.meta && (
        <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-600">
          <div>
            Showing{" "}
            <strong>
              {(page - 1) * limit + 1} -{" "}
              {Math.min(page * limit, data.meta.total)}
            </strong>{" "}
            of <strong>{data.meta.total}</strong>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="bg-gray-200"
            >
              Previous
            </Button>
            <Button
              disabled={page * limit >= data.meta.total}
              onClick={() => setPage((prev) => prev + 1)}
              className="bg-gray-200"
            >
              Next
            </Button>
          </div>
        </div>
      )} */}

      {data?.meta && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 px-2 text-sm text-gray-600">
          {/* Left info */}
          <div>
            Showing{" "}
            <strong>
              {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, data.meta.total)}
            </strong>{" "}
            of <strong>{data.meta.total}</strong>
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-2">
            {/* Prev */}
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className={`px-4 py-2 rounded-lg text-white transition
                ${
                  currentPage === 1
                    ? "bg-brandDisable cursor-not-allowed"
                    : "bg-brandBlue hover:bg-brandHover"
                }`}
            >
              ← Prev
            </Button>

            {/* Page number */}
            <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
              Page {currentPage}
            </span>

            {/* Next */}
            <Button
              disabled={currentPage * itemsPerPage >= data.meta.total}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-4 py-2 rounded-lg text-white transition
                ${
                  currentPage * itemsPerPage >= data.meta.total
                    ? "bg-brandDisable cursor-not-allowed"
                    : "bg-brandBlue hover:bg-brandHover"
                }`}
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
