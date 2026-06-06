// import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";

// const SOCKET_URL = "https://backend.eaconsultancy.org";

// export default function useNotifications(branch) {
//   const socket = useRef(null);
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!branch) return;

//     // Initialize Socket
//     // socket.current = io(SOCKET_URL);

//     const userId = localStorage.getItem("userId");
//     // if (userId) socket.current.emit("join", userId);

//     // Listen for new notifications
//     // socket.current.on("new_notification", (notif) => {
//     //   // Only push notification if branch + role match
//     //   if (notif.branch === branch) {
//     //     setNotifications((prev) => [notif, ...prev]);
//     //   }
//     // });

//     // Fetch existing notifications
//     const fetchNotifications = async () => {
//       try {
//         const res = await fetch(
//           `https://backend.eaconsultancy.org/api/v1/notification/${branch}/${userId}`
//         );
//         const data = await res.json();
//         if (data.success) setNotifications(data.data);
//       } catch (err) {
//         console.error("Error fetching notifications:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchNotifications();

//     // return () => socket.current.disconnect();
//   }, [branch]);

//   const markAsRead = async (id) => {
//     const userId = localStorage.getItem("userId"); // লোকালস্টোরেজ থেকে ইউজার আইডি নিলাম

//     try {
//       const res = await fetch(`${SOCKET_URL}/api/v1/notification/${id}/read`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userId }), // 👈 এখানে userId পাঠাচ্ছি
//       });

//       const data = await res.json();
//       if (data.success) {
//         setNotifications((prev) =>
//           prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
//         );
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   return { notifications, loading, markAsRead, unreadCount };
// }

// import { useEffect, useState } from "react";

// const SITE_URL = "https://backend.eaconsultancy.org";
// const POLLING_INTERVAL = 1000;

// export default function useNotifications(branch) {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!branch) return;

//     const userId = localStorage.getItem("userId");

//     const fetchNotifications = async () => {
//       try {

//         const res = await fetch(
//           `${SITE_URL}/api/v1/notification/${branch}/${userId}`
//         );
//         const data = await res.json();
//         if (data.success) {
//           setNotifications(data.data);
//         }
//       } catch (err) {
//         console.error("Error fetching notifications:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();

//     const intervalId = setInterval(fetchNotifications, POLLING_INTERVAL);

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [branch]);

//   const markAsRead = async (id) => {
//     const userId = localStorage.getItem("userId");

//     try {
//       const res = await fetch(`${SITE_URL}/api/v1/notification/${id}/read`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userId }),
//       });

//       const data = await res.json();
//       if (data.success) {
//         setNotifications((prev) =>
//           prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
//         );
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   return { notifications, loading, markAsRead, unreadCount };
// }
