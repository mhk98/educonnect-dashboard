const id = localStorage.getItem("userId");
const routes = [
  {
    path: "/app/dashboard",
    icon: "HomeIcon",
    name: "Dashboard",
    roles: ["admin", "employee", "superAdmin"],
  },

  // ✅ Users = People icon
  {
    path: "/app/user-management",
    icon: "PeopleIcon",
    name: "User Management",
    roles: ["superAdmin"],
  },

  // ✅ Task = Edit/Pencil
  {
    path: "/app/task",
    icon: "EditIcon",
    name: "Task",
    roles: ["admin", "employee", "superAdmin"],
  },

  // ✅ Students = Person
  {
    path: "/app/students",
    icon: "OutlinePersonIcon",
    name: "Students",
    roles: ["admin", "employee", "superAdmin"],
  },
  {
    path: `/app/editprofile/${id}`,
    icon: "OutlinePersonIcon",
    name: "Students",
    roles: ["student"],
  },

  // ✅ Applications = Forms/Document
  {
    path: "/app/applications",
    icon: "FormsIcon",
    name: "Applications",
    roles: ["admin", "employee", "superAdmin"],
  },

  // ✅ Programs = Pages/List
  {
    path: "/app/programs",
    icon: "PagesIcon",
    name: "Add Programs",
    roles: ["superAdmin"],
  },
  {
    path: "/app/country",
    icon: "PagesIcon",
    name: "Country",
    roles: ["superAdmin"],
  },
  {
    path: "/app/branch",
    icon: "PagesIcon",
    name: "Branch",
    roles: ["superAdmin"],
  },

  // ✅ Leads = Pages (or Forms). If you have "TargetIcon" / "SearchIcon" use that.
  {
    path: "/app/leads",
    icon: "PagesIcon",
    name: "Leads",
    roles: ["employee", "admin", "superAdmin"],
  },

  // ✅ Wallet = Money
  {
    path: "/app/wallet",
    icon: "MoneyIcon",
    name: "Wallet",
    roles: ["admin", "superAdmin"],
  },

  // ✅ Commission Payments = Charts/Analytics
  {
    path: "/app/commission-payments",
    icon: "ChartsIcon",
    name: "Commission Payments",
    roles: ["admin", "superAdmin"],
  },

  // ✅ Enquiries = Chat/Message
  {
    path: "/app/manage-enquiries",
    icon: "ChatIcon",
    name: "Manage Enquiries",
    roles: ["admin", "superAdmin", "employee"],
  },

  {
    path: "/app/notice",
    icon: "BellIcon",
    name: "Notice",
    roles: ["admin", "superAdmin"],
  },
  {
    path: "/app/notification",
    icon: "BellIcon",
    name: "Notification",
    roles: ["admin", "superAdmin", "employee", "student"],
  },

  {
    path: "/app/profile",
    icon: "OutlinePersonIcon",
    name: "Profile",
    roles: ["admin", "superAdmin", "employee", "student"],
  },
];

export default routes;
