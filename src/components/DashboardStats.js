import { User2Icon } from "lucide-react";
import { BiTask } from "react-icons/bi";
import { FaWallet, FaChartLine, FaUsers } from "react-icons/fa";
import { MdFollowTheSigns } from "react-icons/md";
import { useGetAllUserQuery } from "../features/auth/auth";
import { useGetAllTaskQuery } from "../features/task/task";
import { useGetAllConsultationQuery } from "../features/consultation/consultation";

// const stats = [
//   {
//     title: "Total",
//     value: "244",
//     icon: <User2Icon />,
//     color: "bg-blue-100 text-blue-600",
//     desc: "Total Students",
//   },
//   {
//     title: "Total Tasks",
//     value: "44",
//     icon: <BiTask />,
//     color: "bg-green-100 text-green-600",
//     desc: "Completed Task",
//   },
//   {
//     title: "Total Lead",
//     value: "349",
//     icon: <FaChartLine />,
//     color: "bg-indigo-100 text-indigo-600",
//     desc: "All Leads",
//   },
//   {
//     title: "Follow Ups",
//     value: "7",
//     icon: <FaWallet />,
//     color: "bg-yellow-100 text-yellow-600",
//     desc: "Remaining Leads",
//   },
// ];

const stats = [
  {
    title: "Total Students",
    value: "244",
    icon: <FaUsers />, // ðŸ‘¥ multiple users
    color: "bg-blue-100 text-blue-600",
    desc: "All Students",
  },
  {
    title: "Total Tasks",
    value: "44",
    icon: <BiTask />, // ðŸ“‹ tasks
    color: "bg-green-100 text-green-600",
    desc: "Completed Tasks",
  },
  {
    title: "Total Leads",
    value: "349",
    icon: <FaChartLine />, // ðŸ“ˆ leads growth
    color: "bg-indigo-100 text-indigo-600",
    desc: "All Leads",
  },
  {
    title: "Follow Ups",
    value: "7",
    icon: <MdFollowTheSigns />, // ðŸ” follow up
    color: "bg-yellow-100 text-yellow-600",
    desc: "Pending Follow-ups",
  },
];

const DashboardStats = () => {
  const userId = localStorage.getItem("userId");

  const { data, isLoading } = useGetAllUserQuery({ Role: "student" });
  const {
    data: taskData,
    isLoading: isTaskLoading,
    isFetching,
  } = useGetAllTaskQuery({ assignedTo_id: userId });

  const formatDate = (date) => new Date(date).toLocaleDateString("en-CA");

  const today = formatDate(new Date());

  const todayTask = taskData?.data?.filter(
    (item) =>
      item.updatedAt &&
      formatDate(item.updatedAt) === today &&
      item.status === "COMPLETED",
  );

  const { data: todayAppointment, isLoading: isAppointmentLoading } =
    useGetAllConsultationQuery({ user_id: userId, appointmentDate: today });

  const { data: totalLead, isLoading: isTotalLeadLoading } =
    useGetAllConsultationQuery({ user_id: userId });

  const { data: openLead, isLoading: isOpenLoading } =
    useGetAllConsultationQuery({
      user_id: userId,
      status: "Open Case",
    });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div
        className="group bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100
          hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
      >
        {/* Top */}
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Total</p>

          <div
            className={`p-2 sm:p-3 rounded-xl bg-blue-100 text-blue-600 text-sm sm:text-base
              group-hover:scale-110 transition flex-shrink-0`}
          >
            <FaUsers />
          </div>
        </div>

        {/* Value */}
        <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          {data?.meta?.total}
        </h2>

        {/* Optional growth indicator */}
        <p className="text-xs text-slate-400 mt-1">Total Students</p>
      </div>
      <div
        className="group bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
      >
        {/* Top */}
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Total Tasks
          </p>

          <div
            className={`p-2 sm:p-3 rounded-xl bg-green-100 text-green-600 text-sm sm:text-base
              group-hover:scale-110 transition flex-shrink-0`}
          >
            <BiTask />
          </div>
        </div>

        {/* Value */}
        <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          {taskData?.meta?.total}
        </h2>

        {/* Optional growth indicator */}
        <p className="text-xs text-slate-400 mt-1">
          Completed Today {todayTask?.length}
        </p>
      </div>
      <div
        className="group bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
      >
        {/* Top */}
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Total Leads
          </p>

          <div
            className={`p-2 sm:p-3 rounded-xl bg-indigo-100 text-indigo-600 text-sm sm:text-base
              group-hover:scale-110 transition flex-shrink-0`}
          >
            <FaChartLine />
          </div>
        </div>

        {/* Value */}
        <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          {totalLead?.meta?.total}
        </h2>

        {/* Optional growth indicator */}
        <p className="text-xs text-slate-400 mt-1">
          Open Case {openLead?.meta?.total}
        </p>
      </div>
      <div
        className="group bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
      >
        {/* Top */}
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Follow Ups
          </p>

          <div
            className={`p-2 sm:p-3 rounded-xl bg-yellow-100 text-yellow-600 text-sm sm:text-base
              group-hover:scale-110 transition flex-shrink-0`}
          >
            <MdFollowTheSigns />
          </div>
        </div>

        {/* Value */}
        <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          {todayAppointment?.meta?.total}
        </h2>

        {/* Optional growth indicator */}
        <p className="text-xs text-slate-400 mt-1">Remaining</p>
      </div>
    </div>
  );
};

export default DashboardStats;
