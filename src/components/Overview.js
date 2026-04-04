// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
// import { FaBell } from "react-icons/fa";
// import { useGetUserOverviewQuery } from "../features/auth/auth";
// import { useEffect, useState } from "react";
// import { useGetTaskOverviewQuery } from "../features/task/task";

// const pieData = [
//   { name: "File Open", value: 38, color: "#ef4444" },
//   { name: "Application Submitted", value: 64, color: "#10b981" },
//   { name: "Interview Date", value: 96, color: "#8b5cf6" },
//   { name: "Offer Received", value: 96, color: "#06b6d4" },
//   { name: "LOA Received", value: 64, color: "#94c5a7" },
//   { name: "Visa Applied", value: 38, color: "#4d2525" },
//   { name: "Visa Received", value: 38, color: "#17073b" },
//   { name: "Rejected", value: 38, color: "#9b1e5d" },
// ];

// const taskData = [
//   { label: "Open", value: 30 },
//   { label: "In Progress", value: 50 },
//   { label: "Waiting", value: 40 },
//   { label: "Review", value: 60 },
//   { label: "Completed", value: 80 },
// ];

// const Overview = () => {
//   const branch = localStorage.getItem("branch");
//   const role = localStorage.getItem("role");
//   const userId = localStorage.getItem("userId");
//   const [students, setStudents] = useState("");
//   const { data, isLoading, isError, error } = useGetUserOverviewQuery({
//     Branch: branch,
//     Role: role,
//   });

//   useEffect(() => {
//     if (isError) {
//       console.error("Error fetching consultations:", error);
//     } else if (!isLoading && data?.data) {
//       setStudents(data.data);
//     }
//   }, [data, isLoading, isError, error]);

//   console.log("students", students);

//   const [tasks, setTasks] = useState("");

//   const {
//     data: overviewRes,
//     isLoading: isTaskLoading,
//     isError: isTaskError,
//     error: taskError,
//   } = useGetTaskOverviewQuery({
//     branch: branch,
//     assignedTo_id: userId,
//   });

//   useEffect(() => {
//     if (isTaskError) {
//       console.error("Error fetching consultations:", taskError);
//     } else if (!isTaskLoading && overviewRes?.data) {
//       setTasks(overviewRes.data);
//     }
//   }, [overviewRes, isTaskLoading, isTaskError, taskError]);
//   console.log("overviewRes", overviewRes);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mt-8">
//       {/* Student Overview */}
//       <div className="bg-white rounded-2xl shadow-sm border p-5">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-sm font-semibold text-slate-700">
//             Student Overview
//           </h2>
//           <span className="text-gray-400 cursor-pointer">•••</span>
//         </div>

//         <div className="flex flex-col sm:flex-row items-center gap-4">
//           <div className="w-32 h-32">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   innerRadius={40}
//                   outerRadius={60}
//                   paddingAngle={3}
//                   dataKey="value"
//                   aria-label="Student Overview Chart"
//                 >
//                   {pieData.map((entry) => (
//                     <Cell key={`cell-${entry.name}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="flex flex-col gap-2 text-sm">
//             {pieData.map((item) => (
//               <div key={item.name} className="flex items-center gap-2">
//                 <span
//                   className="w-3 h-3 rounded-full"
//                   style={{ backgroundColor: item.color }}
//                 ></span>
//                 <span className="text-slate-600">
//                   {item.value} {item.name}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Tasks Overview */}
//       <div className="bg-white rounded-2xl shadow-sm border p-5">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-sm font-semibold text-slate-700">
//             Tasks Overview
//           </h2>
//           <span className="text-gray-400 cursor-pointer">•••</span>
//         </div>

//         <div className="flex items-end justify-between h-40 mt-20 gap-3">
//           {taskData.map((item) => (
//             <div key={item.label} className="flex flex-col items-center gap-2">
//               <div
//                 className="w-12 rounded bg-blue-500"
//                 style={{ height: `${item.value}px` }}
//               ></div>
//               <span className="text-xs text-slate-500">{item.label}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Notice */}

//       {/* <div className="bg-white rounded-2xl shadow-sm border p-5">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-sm font-semibold text-slate-700">
//             Notice from Head Office
//           </h2>
//           <span className="text-gray-400 cursor-pointer">•••</span>
//         </div>

//         <div className="flex flex-col gap-4">
//           <div className="flex items-start gap-3">
//             <div className="bg-red-100 text-red-600 p-2 rounded-full">
//               <FaBell />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-slate-700">
//                 Meeting Scheduled
//               </p>
//               <p className="text-xs text-slate-500">
//                 Abu Australian University <br />
//                 December 16, 2025
//               </p>
//             </div>
//           </div>

//           <div className="flex items-start gap-3">
//             <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
//               ⚠️
//             </div>
//             <div>
//               <p className="text-sm font-medium text-slate-700">
//                 Important Updates
//               </p>
//               <p className="text-xs text-slate-500">2026 Program Fees</p>
//             </div>
//           </div>
//         </div>
//       </div> */}
//     </div>
//   );
// };

// export default Overview;

import { PieChart, Pie, Cell } from "recharts";
import { useGetUserOverviewQuery } from "../features/auth/auth";
import { useGetTaskOverviewQuery } from "../features/task/task";
import { useEffect, useMemo, useState } from "react";
import { FaBell } from "react-icons/fa";

const STUDENT_OVERVIEW_ORDER = [
  { keys: ["File Opened", "File Open"], label: "File Open", color: "#ef4444" },
  {
    keys: ["Application Submitted"],
    label: "Application Submitted",
    color: "#10b981",
  },
  {
    keys: ["Interview Date Received", "Interview Date"],
    label: "Interview Date Received",
    color: "#8b5cf6",
  },
  { keys: ["Offer Received"], label: "Offer Received", color: "#06b6d4" },
  { keys: ["LOA Received"], label: "LOA Received", color: "#94c5a7" },
  { keys: ["Visa Applied"], label: "Visa Applied", color: "#4d2525" },
  { keys: ["Visa Received"], label: "Visa Received", color: "#17073b" },
  { keys: ["Rejected"], label: "Rejected", color: "#9b1e5d" },
];

const TASK_OVERVIEW_ORDER = [
  { keys: ["OPEN", "Open"], label: "Open" },
  { keys: ["IN_PROGRESS", "InProgress", "IN PROGRESS"], label: "InProgress" },
  { keys: ["BLOCKED", "Blocked"], label: "Blocked" },
  { keys: ["COMPLETED", "Completed"], label: "Completed" },
];

function getFirstNumericValue(obj, keys) {
  for (const k of keys) {
    const v = obj?.[k];
    if (v === 0 || v === "0") return 0;
    if (v) return Number(v) || 0;
  }
  return 0;
}

const Overview = () => {
  const branch = localStorage.getItem("branch");
  const userId = localStorage.getItem("userId");

  const [students, setStudents] = useState({});
  const [tasks, setTasks] = useState({});

  // 🔹 Student API
  const { data, isLoading, isError, error } = useGetUserOverviewQuery({
    Branch: branch,
    Role: "student",
  });

  useEffect(() => {
    if (isError) {
      console.error("Student overview error:", error);
    } else if (!isLoading && data?.data) {
      setStudents(data.data);
    }
  }, [data, isLoading, isError, error]);

  // 🔹 Task API
  const {
    data: overviewRes,
    isLoading: isTaskLoading,
    isError: isTaskError,
    error: taskError,
  } = useGetTaskOverviewQuery({
    branch: branch,
    assignedTo_id: userId,
  });

  useEffect(() => {
    if (isTaskError) {
      console.error("Task overview error:", taskError);
    } else if (!isTaskLoading && overviewRes?.data) {
      setTasks(overviewRes.data);
    }
  }, [overviewRes, isTaskLoading, isTaskError, taskError]);

  const studentPieData = useMemo(() => {
    const raw = students || {};

    return STUDENT_OVERVIEW_ORDER.map((s) => ({
      key: s.label,
      name: s.label,
      value: getFirstNumericValue(raw, s.keys),
      color: s.color,
    }));
  }, [students]);

  const studentChartData = useMemo(() => {
    const visibleData = studentPieData.filter((d) => d.value > 0);
    if (visibleData.length) return visibleData;

    return [
      {
        key: "no-data",
        name: "No Data",
        value: 1,
        color: "#e2e8f0",
      },
    ];
  }, [studentPieData]);

  const taskOverviewData = useMemo(() => {
    const raw = tasks || {};

    return TASK_OVERVIEW_ORDER.map((s) => ({
      key: s.label,
      label: s.label,
      value: getFirstNumericValue(raw, s.keys),
    }));
  }, [tasks]);

  const maxTaskValue = useMemo(() => {
    return taskOverviewData.reduce((m, d) => Math.max(m, d.value), 0);
  }, [taskOverviewData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 items-stretch">
      {/* ================= Student Overview ================= */}
      <div className="bg-white rounded-none border border-slate-200 p-4 sm:p-5 min-h-[300px]">
        <div className="flex justify-between items-center mb-4 sm:mb-5">
          <h2 className="text-xs sm:text-sm font-semibold text-slate-800">
            Student Overview
          </h2>
          <span className="text-gray-400 cursor-pointer">•••</span>
        </div>

        {isLoading ? (
          <div className="h-[120px] animate-pulse rounded-lg bg-slate-100" />
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-5">
            {/* Chart */}
            <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[128px] md:h-[128px] shrink-0 mx-auto sm:mx-0">
              <PieChart width={128} height={128}>
                <Pie
                  data={studentChartData}
                  cx={64}
                  cy={64}
                  innerRadius={36}
                  outerRadius={54}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {studentChartData.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm leading-relaxed">
              {STUDENT_OVERVIEW_ORDER.map((s) => {
                const value = getFirstNumericValue(students, s.keys);

                return (
                  <div key={s.label} className="flex items-center gap-2">
                    <span
                      className="w-2 sm:w-3 h-2 sm:h-3 rounded-full shrink-0"
                      style={{ backgroundColor: s.color }}
                    ></span>
                    <span className="text-slate-800 font-medium truncate">
                      {value} {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ================= Task Overview ================= */}
      <div className="bg-white rounded-none border border-slate-200 p-4 sm:p-5 min-h-[300px]">
        <div className="flex justify-between items-center mb-4 sm:mb-5">
          <h2 className="text-xs sm:text-sm font-semibold text-slate-800">
            Tasks Overview
          </h2>
          <span className="text-gray-400 cursor-pointer">•••</span>
        </div>

        {isTaskLoading ? (
          <div className="h-40 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          <div className="flex items-end justify-between h-32 sm:h-40 px-2 sm:px-4 pt-4 sm:pt-6 mt-24 sm:mt-32 gap-1">
            {taskOverviewData.map((item) => {
              const height =
                maxTaskValue > 0
                  ? Math.max(Math.round((item.value / maxTaskValue) * 120), 18)
                  : 18;

              return (
                <div
                  key={item.key}
                  className="flex flex-col items-center gap-1 sm:gap-2 flex-1"
                >
                  <div
                    className="w-8 sm:w-10 md:w-12 rounded bg-blue-500"
                    style={{ height: `${height}px` }}
                    title={`${item.value}`}
                  />
                  <span className="text-xs sm:text-sm text-slate-600 text-center line-clamp-1">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
