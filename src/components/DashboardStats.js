import { BiTask } from "react-icons/bi";
import { FaChartLine, FaUsers } from "react-icons/fa";
import { MdFollowTheSigns } from "react-icons/md";
import { useGetAllUserQuery } from "../features/auth/auth";
import { useGetAllTaskQuery } from "../features/task/task";
import { useGetAllConsultationQuery } from "../features/consultation/consultation";

const StatSkeleton = () => (
  <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
    <div className="mb-4 flex items-center justify-between">
      <div className="h-3 w-20 animate-pulse rounded-full bg-gray-200" />
      <div className="h-9 w-9 animate-pulse rounded-xl bg-blue-100" />
    </div>
    <div className="mb-2 h-7 w-16 animate-pulse rounded-lg bg-gray-200" />
    <div className="h-2.5 w-24 animate-pulse rounded-full bg-gray-100" />
  </div>
);

const DashboardStats = ({ selectedBranch = "" }) => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const branch = localStorage.getItem("branch");

  const formatDate = (date) => new Date(date).toLocaleDateString("en-CA");
  const today = formatDate(new Date());

  // ── Total Students ──────────────────────────────────────────
  const studentParams =
    role === "superAdmin"
      ? { roleMode: "onlyStudent", Branch: selectedBranch || undefined, Profile: "active" }
      : { roleMode: "onlyStudent", Branch: branch, Profile: "active" };

  const { data: studentData, isLoading: isStudentLoading } = useGetAllUserQuery(studentParams);

  // ── Total Tasks ──────────────────────────────────────────────
  const taskParams =
    role === "superAdmin"
      ? { branch: selectedBranch || undefined }
      : role === "admin"
        ? { branch }
        : { assignedTo_id: userId };

  const { data: taskData, isLoading: isTaskLoading } = useGetAllTaskQuery(taskParams);

  const todayTask = taskData?.data?.filter(
    (item) => item.updatedAt && formatDate(item.updatedAt) === today && item.status === "COMPLETED",
  );

  // ── Total Leads ──────────────────────────────────────────────
  const leadParams =
    role === "superAdmin"
      ? { role: "superAdmin" }
      : role === "admin"
        ? { location: branch, role: "admin" }
        : { user_id: userId, location: branch, role: "employee" };

  const { data: totalLead, isLoading: isTotalLeadLoading } = useGetAllConsultationQuery(leadParams);

  const openLeadParams =
    role === "superAdmin"
      ? { status: "Open Case", role: "superAdmin" }
      : role === "admin"
        ? { status: "Open Case", location: branch, role: "admin" }
        : { status: "Open Case", user_id: userId, location: branch, role: "employee" };

  const { data: openLead, isLoading: isOpenLoading } = useGetAllConsultationQuery(openLeadParams);

  // ── Follow Ups (today's appointments) ───────────────────────
  const followUpParams =
    role === "superAdmin"
      ? { appointmentDate: today }
      : role === "admin"
        ? { appointmentDate: today, location: branch }
        : { user_id: userId, appointmentDate: today, location: branch };

  const { data: todayAppointment, isLoading: isAppointmentLoading } =
    useGetAllConsultationQuery(followUpParams);

  const anyLoading =
    isStudentLoading || isTaskLoading || isAppointmentLoading || isTotalLeadLoading || isOpenLoading;

  if (anyLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)}
      </div>
    );
  }

  const statCards = [
    {
      label: "Total",
      sub: "Total Students",
      value: studentData?.meta?.total ?? 0,
      icon: <FaUsers />,
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Tasks",
      sub: `Completed Today ${todayTask?.length ?? 0}`,
      value: taskData?.meta?.total ?? 0,
      icon: <BiTask />,
      iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Total Leads",
      sub: `Open Case ${openLead?.meta?.total ?? 0}`,
      value: totalLead?.meta?.total ?? 0,
      icon: <FaChartLine />,
      iconBg: "bg-indigo-100 text-indigo-600",
    },
    {
      label: "Follow Ups",
      sub: "Remaining",
      value: todayAppointment?.meta?.total ?? 0,
      icon: <MdFollowTheSigns />,
      iconBg: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statCards.map((card) => (
        <div
          key={card.label}
          className="group bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-slate-500 font-medium">{card.label}</p>
            <div className={`p-2 sm:p-3 rounded-xl text-sm sm:text-base group-hover:scale-110 transition flex-shrink-0 ${card.iconBg}`}>
              {card.icon}
            </div>
          </div>
          <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            {card.value}
          </h2>
          <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
