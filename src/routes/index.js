import { lazy } from "react";
import Students from "../pages/Students";
import Applications from "../pages/Applications";
import Wallet from "../pages/Wallet";
import CommissionPayment from "../pages/CommissionPayment";
import Enquiries from "../pages/Enquiries";
import StudentEditProfile from "../components/Students/StudentEditProfile";
import Programs from "../pages/Programs";
import Branch from "../components/Branch/Branch";
import Country from "../components/Country/Country";
import UserManagement from "../pages/UserManagement";
import ArchiveStudentTable from "../components/Students/ArchiveStudentTable";
import PaymentStatus from "../components/Students/PaymentStatus";
import Task from "../pages/Task";
import Leads from "../pages/Leads";
import EditLeads from "../components/Leads/EditLeads";
import Profile from "../components/Profile";
import Notification from "../pages/Notification";
import Notice from "../components/Notice/Notice";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Modals = lazy(() => import("../pages/Modals"));
const Tables = lazy(() => import("../pages/Tables"));
const Page404 = lazy(() => import("../pages/404"));
const Blank = lazy(() => import("../pages/Blank"));

const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/students",
    component: Students,
  },
  {
    path: "/archive-student",
    component: ArchiveStudentTable,
  },
  {
    path: "/user-management",
    component: UserManagement,
  },
  {
    path: "/task",
    component: Task,
  },
  {
    path: "/editprofile/:id",
    component: StudentEditProfile,
  },
  {
    path: "/editLeads/:id",
    component: EditLeads,
  },
  {
    path: "/applications",
    component: Applications,
  },
  {
    path: "/programs",
    component: Programs,
  },
  {
    path: "/country",
    component: Country,
  },
  {
    path: "/branch",
    component: Branch,
  },
  {
    path: `/payments/:status`,
    component: PaymentStatus,
  },
  {
    path: "/leads",
    component: Leads,
  },
  {
    path: "/wallet",
    component: Wallet,
  },
  {
    path: "/commission-payments",
    component: CommissionPayment,
  },
  {
    path: "/manage-enquiries",
    component: Enquiries,
  },
  {
    path: "/notice",
    component: Notice,
  },
  {
    path: "/profile",
    component: Profile,
  },
  {
    path: "/notification",
    component: Notification,
  },
  {
    path: "/modals",
    component: Modals,
  },
  {
    path: "/tables",
    component: Tables,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/blank",
    component: Blank,
  },
];

export default routes;
