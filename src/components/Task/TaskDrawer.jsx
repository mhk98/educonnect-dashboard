// import React from "react";
// import { X } from "lucide-react";
// import TaskComments from "./TaskComments";
// import TaskActivity from "./TaskActivity";

// /* =========================
//    Avatar Component
// ========================= */
// const Avatar = ({ user, size = 40, showStatus = true }) => {
//   if (!user) return null;

//   const first = user.FirstName || "";
//   const last = user.LastName || "";
//   const initials =
//     (first[0] || "").toUpperCase() + (last[0] || "").toUpperCase();

//   const imageUrl = user.image
//     ? user.image.startsWith("http")
//       ? user.image
//       : `https://backend.eaconsultancy.org/${user.image}`
//     : null;

//   const isOnline = Boolean(user.isOnline);

//   return (
//     <div className="relative inline-block">
//       {imageUrl ? (
//         <img
//           src={imageUrl}
//           alt={`${first} ${last}`}
//           className="rounded-full object-cover border"
//           style={{ width: size, height: size }}
//         />
//       ) : (
//         <div
//           className="rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-semibold border"
//           style={{
//             width: size,
//             height: size,
//             fontSize: size / 2.2,
//           }}
//         >
//           {initials || "?"}
//         </div>
//       )}

//       {showStatus && (
//         <span
//           className={`absolute bottom-0 right-0 rounded-full border-2 border-white ${
//             isOnline ? "bg-green-500" : "bg-gray-400"
//           }`}
//           style={{
//             width: size / 3.5,
//             height: size / 3.5,
//           }}
//         />
//       )}
//     </div>
//   );
// };

// /* =========================
//    Helper
// ========================= */
// const isImage = (file) => file?.mimetype?.startsWith("image");

// /* =========================
//    TaskDrawer Component
// ========================= */
// const TaskDrawer = ({ open, onClose, task }) => {
//   if (!open || !task) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex">
//       {/* Overlay */}
//       <div className="fixed inset-0 bg-black/40" onClick={onClose} />

//       {/* Drawer */}
//       <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-xl flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between px-4 py-3 border-b">
//           <h3 className="text-lg font-semibold text-gray-800">Task Details</h3>
//           <button onClick={onClose}>
//             <X className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-4 overflow-y-auto flex-1 space-y-6">
//           {/* Task Info */}
//           <div>
//             <h4 className="font-semibold text-sm mb-1">{task.task}</h4>
//             <p className="text-sm text-gray-600">
//               {task.description || "No description"}
//             </p>

//             <div className="mt-3 text-xs text-gray-500 space-y-1">
//               <div>Status: {task.status}</div>
//               <div>Due: {task.dueDate || "—"}</div>
//               <div>Branch: {task.branch}</div>
//             </div>
//           </div>

//           {/* Creator */}
//           <div>
//             <p className="text-xs text-gray-500 mb-2">Created By</p>
//             <div className="flex items-center gap-3">
//               <Avatar user={task.creator} size={42} />
//               <div>
//                 <p className="text-sm font-medium text-gray-800">
//                   {task.creator?.FirstName} {task.creator?.LastName}
//                 </p>
//                 <p className="text-xs text-gray-500">Creator</p>
//               </div>
//             </div>
//           </div>

//           {/* Assignee */}
//           <div>
//             <p className="text-xs text-gray-500 mb-2">Assigned To</p>
//             <div className="flex items-center gap-3">
//               <Avatar user={task.assignee} size={42} />
//               <div>
//                 <p className="text-sm font-medium text-gray-800">
//                   {task.assignee?.FirstName} {task.assignee?.LastName}
//                 </p>
//                 <p className="text-xs text-gray-500">Assignee</p>
//               </div>
//             </div>
//           </div>

//           {/* Attachments */}
//           {task.files && task.files.length > 0 && (
//             <div>
//               <p className="text-xs text-gray-500 mb-2">Attachments</p>

//               <div className="space-y-2">
//                 {task.files.map((file, index) => {
//                   const fileUrl = `https://backend.eaconsultancy.org/${file.path}`;

//                   return (
//                     <div
//                       key={index}
//                       className="flex items-center gap-3 p-2 border rounded-md hover:bg-gray-50"
//                     >
//                       {/* Preview */}
//                       {isImage(file) ? (
//                         <img
//                           src={fileUrl}
//                           alt={file.filename}
//                           className="w-12 h-12 object-cover rounded"
//                         />
//                       ) : (
//                         <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded text-xs font-semibold">
//                           PDF
//                         </div>
//                       )}

//                       {/* Info */}
//                       <div className="flex-1 overflow-hidden">
//                         <p className="text-sm truncate">{file.filename}</p>
//                         <p className="text-xs text-gray-500">
//                           {(file.size / 1024).toFixed(1)} KB
//                         </p>
//                       </div>

//                       {/* Action */}
//                       <a
//                         href={fileUrl}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="text-xs text-blue-600 hover:underline"
//                       >
//                         View
//                       </a>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Comments */}
//           <TaskComments taskId={task.id} />

//           {/* Activity */}
//           <div className="mt-6">
//             <TaskActivity taskId={task.id} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskDrawer;

// import React, { useMemo } from "react";
// import {
//   X,
//   Calendar,
//   ClipboardList,
//   MapPin,
//   BadgeCheck,
//   AlertTriangle,
//   ShieldAlert,
//   Paperclip,
//   User,
// } from "lucide-react";
// import TaskComments from "./TaskComments";
// import TaskActivity from "./TaskActivity";

// /* =========================
//    Utils
// ========================= */
// const cn = (...classes) => classes.filter(Boolean).join(" ");

// const formatDate = (dateStr) => {
//   if (!dateStr) return "—";
//   const d = new Date(dateStr);
//   if (Number.isNaN(d.getTime())) return dateStr;
//   return d.toLocaleDateString(undefined, {
//     year: "numeric",
//     month: "short",
//     day: "2-digit",
//   });
// };

// const dueBadge = (dueDateStr) => {
//   if (!dueDateStr) {
//     return {
//       text: "No due date",
//       cls: "bg-slate-50 text-slate-600 ring-slate-200",
//     };
//   }
//   const today = new Date();
//   const due = new Date(`${dueDateStr}T00:00:00`);
//   const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

//   if (diff < 0)
//     return {
//       text: `Overdue ${Math.abs(diff)}d`,
//       cls: "bg-red-50 text-red-700 ring-red-200",
//     };
//   if (diff === 0)
//     return {
//       text: "Due today",
//       cls: "bg-orange-50 text-orange-800 ring-orange-200",
//     };
//   if (diff <= 2)
//     return {
//       text: `Due in ${diff}d`,
//       cls: "bg-yellow-50 text-yellow-800 ring-yellow-200",
//     };
//   return { text: "On track", cls: "bg-green-50 text-green-700 ring-green-200" };
// };

// const statusPill = (status) => {
//   const map = {
//     OPEN: "bg-blue-50 text-blue-700 ring-blue-200",
//     IN_PROGRESS: "bg-orange-50 text-orange-700 ring-orange-200",
//     COMPLETED: "bg-green-50 text-green-700 ring-green-200",
//     BLOCKED: "bg-red-50 text-red-700 ring-red-200",
//   };
//   return map[status] || "bg-slate-50 text-slate-600 ring-slate-200";
// };

// const priorityPill = (priority) => {
//   const map = {
//     LOW: "bg-slate-50 text-slate-600 ring-slate-200",
//     MEDIUM: "bg-yellow-50 text-yellow-800 ring-yellow-200",
//     HIGH: "bg-orange-50 text-orange-800 ring-orange-200",
//     URGENT: "bg-red-50 text-red-700 ring-red-200",
//   };
//   return map[priority] || "bg-slate-50 text-slate-600 ring-slate-200";
// };

// const isImage = (file) => file?.mimetype?.startsWith("image");

// /* =========================
//    Avatar
// ========================= */
// const Avatar = ({ user, size = 40, showStatus = true }) => {
//   if (!user) {
//     return (
//       <div
//         className="rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0"
//         style={{ width: size, height: size }}
//       >
//         <User size={Math.max(16, Math.floor(size / 2.2))} />
//       </div>
//     );
//   }

//   const first = user.FirstName || "";
//   const last = user.LastName || "";
//   const initials =
//     (first[0] || "").toUpperCase() + (last[0] || "").toUpperCase();

//   const imageUrl = user.image
//     ? user.image.startsWith("http")
//       ? user.image
//       : `https://backend.eaconsultancy.org/${user.image}`
//     : null;

//   const isOnline = Boolean(user.isOnline);

//   return (
//     <div
//       className="relative inline-block shrink-0"
//       style={{ width: size, height: size }}
//     >
//       {imageUrl ? (
//         <img
//           src={imageUrl}
//           alt={`${first} ${last}`.trim() || "User"}
//           className="rounded-full object-cover border border-slate-200 shadow-sm"
//           style={{ width: size, height: size }}
//         />
//       ) : (
//         <div
//           className="rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-sm flex items-center justify-center font-bold"
//           style={{ width: size, height: size, fontSize: size / 2.4 }}
//           title={`${first} ${last}`.trim()}
//         >
//           {initials || "?"}
//         </div>
//       )}

//       {showStatus ? (
//         <span
//           className={cn(
//             "absolute bottom-0 right-0 rounded-full ring-2 ring-white",
//             isOnline ? "bg-green-500" : "bg-slate-400",
//           )}
//           style={{ width: size / 3.6, height: size / 3.6 }}
//         />
//       ) : null}
//     </div>
//   );
// };

// /* =========================
//    Small UI pieces
// ========================= */
// const Pill = ({ className, children }) => (
//   <span
//     className={cn(
//       "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ring-1 ring-inset",
//       className,
//     )}
//   >
//     {children}
//   </span>
// );

// const InfoRow = ({ icon: Icon, label, value, right }) => (
//   <div className="flex items-start justify-between gap-3">
//     <div className="flex items-start gap-2 min-w-0">
//       <div className="mt-0.5 text-slate-400">
//         <Icon size={16} />
//       </div>
//       <div className="min-w-0">
//         <div className="text-[11px] text-slate-500">{label}</div>
//         <div className="text-sm font-semibold text-slate-900 truncate">
//           {value}
//         </div>
//       </div>
//     </div>
//     {right}
//   </div>
// );

// const Section = ({ title, children }) => (
//   <div className="space-y-3">
//     <div className="text-xs font-semibold text-slate-700">{title}</div>
//     <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//       {children}
//     </div>
//   </div>
// );

// /* =========================
//    TaskDrawer
// ========================= */
// const TaskDrawer = ({ open, onClose, task }) => {
//   const due = useMemo(() => dueBadge(task?.dueDate), [task?.dueDate]);

//   if (!open || !task) return null;

//   const fileList = Array.isArray(task.files) ? task.files : [];
//   const statusIcon =
//     task.status === "COMPLETED"
//       ? BadgeCheck
//       : task.status === "BLOCKED"
//         ? ShieldAlert
//         : task.status === "IN_PROGRESS"
//           ? AlertTriangle
//           : ClipboardList;

//   return (
//     <div className="fixed inset-0 z-50">
//       {/* Overlay */}
//       <div
//         className="absolute inset-0 bg-black/40"
//         onClick={onClose}
//         aria-hidden="true"
//       />

//       {/* Drawer */}
//       <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col">
//         {/* Header */}
//         <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-3">
//           <div className="min-w-0">
//             <div className="text-[11px] text-slate-500">Task Details</div>
//             <div className="text-lg font-semibold text-slate-900 leading-snug truncate">
//               {task.task}
//             </div>

//             <div className="mt-2 flex flex-wrap items-center gap-2">
//               <Pill className={priorityPill(task.priority)}>
//                 {task.priority || "NORMAL"}
//               </Pill>
//               <Pill className={statusPill(task.status)}>
//                 {task.status || "—"}
//               </Pill>
//               <Pill className={due.cls}>{due.text}</Pill>
//             </div>
//           </div>

//           <button
//             onClick={onClose}
//             type="button"
//             className="h-10 w-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center"
//             aria-label="Close"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50">
//           {/* Overview */}
//           <Section title="Overview">
//             <div className="space-y-4">
//               <InfoRow
//                 icon={statusIcon}
//                 label="Status"
//                 value={task.status || "—"}
//                 right={
//                   <Pill className={statusPill(task.status)}>
//                     {task.status || "—"}
//                   </Pill>
//                 }
//               />

//               <InfoRow
//                 icon={Calendar}
//                 label="Due date"
//                 value={formatDate(task.dueDate)}
//                 right={<Pill className={due.cls}>{due.text}</Pill>}
//               />

//               <InfoRow
//                 icon={MapPin}
//                 label="Branch"
//                 value={task.branch || "—"}
//               />

//               <div>
//                 <div className="text-[11px] text-slate-500 mb-1">
//                   Description
//                 </div>
//                 <div className="text-sm text-slate-700 leading-relaxed">
//                   {task.description || "No description"}
//                 </div>
//               </div>
//             </div>
//           </Section>

//           {/* People */}
//           <Section title="People">
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <Avatar user={task.creator} size={44} />
//                 <div className="min-w-0">
//                   <div className="text-sm font-semibold text-slate-900 truncate">
//                     {task.creator?.FirstName || "Unknown"}{" "}
//                     {task.creator?.LastName || ""}
//                   </div>
//                   <div className="text-xs text-slate-500">
//                     Created by {task.user_id ? `(${task.user_id})` : ""}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <Avatar user={task.assignee} size={44} />
//                 <div className="min-w-0">
//                   <div className="text-sm font-semibold text-slate-900 truncate">
//                     {task.assignee?.FirstName || "Unknown"}{" "}
//                     {task.assignee?.LastName || ""}
//                   </div>
//                   <div className="text-xs text-slate-500">
//                     Assigned to{" "}
//                     {task.assignedTo_id ? `(${task.assignedTo_id})` : ""}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Section>

//           {/* Attachments */}
//           <Section title="Attachments">
//             {fileList.length === 0 ? (
//               <div className="text-sm text-slate-600">No attachments</div>
//             ) : (
//               <div className="space-y-2">
//                 {fileList.map((file, index) => {
//                   const fileUrl = file?.path
//                     ? `https://backend.eaconsultancy.org/${file.path}`
//                     : file?.url || "#";

//                   const name =
//                     file?.filename || file?.name || `File ${index + 1}`;
//                   const sizeKb =
//                     typeof file?.size === "number"
//                       ? `${(file.size / 1024).toFixed(1)} KB`
//                       : "";

//                   return (
//                     <div
//                       key={index}
//                       className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
//                     >
//                       <div className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
//                         {isImage(file) ? (
//                           <img
//                             src={fileUrl}
//                             alt={name}
//                             className="h-full w-full object-cover"
//                           />
//                         ) : (
//                           <div className="flex flex-col items-center justify-center text-slate-600">
//                             <Paperclip size={18} />
//                             <span className="text-[10px] font-semibold mt-1">
//                               FILE
//                             </span>
//                           </div>
//                         )}
//                       </div>

//                       <div className="flex-1 min-w-0">
//                         <div className="text-sm font-semibold text-slate-900 truncate">
//                           {name}
//                         </div>
//                         <div className="text-xs text-slate-500">{sizeKb}</div>
//                       </div>

//                       <a
//                         href={fileUrl}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
//                       >
//                         View
//                       </a>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </Section>

//           {/* Comments */}
//           <Section title="Comments">
//             <TaskComments taskId={task.id} />
//           </Section>

//           {/* Activity */}
//           <Section title="Activity">
//             <TaskActivity taskId={task.id} />
//           </Section>
//         </div>

//         {/* Footer */}
//         <div className="px-5 py-4 border-t border-slate-200 bg-white">
//           <button
//             onClick={onClose}
//             type="button"
//             className="w-full h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskDrawer;

import React, { useMemo } from "react";
import { X, Calendar, MapPin, Paperclip, User } from "lucide-react";
import TaskComments from "./TaskComments";
import TaskActivity from "./TaskActivity";

/* =========================
   Utils
========================= */
const cn = (...classes) => classes.filter(Boolean).join(" ");

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const dueBadge = (dueDateStr) => {
  if (!dueDateStr) {
    return {
      text: "No due date",
      cls: "bg-slate-100 text-slate-600",
    };
  }
  const today = new Date();
  const due = new Date(`${dueDateStr}T00:00:00`);
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  if (diff < 0)
    return {
      text: `Overdue ${Math.abs(diff)}d`,
      cls: "bg-red-50 text-red-700",
    };
  if (diff === 0)
    return {
      text: "Due today",
      cls: "bg-orange-100 text-orange-800",
    };
  if (diff <= 2)
    return {
      text: `Due in ${diff}d`,
      cls: "bg-yellow-50 text-yellow-700",
    };
  return { text: "On track", cls: "bg-green-50 text-green-700" };
};

const statusPill = (status) => {
  const map = {
    OPEN: "bg-blue-100 text-brandBlue",
    IN_PROGRESS: "bg-orange-100 text-orange-800",
    COMPLETED: "bg-green-100 text-green-800",
    BLOCKED: "bg-red-100 text-red-800",
  };
  return map[status] || "bg-slate-100 text-slate-600";
};

const priorityPill = (priority) => {
  const map = {
    LOW: "bg-slate-100 text-slate-600",
    MEDIUM: "bg-yellow-50 text-yellow-700",
    HIGH: "bg-orange-100 text-orange-800",
    URGENT: "bg-red-100 text-red-800",
  };
  return map[priority] || "bg-slate-100 text-slate-600";
};

/* =========================
   Avatar
========================= */
const Avatar = ({ user, size = 40 }) => {
  if (!user) {
    return (
      <div
        className="rounded-full bg-slate-200 flex items-center justify-center text-slate-500"
        style={{ width: size, height: size }}
      >
        <User size={size / 2} />
      </div>
    );
  }

  const initials =
    (user.FirstName?.[0] || "").toUpperCase() +
    (user.LastName?.[0] || "").toUpperCase();

  const imageUrl = user.image || null;

  return imageUrl ? (
    <img
      src={imageUrl}
      alt={user.FirstName}
      className="rounded-full object-cover border"
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className="rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
      style={{ width: size, height: size }}
    >
      {initials || "?"}
    </div>
  );
};

//    Helper
// ========================= */
const isImage = (file) => {
  if (file?.mimetype?.startsWith("image")) return true;
  const path = file?.path || file?.url || "";
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(path);
};
/* =========================
   TaskDrawer
========================= */
const TaskDrawer = ({ open, onClose, task }) => {
  const due = useMemo(() => {
    if (!task) return { text: "", cls: "" };
    return dueBadge(task.dueDate);
  }, [task]);

  const files = useMemo(() => {
    if (!task) return [];
    // সম্ভাব্য সব প্রপার্টি নেম চেক করা
    let rawFiles =
      task.files ||
      task.Files ||
      task.file ||
      task.File ||
      task.attachments ||
      task.Attachments ||
      [];

    // অনেক সময় ডাটাবেস থেকে JSON String হিসেবে আসতে পারে
    if (typeof rawFiles === "string") {
      try {
        rawFiles = JSON.parse(rawFiles);
      } catch (e) {
        // যদি JSON না হয়, তবে ধরে নেব এটি একটি সরাসরি ফাইল পাথ
        rawFiles = [rawFiles];
      }
    }

    const normalized = Array.isArray(rawFiles)
      ? rawFiles
      : [rawFiles].filter(Boolean);

    // প্রতিটি ফাইল যদি শুধু স্ট্রিং হয়, তবে সেটিকে অবজেক্টে রূপান্তর করা
    return normalized.map((f) => {
      if (typeof f === "string") {
        return {
          path: f,
          filename: f.split(/[/\\]/).pop() || "File",
        };
      }
      return f;
    });
  }, [task]);

  if (!open || !task) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full sm:max-w-xl bg-slate-50 shadow-2xl flex flex-col">
        {/* ================= HEADER ================= */}
        <div className="bg-white px-4 py-4 sm:px-6 sm:py-5 border-b">
          <div className="flex justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs text-slate-500 mb-1">Task</div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 break-words">
                {task.task}
              </h2>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={cn(
                    "px-2 py-1 rounded-md text-xs font-semibold",
                    statusPill(task.status),
                  )}
                >
                  {task.status}
                </span>
                <span
                  className={cn(
                    "px-2 py-1 rounded-md text-xs font-semibold",
                    priorityPill(task.priority),
                  )}
                >
                  {task.priority}
                </span>
                <span
                  className={cn(
                    "px-2 py-1 rounded-md text-xs font-semibold",
                    due.cls,
                  )}
                >
                  {due.text}
                </span>
              </div>
            </div>

            {/* <button
              onClick={onClose}
              className="h-9 w-9 rounded-lg border bg-white hover:bg-slate-100 flex items-center justify-center"
            >
              <X size={18} />
            </button> */}

            <button
              onClick={onClose}
              type="button"
              className="h-10 w-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className="bg-white flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-6">
          {/* Overview */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar size={14} /> Due
                </div>
                <div className="font-semibold">{formatDate(task.dueDate)}</div>
              </div>

              <div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin size={14} /> Branch
                </div>
                <div className="font-semibold">{task.branch || "—"}</div>
              </div>

              <div>
                <div className="text-xs text-slate-500">Task ID</div>
                <div className="font-semibold">#{task.id}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-slate-500 mb-1">Description</div>
              <p className="text-sm text-slate-700 break-words">
                {task.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* People */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 border border-slate-100">
            <div className="text-sm font-semibold text-slate-800">People</div>

            <div className="flex items-center gap-3">
              <Avatar user={task.creator} size={42} />
              <div className="min-w-0">
                <div className="font-semibold text-sm">
                  {task.creator?.FirstName} {task.creator?.LastName}
                </div>
                <div className="text-xs text-slate-500">Created by</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar user={task.assignee} size={42} />
              <div className="min-w-0">
                <div className="font-semibold text-sm">
                  {task.assignee?.FirstName} {task.assignee?.LastName}
                </div>
                <div className="text-xs text-slate-500">Assigned to</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar user={task.linkedStudent} size={42} />
              <div className="min-w-0">
                <div className="font-semibold text-sm">
                  {task.linkedStudent?.FirstName} {task.linkedStudent?.LastName}
                </div>
                <div className="text-xs text-slate-500">Mention student</div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100">
            <div className="text-sm font-semibold mb-3">Attachments</div>

            {/* {files.length > 0 ? (
              <div className="space-y-3">
                {files.map((file, i) => {
                  const url = file.path;
                  return (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl border hover:bg-slate-50"
                    >
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Paperclip size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {file.filename}
                        </div>
                        <div className="text-xs text-slate-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-indigo-600">
                        View
                      </span>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-slate-500">No attachments</div>
              
            )} */}

            {files.length === 0 ? (
              <div className="text-sm text-slate-600">No attachments</div>
            ) : (
              <div className="space-y-2">
                {files.map((file, index) => {
                  const rawPath = file?.path || file?.url || "";
                  const cleanPath = rawPath.replace(/\\/g, "/");
                  const fileUrl = cleanPath || "#";

                  const name =
                    file?.filename || file?.name || `File ${index + 1}`;
                  const sizeKb =
                    typeof file?.size === "number"
                      ? `${(file.size / 1024).toFixed(1)} KB`
                      : "";

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition min-w-0"
                    >
                      <div className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center shrink-0">
                        {isImage(file) ? (
                          <img
                            src={fileUrl}
                            alt={name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-600">
                            <Paperclip size={18} />
                            <span className="text-[10px] font-semibold mt-1">
                              FILE
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {name}
                        </div>
                        <div className="text-xs text-slate-500">{sizeKb}</div>
                      </div>

                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        View
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100">
            <TaskComments taskId={task.id} />
          </div>
          {/* Activity */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100">
            <TaskActivity taskId={task.id} />
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="bg-white border-t px-4 py-4 sm:px-6">
          <button
            onClick={onClose}
            className="w-full h-11 rounded-xl border bg-white hover:bg-slate-100 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDrawer;
