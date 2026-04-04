// import React from "react";
// import useNotifications from "../context/useNotifications";

// const NotificationDropdown = ({ branch }) => {
//   const role = localStorage.getItem("role");
//   const { notifications, loading, markAsRead } = useNotifications(branch);

//   if (loading) return <p className="p-4">Loading notifications...</p>;

//   return (
//     <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
//       <ul className="py-2 text-sm text-gray-800 dark:text-gray-200">
//         {notifications.length === 0 && (
//           <li className="px-4 py-2">No notifications</li>
//         )}
//         {notifications.map((notif) => (
//           <li
//             key={notif.id}
//             className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
//               notif.isRead ? "" : "font-bold"
//             }`}
//             onClick={() => markAsRead(notif.id)}
//           >
//             {notif.message}{" "}
//             {role !== "student" && notif.url && (
//               <a href={notif.url} className="text-blue-500 ml-1">
//                 🔗
//               </a>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default NotificationDropdown;

// import React from "react";
// import useNotifications from "../context/useNotifications";

// const timeAgo = (dateString) => {
//   const now = new Date();
//   const past = new Date(dateString);
//   const diffInSeconds = Math.floor((now - past) / 1000);

//   if (diffInSeconds < 60) return "Just now";

//   const minutes = Math.floor(diffInSeconds / 60);
//   if (minutes < 60) return `${minutes} minutes ago`;

//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours} hours ago`;

//   const days = Math.floor(hours / 24);
//   return `${days} days ago`;
// };

// const NotificationDropdown = ({ branch }) => {
//   const role = localStorage.getItem("role");
//   const { notifications, loading, markAsRead } = useNotifications(branch);

//   if (loading) {
//     return (
//       <div className="w-96 p-4 text-center text-sm text-gray-500">
//         Loading notifications...
//       </div>
//     );
//   }

//   return (
//     <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-[450px] overflow-y-auto">
//       <ul className="divide-y divide-gray-100">
//         {notifications.length === 0 && (
//           <li className="px-4 py-4 text-sm text-gray-500 text-center">
//             No notifications
//           </li>
//         )}

//         {notifications.map((notif) => (
//           <li
//             key={notif.id}
//             onClick={() => markAsRead(notif.id)}
//             className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition
//               ${
//                 notif.isRead
//                   ? "bg-white hover:bg-gray-50"
//                   : "bg-blue-50 hover:bg-blue-100"
//               }
//             `}
//           >
//             {/* 🔹 Left Icon / Avatar */}
//             <div className="relative flex-shrink-0">
//               <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
//                 🔔
//               </div>
//             </div>

//             {/* 🔹 Message */}
//             <div className="flex-1">
//               <p
//                 className={`text-sm leading-snug ${
//                   notif.isRead ? "text-gray-700" : "text-gray-900 font-semibold"
//                 }`}
//               >
//                 {notif.message}
//                 {role !== "student" && notif.url && (
//                   <a
//                     href={notif.url}
//                     className="ml-1 text-blue-600 hover:underline"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     View
//                   </a>
//                 )}
//               </p>

//               <div className="flex justify-between mt-1">
//                 <span className="text-xs text-gray-500">
//                   {timeAgo(notif.createdAt)}
//                 </span>

//                 {!notif.isRead && (
//                   <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                 )}
//               </div>

//               {/* <p className="text-xs text-gray-500 mt-1">
//                 {notif.createdAt || "Just now"}
//               </p> */}
//             </div>

//             {/* {!notif.isRead && (
//               <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-2" />
//             )} */}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default NotificationDropdown;

import React from "react";
import {
  useGetDataByIdQuery,
  useUpdateNotificationMutation,
} from "../features/notification/notification";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";

/* -------- Time Ago Helper -------- */
const timeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now - past) / 1000);

  if (diff < 60) return "Just now";
  const min = Math.floor(diff / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
};

const NotificationDropdown = ({ branch }) => {
  const userId = localStorage.getItem("userId");

  const history = useHistory();

  const { data, isLoading, refetch } = useGetDataByIdQuery(
    {
      page: 1,
      limit: 5,
      userId,
      branch,
    },
    { pollingInterval: 1000 },
  );

  const notifications = data?.data ?? [];

  const [updateNotification] = useUpdateNotificationMutation();

  const markAsRead = async (id) => {
    const res = await updateNotification({ id, userId }).unwrap();

    if (res.success === true) {
      // history.push(`/app/${res.data.url}`);
      refetch();
      history.push(`/app/${res.data.url}`);
    }
  };

  const visibleNotifications = notifications.slice(0, 4);

  if (isLoading) {
    return (
      <div
        className="p-4 text-center text-sm text-gray-500 bg-white shadow-xl rounded-xl border"
        style={{ width: "340px", maxWidth: "calc(100vw - 24px)" }}
      >
        Loading notifications...
      </div>
    );
  }

  return (
    <div
      className="
      absolute right-0 mt-2
    bg-white rounded-xl shadow-2xl border border-gray-200
    z-50 flex flex-col py-3

      "
      style={{ width: "340px", maxWidth: "calc(100vw - 24px)" }}
    >
      {/* ---------- Header ---------- */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="font-bold text-lg text-gray-900">Notifications</h3>
      </div>

      <ul
        className="
          flex-1
          divide-y divide-gray-100"
      >
        {visibleNotifications.length === 0 ? (
          <li className="px-4 py-8 text-sm text-gray-500 text-center">
            No notifications yet
          </li>
        ) : (
          visibleNotifications.map((notif) => (
            <li
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`
                flex gap-3 px-4 py-3 cursor-pointer transition
                ${
                  notif.isRead
                    ? "bg-white hover:bg-gray-50"
                    : "bg-blue-50 hover:bg-blue-100/50"
                }
              `}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div
                  className={`
                    w-11 h-11 rounded-full flex items-center justify-center text-white
                    ${notif.isRead ? "bg-gray-400" : "bg-blue-600"}
                  `}
                >
                  🔔
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm leading-snug ${
                    notif.isRead ? "text-gray-600" : "text-gray-900 font-medium"
                  }`}
                >
                  {notif.message}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs ${
                      notif.isRead
                        ? "text-gray-500"
                        : "text-blue-600 font-semibold"
                    }`}
                  >
                    {timeAgo(notif.createdAt)}
                  </span>

                  {!notif.isRead && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>

      {notifications.length > 3 && (
        <div className=" border-t border-gray-100 text-center my-4">
          <Link
            className="w-full text-sm font-semibold py-1 rounded bg-gray-300 py-3 px-8 "
            to="/app/notification"
          >
            <button>See previous notifications</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
