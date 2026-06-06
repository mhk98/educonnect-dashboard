import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Button,
} from "@windmill/react-ui";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactSelect from "react-select";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import TaskCard from "../components/Task/TaskCard";
import TaskDrawer from "../components/Task/TaskDrawer";
import OverviewDonut from "../components/Task/OverviewDonut";
import { useGetAllBranchQuery } from "../features/branch/branch";

import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetAllTaskQuery,
  useGetTaskOverviewQuery,
  useUpdateTaskMutation,
} from "../features/task/task";

/* ================= CONSTANTS ================= */

const STATUSES = [
  {
    key: "OPEN",
    title: "Open",
    headerBg: "bg-brandBlue text-white",
    columnBg: "bg-blue-100",
    overBg: "bg-blue-200",
  },
  {
    key: "IN_PROGRESS",
    title: "In Progress",
    headerBg: "bg-orange-100 text-orange-800 border border-orange-200",
    columnBg: "bg-orange-100",
    overBg: "bg-orange-200",
  },
  {
    key: "COMPLETED",
    title: "Completed",
    headerBg: "bg-green-100 text-green-800 border border-green-200",
    columnBg: "bg-green-100",
    overBg: "bg-green-200",
  },
  {
    key: "BLOCKED",
    title: "Blocked",
    headerBg: "bg-red-100 text-red-800 border border-red-200",
    columnBg: "bg-red-100",
    overBg: "bg-red-200",
  },
];

// // ছোট debounce hook (search typing smooth রাখতে)
function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const KANBAN_LIMIT = 100;
/* ================= COLUMN ================= */

function Column({ col, tasks, children }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `col-${col.key}`,
    data: { status: col.key },
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl p-2 transition-colors ${
        isOver ? col.overBg : col.columnBg
      }`}
      style={{ minHeight: "500px" }}
    >
      <div
        className={`rounded-lg ${col.headerBg} px-3 py-2 flex justify-between`}
      >
        <span className="text-sm font-semibold">{col.title}</span>
        <span className="rounded bg-white px-2 text-xs text-gray-700">
          {tasks.length}
        </span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/* ================= MAIN ================= */

export default function Task() {
  const user_id = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const branchLS = localStorage.getItem("branch") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: branchData,
    isLoading: branchLoading,
    isError: branchError,
  } = useGetAllBranchQuery();

  const [, setAdmins] = useState([]);
  const [students, setStudents] = useState([]);
  const [, setBranchStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);

  const [editFiles, setEditFiles] = useState([]);

  const handleEditFileChange = (e) => {
    setEditFiles(Array.from(e.target.files));
  };

  const first_Name = localStorage.getItem("FirstName");
  const last_Name = localStorage.getItem("LastName");

  const [selectedTask, setSelectedTask] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  //   // ✅ Filters (board + donut এর জন্য)
  const [filters, setFilters] = useState({
    searchTerm: "",
    // superAdmin সব branch দেখবে (default: All), বাকিরা নিজের branch
    branch: role === "superAdmin" ? "" : branchLS,
    assignedTo_id: "",
    user_id: "",
  });

  const debouncedSearchTerm = useDebouncedValue(filters.searchTerm, 400);

  /* ---------- view ---------- */
  const [view, setView] = useState("kanban"); // kanban | list

  /* ---------- kanban pagination ---------- */
  const [page, setPage] = useState(1);
  const [allTasks, setAllTasks] = useState([]);

  /* ---------- list pagination ---------- */
  /* ---------- modals ---------- */
  const [editTask, setEditTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  /* ---------- dnd ---------- */
  const [activeTask, setActiveTask] = useState(null);

  /* ---------- form ---------- */
  const { register, handleSubmit, reset, control } = useForm();

  /* ---------- api ---------- */
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  /* ================= QUERIES ================= */

  const kanbanQuery = useMemo(() => {
    // empty key গেলে query string clean থাকে
    const q = {
      branch: filters.branch || undefined,
      assignedTo_id: filters.assignedTo_id || undefined,
      user_id: filters.user_id || undefined,
      searchTerm: debouncedSearchTerm || undefined,
      page,
      limit: KANBAN_LIMIT,
    };
    return q;
  }, [
    page,
    filters.branch,
    filters.assignedTo_id,
    filters.user_id,
    debouncedSearchTerm,
  ]);

  const listQuery = useMemo(() => {
    // empty key গেলে query string clean থাকে
    const q = {
      branch: filters.branch || undefined,
      assignedTo_id: filters.assignedTo_id || undefined,
      user_id: filters.user_id || undefined,
      searchTerm: debouncedSearchTerm || undefined,
      page: currentPage,
      limit: itemsPerPage,
    };
    return q;
  }, [
    currentPage,
    filters.branch,
    filters.assignedTo_id,
    filters.user_id,
    debouncedSearchTerm,
  ]);

  const {
    data: kanbanRes,
    isLoading,
    isFetching,
  } = useGetAllTaskQuery(kanbanQuery);
  const { data: listRes } = useGetAllTaskQuery(listQuery);
  const { data: overviewRes } = useGetTaskOverviewQuery(listQuery);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://backend.eaconsultancy.org/api/v1/user/student",
  //       );
  //       const allUsers = response.data.data;

  //       const allStudent = allUsers.filter(
  //         (user) => user.Role?.toLowerCase() === "student",
  //       );

  //       const branchStudents = allUsers.filter(
  //         (user) =>
  //           user.Role?.toLowerCase() === "student" && user.Branch === branchLS,
  //       );

  //       const excludeBranchStudents = allUsers.filter(
  //         (user) => user.Role?.toLowerCase() !== "student",
  //       );
  //       setUsers(excludeBranchStudents);
  //       setBranchStudents(branchStudents);
  //       setStudents(allStudent);

  //       const filteredAdmins = allUsers.filter(
  //         (user) =>
  //           (user.Role?.toLowerCase() !== "student" &&
  //             user.Role?.toLowerCase() === "superadmin") ||
  //           (user.Role?.toLowerCase() === "admin" &&
  //             user.Branch === branchLS) ||
  //           (user.Role?.toLowerCase() === "employee" &&
  //             user.Branch === branchLS),
  //       );

  //       setAdmins(filteredAdmins);
  //       // setSuperAdmins(
  //       //   allUsers.filter((user) => user.Role?.toLowerCase() !== "student"),
  //       // );
  //     } catch (err) {
  //       console.error("Error fetching users:", err);
  //     }
  //   };
  //   fetchUsers();
  // }, [branchLS]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "https://backend.eaconsultancy.org/api/v1/user/student",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        const allUsers = result?.data || [];

        // ✅ All students
        const allStudents = allUsers.filter(
          (user) => user.Role?.toLowerCase() === "student",
        );

        // ✅ Branch students
        const branchStudents = allUsers.filter(
          (user) =>
            user.Role?.toLowerCase() === "student" && user.Branch === branchLS,
        );

        // ✅ Non-students
        const nonStudents = allUsers.filter(
          (user) => user.Role?.toLowerCase() !== "student",
        );

        // ✅ Admin / Employee / SuperAdmin (branch-aware)
        const filteredAdmins = allUsers.filter((user) => {
          const role = user.Role?.toLowerCase();
          const branch = user.Branch;

          if (role === "superadmin") return true;
          if (role === "admin" && branch === branchLS) return true;
          if (role === "employee" && branch === branchLS) return true;

          return false;
        });

        setUsers(nonStudents);
        setBranchStudents(branchStudents);
        setStudents(allStudents);
        setAdmins(filteredAdmins);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [branchLS]);

  /* ================= ACCUMULATE (KANBAN) ================= */

  useEffect(() => {
    if (!kanbanRes?.data) return;
    setAllTasks((prev) => {
      if (page === 1) return kanbanRes.data;
      // ✅ ফিল্টার করে ডুপ্লিকেট এড়ানো (polling এর কারণে হতে পারে)
      const existingIds = new Set(prev.map((t) => t.id));
      const newTasks = kanbanRes.data.filter((t) => !existingIds.has(t.id));
      return [...prev, ...newTasks];
    });
  }, [kanbanRes, page]);

  /* ================= GROUP ================= */

  const grouped = useMemo(() => {
    const g = Object.fromEntries(STATUSES.map((s) => [s.key, []]));
    allTasks.forEach((t) => g[t.status]?.push(t));
    return g;
  }, [allTasks]);

  /* ================= DND ================= */

  const findTask = (id) => {
    if (!id) return null;
    // id থেকে prefix 'task-' বাদ দিয়ে শুধু ID অংশটুকু নেওয়া
    const cleanId = String(id).replace("task-", "");
    // Number হিসেবে তুলনা করা যাতে টাইপ mismatch না হয়
    return allTasks.find((t) => Number(t.id) === Number(cleanId));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const onDragStart = (e) => {
    const task = findTask(e.active.id);
    setActiveTask(task);
  };

  // const onDragEnd = async ({ active, over }) => {
  //   setActiveTask(null);
  //   if (!over) return;

  //   const task = findTask(active.id);
  //   if (!task) return;

  //   const newStatus = over.id.replace("col-", "");
  //   if (newStatus === task.status) return;

  //   await updateTask({ id: task.id, data: { status: newStatus } });
  //   toast.success("Status updated");

  //   setAllTasks((prev) =>
  //     prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)),
  //   );
  // };

  const onDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const task = findTask(active.id);
    if (!task) {
      console.warn("Dragged task not found:", active.id);
      return;
    }

    // ✅ স্ট্যাটাস খুঁজে পাওয়ার সবচেয়ে শক্তিশালী পদ্ধতি (ID parsing + Data fallback)
    let newStatus = null;
    const overId = String(over.id);

    if (overId.startsWith("col-")) {
      newStatus = overId.replace("col-", "");
    } else if (overId.startsWith("task-")) {
      // যদি অন্য কার্ডের উপর ড্রপ হয়, তবে সেই কার্ডের ডাটা বা আইডি থেকে স্ট্যাটাস বের করা
      newStatus = over.data?.current?.status;
      if (!newStatus) {
        const overTaskId = overId.replace("task-", "");
        const overTask = allTasks.find((t) => String(t.id) === overTaskId);
        newStatus = overTask?.status;
      }
    }

    // console.log("Drop Debug:", { overId, newStatus, currentStatus: task.status });

    if (!newStatus || newStatus === task.status) return;

    try {
      // ✅ ডাটা আপডেট করার আগে UI তে তাৎক্ষণিক পরিবর্তন (Optimistic UI)
      setAllTasks((prev) =>
        prev.map((t) =>
          Number(t.id) === Number(task.id) ? { ...t, status: newStatus } : t,
        ),
      );

      // ✅ ব্যাকেন্ড যেহেতু multipart/form-data আশা করে (onEdit ও FormData পাঠাচ্ছে)
      // এবং PUT রিকোয়েস্টে সব ডাটা পাঠানো নিরাপদ
      const formData = new FormData();
      formData.append("status", newStatus);
      formData.append("task", task.task);
      formData.append("priority", task.priority || "");
      formData.append("description", task.description || "");
      formData.append("branch", task.branch || "");
      if (task.dueDate) formData.append("dueDate", task.dueDate);

      const res = await updateTask({
        id: task.id,
        data: formData,
      }).unwrap();

      if (res) {
        toast.success("Status updated");
      }
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast.error("Failed to update status. Please try again.");

      // ✅ এরর হলে আগের অবস্থায় ফিরিয়ে নেওয়া
      setAllTasks((prev) =>
        prev.map((t) =>
          Number(t.id) === Number(task.id) ? { ...t, status: task.status } : t,
        ),
      );
    }
  };

  /* ================= CREATE ================= */

  const onCreate = async (form) => {
    const formData = new FormData();
    formData.append("id", form.assignedTo);
    formData.append("user_id", user_id);
    formData.append("assignor", `${first_Name} ${last_Name}`);
    formData.append("task", form.task);
    formData.append("branch", form.branch);
    formData.append("dueDate", form.dueDate);
    formData.append("student_id", form.linkedStudent);
    formData.append("priority", form.priority);
    formData.append("description", form.description);
    formData.append("comment", form.comment);
    // if (file) formData.append("file", file);
    if (files) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    console.log("formData", formData);
    try {
      const res = await createTask(formData);
      if (res.data?.success) {
        toast.success(res.data.message);
        reset();
        setFiles(null);
        // setIsModalOpen(false);
        document.getElementById("task_modal").close();
      } else {
        toast.error(res.error?.data?.message || "Failed. Please try again.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  const onEdit = async (form) => {
    try {
      const formData = new FormData();

      // basic fields
      formData.append("task", form.task);
      formData.append("description", form.description || "");
      formData.append("priority", form.priority || "");
      formData.append("status", form.status || "");
      formData.append("dueDate", form.dueDate || "");
      formData.append("branch", form.branch || "");

      // 🔥 new uploaded files (multiple)
      if (editFiles.length > 0) {
        editFiles.forEach((file) => {
          formData.append("files", file);
        });
      }

      await updateTask({
        id: editTask.id,
        data: formData,
      }).unwrap();

      toast.success("Task updated successfully");

      // reset
      setEditTask(null);
      setEditFiles([]);
      setPage(1);
      setAllTasks([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task");
    }
  };

  /* ================= DELETE ================= */

  const onDelete = async () => {
    await deleteTask(deleteTaskId);
    toast.success("Task deleted");
    setDeleteTaskId(null);
    setPage(1);
    setAllTasks([]);
  };

  /* ================= UI ================= */

  const studentOptions = students
    // role === "superAdmin" ? students : branchStudents
    .map((u) => ({
      value: u.id,
      label: `${u.FirstName} ${u.LastName}`,
      image: u.image,
    }));

  const userOptions =
    // (role === "superAdmin" ? users : admins)

    users.map((u) => ({
      value: u.id,
      label: `${u.FirstName} ${u.LastName}`,
      image: u.image,
    }));

  const CustomOption = ({ data, innerRef, innerProps }) => (
    <div
      ref={innerRef}
      {...innerProps}
      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
    >
      {data.image && (
        <img
          src={data.image}
          alt=""
          className="w-6 h-6 rounded-full object-cover"
        />
      )}
      <span className="text-sm">{data.label}</span>
    </div>
  );

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      branch: role === "superAdmin" ? "" : branchLS,
      assignedTo_id: "",
      user_id: "",
    });
  };

  const showMineAssigned = () => {
    // আমার কাছে assign করা tasks
    setFilters((p) => ({ ...p, assignedTo_id: user_id, user_id: "" }));
  };

  const showCreatedByMe = () => {
    // আমি create করেছি
    setFilters((p) => ({ ...p, user_id: user_id, assignedTo_id: "" }));
  };
  return (
    <div className="px-3 py-4 sm:p-4 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Task Management
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:flex">
          <button
            onClick={() => setView("kanban")}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              view === "kanban" ? "bg-black text-white" : "border"
            }`}
          >
            Board
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              view === "list" ? "bg-black text-white" : "border"
            }`}
          >
            List
          </button>
          <button
            // onClick={() => setAddOpen(true)}
            onClick={() => {
              document.getElementById("task_modal").showModal();
            }}
            className="px-3 py-2 bg-brandBlue hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* ✅ Filter Bar */}
      {role === "superAdmin" ? (
        <div className="max-w-7xl mx-auto mt-4 bg-white rounded-xl shadow-sm p-3 sm:p-4">
          <div className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-12 md:col-span-4">
              <label className="block text-xs text-gray-500 mb-1">Search</label>
              <input
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, searchTerm: e.target.value }))
                }
                placeholder="Search task / description / assignor..."
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="col-span-12 md:col-span-3">
              <label className="block text-xs text-gray-500 mb-1">Branch</label>
              <select
                value={filters.branch}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, branch: e.target.value }))
                }
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Branches</option>
                {branchLoading && <option disabled>Loading...</option>}
                {branchData?.data?.map((b) => {
                  const name = b.branch || b.Branch || b.name || "";
                  return (
                    <option key={b.id || name} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="col-span-12 md:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-2 md:flex md:justify-end">
              <button
                onClick={showMineAssigned}
                className={`px-3 py-2 rounded-md text-sm border ${
                  filters.assignedTo_id ? "bg-gray-900 text-white" : "bg-white"
                }`}
                type="button"
              >
                Assigned to me
              </button>

              <button
                onClick={showCreatedByMe}
                className={`px-3 py-2 rounded-md text-sm border ${
                  filters.user_id ? "bg-gray-900 text-white" : "bg-white"
                }`}
                type="button"
              >
                Created by me
              </button>

              <button
                onClick={resetFilters}
                className="px-3 py-2 rounded-md text-sm border bg-white"
                type="button"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            {isLoading || isFetching
              ? "Loading..."
              : `Showing ${kanbanRes?.data?.length} tasks`}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto mt-4 bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-12 gap-3 md:justify-between items-end">
            <div className="col-span-12 md:col-span-4">
              <label className="block text-xs text-gray-500 mb-1">Search</label>
              <input
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, searchTerm: e.target.value }))
                }
                placeholder="Search task / description / assignor..."
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="col-span-12 md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-2 md:flex md:justify-end">
              <button
                onClick={showMineAssigned}
                className={`px-3 py-2 rounded-md text-sm border ${
                  filters.assignedTo_id ? "bg-gray-900 text-white" : "bg-white"
                }`}
                type="button"
              >
                Assigned to me
              </button>

              <button
                onClick={showCreatedByMe}
                className={`px-3 py-2 rounded-md text-sm border ${
                  filters.user_id ? "bg-gray-900 text-white" : "bg-white"
                }`}
                type="button"
              >
                Created by me
              </button>

              <button
                onClick={resetFilters}
                className="px-3 py-2 rounded-md text-sm border bg-white"
                type="button"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            {isLoading || isFetching
              ? "Loading..."
              : `Showing ${kanbanRes?.data?.length} tasks`}
          </div>
        </div>
      )}
      {/* ================= KANBAN ================= */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mt-4">
          <div className="xl:col-span-9 min-w-0">
            <DndContext
              sensors={sensors}
              collisionDetection={rectIntersection}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            >
              <div className="flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
                {STATUSES.map((col) => (
                  <div
                    key={col.key}
                    className="w-72 flex-shrink-0 lg:w-auto lg:flex-shrink"
                  >
                    <Column col={col} tasks={grouped[col.key]}>
                      <SortableContext
                        items={grouped[col.key].map((t) => `task-${t.id}`)}
                        strategy={verticalListSortingStrategy}
                      >
                        {grouped[col.key].map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={() => {
                              setEditTask(task);

                              reset({
                                task: task.task,
                                description: task.description,
                                priority: task.priority,
                                status: task.status,
                                dueDate: task.dueDate,
                                branch: task.branch,
                              });

                              setEditFiles([]);
                            }}
                            onDelete={() => setDeleteTaskId(task.id)}
                            onClick={() => {
                              setSelectedTask(task);
                              setOpenDrawer(true);
                            }}
                          />
                        ))}
                      </SortableContext>
                    </Column>
                  </div>
                ))}
              </div>

              <DragOverlay>
                {activeTask && (
                  <div className="bg-white p-3 rounded shadow w-60">
                    {activeTask.task}
                  </div>
                )}
              </DragOverlay>
            </DndContext>

            {/* LOAD MORE */}
            {kanbanRes?.meta?.total > allTasks.length && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border rounded"
                  disabled={isFetching}
                >
                  Load more
                </button>
              </div>
            )}
          </div>

          <div className="xl:col-span-3">
            <OverviewDonut
              overview={overviewRes?.data || {}}
              statuses={STATUSES}
            />
          </div>
        </div>
      )}

      {/* ================= LIST ================= */}
      {/* {view === "list" && (
        <div className="bg-white rounded shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Task</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listRes?.data?.map((task) => (
                <tr key={task.id} className="border-t">
                  <td className="p-2">{task.task}</td>
                  <td>{task.status}</td>
                  <td>{task.priority}</td>
                  <td className="flex gap-2 p-2">
                    <button
                      onClick={() => {
                        setEditTask(task);
                        reset(task);
                      }}
                    >
                      ✏️
                    </button>
                    <button onClick={() => setDeleteTaskId(task.id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end gap-2 p-3">
            <button
              disabled={listPage === 1}
              onClick={() => setListPage((p) => p - 1)}
            >
              Prev
            </button>
            <span>Page {listPage}</span>
            <button
              disabled={listRes?.data?.length < LIST_LIMIT}
              onClick={() => setListPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )} */}

      {/* ✅ LIST VIEW (Modern + Clear meta + Due badge + Row click opens TaskDrawer) */}

      {view === "list" && (
        <div className="mt-4 max-w-7xl mx-auto">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-4 sm:px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Tasks
                </div>
                <div className="text-xs text-slate-500">
                  {isLoading || isFetching
                    ? "Loading..."
                    : `Showing ${listRes?.data?.length || 0} tasks`}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Page</span>
                <span className="text-sm font-semibold text-slate-900 tabular-nums">
                  {currentPage}
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-slate-600">
                    <th className="text-left font-medium px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">◎</span>
                        <span>Task Name</span>
                      </div>
                    </th>

                    <th className="text-left font-medium px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">≡</span>
                        <span>Description</span>
                      </div>
                    </th>

                    <th className="text-left font-medium px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">📅</span>
                        <span>Estimation</span>
                      </div>
                    </th>

                    <th className="text-left font-medium px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">▣</span>
                        <span>Status</span>
                      </div>
                    </th>

                    <th className="text-left font-medium px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">👥</span>
                        <span>Mention Std</span>
                      </div>
                    </th>
                    <th className="text-left font-medium px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">👥</span>
                        <span>Assigned To</span>
                      </div>
                    </th>
                    <th className="text-left font-medium px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">👥</span>
                        <span>Created By</span>
                      </div>
                    </th>

                    <th className="text-left font-medium px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">▾</span>
                        <span>Priority</span>
                      </div>
                    </th>

                    <th className="text-right font-medium px-4 py-3 whitespace-nowrap">
                      <span className="text-slate-400">+</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {(listRes?.data || []).map((task) => {
                    const linkedStudent = task?.linkedStudent;
                    const assignee = task?.assignee;
                    const creator = task?.creator;

                    // ✅ Due badge
                    const getDueBadge = (dueDateStr) => {
                      if (!dueDateStr) {
                        return {
                          text: "No due",
                          cls: "bg-slate-50 text-slate-600 border-slate-200",
                        };
                      }
                      const today = new Date();
                      const due = new Date(`${dueDateStr}T00:00:00`);
                      const diff = Math.ceil(
                        (due - today) / (1000 * 60 * 60 * 24),
                      );

                      if (diff < 0)
                        return {
                          text: `Overdue ${Math.abs(diff)}d`,
                          cls: "bg-red-50 text-red-700 border-red-200",
                        };
                      if (diff === 0)
                        return {
                          text: "Due today",
                          cls: "bg-orange-50 text-orange-800 border-orange-200",
                        };
                      if (diff <= 2)
                        return {
                          text: `Due in ${diff}d`,
                          cls: "bg-yellow-50 text-yellow-800 border-yellow-200",
                        };
                      return {
                        text: "On track",
                        cls: "bg-green-50 text-green-700 border-green-200",
                      };
                    };

                    const dueBadge = getDueBadge(task?.dueDate);

                    // ✅ Type pill (using status as "Type" like your screenshot)
                    const typeStyle = {
                      OPEN: "bg-blue-100 text-brandBlue border-blue-200",
                      IN_PROGRESS:
                        "bg-orange-100 text-orange-800 border-orange-200",
                      COMPLETED: "bg-green-100 text-green-800 border-green-200",
                      BLOCKED: "bg-red-100 text-red-800 border-red-200",
                    };

                    const priorityStyle = {
                      LOW: "bg-blue-50 text-blue-700 border-blue-200",
                      MEDIUM: "bg-yellow-50 text-yellow-800 border-yellow-200",
                      HIGH: "bg-orange-50 text-orange-800 border-orange-200",
                      URGENT: "bg-red-50 text-red-700 border-red-200",
                    };

                    const initials = (u) => {
                      const a = u?.FirstName?.[0] || "U";
                      const b = u?.LastName?.[0] || "";
                      return (a + b).toUpperCase();
                    };

                    return (
                      <tr
                        key={task.id}
                        onClick={() => {
                          setSelectedTask(task);
                          setOpenDrawer(true);
                        }}
                        className="hover:bg-slate-50 cursor-pointer"
                      >
                        {/* Task Name */}
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">
                            {task.task}
                          </div>
                        </td>

                        {/* Description */}
                        <td className="px-4 py-3">
                          <div
                            className="text-slate-700 line-clamp-2"
                            style={{ maxWidth: "420px" }}
                          >
                            {task.description || "—"}
                          </div>
                        </td>

                        {/* Estimation (Due date) */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-slate-900 font-medium">
                            {task.dueDate || "—"}
                          </div>
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${dueBadge.cls}`}
                            >
                              {dueBadge.text}
                            </span>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium border ${
                              typeStyle[task.status] ||
                              "bg-slate-50 text-slate-700 border-slate-200"
                            }`}
                          >
                            <span className="h-2 w-2 rounded-full bg-current opacity-50" />
                            {task.status || "—"}
                          </span>
                        </td>

                        {/* Assignee */}

                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {linkedStudent?.image ? (
                              <img
                                src={linkedStudent.image}
                                alt=""
                                className="h-8 w-8 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                                onClick={(e) => e.stopPropagation()}
                                // title={title}
                              />
                            ) : (
                              <div
                                className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-sm flex items-center justify-center text-[11px] font-bold shrink-0"
                                onClick={(e) => e.stopPropagation()}
                                // title={title}
                              >
                                {initials(linkedStudent)}
                              </div>
                            )}

                            <div className="font-medium text-slate-800 whitespace-nowrap">
                              {linkedStudent?.FirstName || "Unknown"}{" "}
                              {linkedStudent?.LastName || ""}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {assignee?.image ? (
                              <img
                                src={assignee.image}
                                alt=""
                                className="h-8 w-8 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                                onClick={(e) => e.stopPropagation()}
                                // title={title}
                              />
                            ) : (
                              <div
                                className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-sm flex items-center justify-center text-[11px] font-bold shrink-0"
                                onClick={(e) => e.stopPropagation()}
                                // title={title}
                              >
                                {initials(assignee)}
                              </div>
                            )}

                            <div className="font-medium text-slate-800 whitespace-nowrap">
                              {assignee?.FirstName || "Unknown"}{" "}
                              {assignee?.LastName || ""}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {creator?.image ? (
                              <img
                                src={creator.image}
                                alt=""
                                className="h-8 w-8 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                                onClick={(e) => e.stopPropagation()}
                                // title={title}
                              />
                            ) : (
                              <div
                                className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-sm flex items-center justify-center text-[11px] font-bold shrink-0"
                                onClick={(e) => e.stopPropagation()}
                                // title={title}
                              >
                                {initials(creator)}
                              </div>
                            )}

                            <div className="font-medium text-slate-800 whitespace-nowrap">
                              {creator?.FirstName || "Unknown"}{" "}
                              {creator?.LastName || ""}
                            </div>
                          </div>
                        </td>

                        {/* Priority */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                              priorityStyle[task.priority] ||
                              "bg-slate-50 text-slate-700 border-slate-200"
                            }`}
                          >
                            {task.priority || "NORMAL"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditTask(task);
                                reset(task);
                              }}
                              className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTaskId(task.id);
                              }}
                              className="h-8 px-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs"
                            >
                              Delete
                            </button>
                          </div>

                          {/* Hover কাজ করাতে group wrapper */}
                          <style>{`
                      tr:hover .group-hover\\:opacity-100 { opacity: 1 !important; }
                    `}</style>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden divide-y divide-slate-100">
              {(listRes?.data || []).map((task) => {
                const dueLabel = task.dueDate || "No due date";
                const assigneeName =
                  `${task.assignee?.FirstName || ""} ${
                    task.assignee?.LastName || ""
                  }`.trim() || "Unknown";

                return (
                  <div
                    key={task.id}
                    onClick={() => {
                      setSelectedTask(task);
                      setOpenDrawer(true);
                    }}
                    className="p-4 active:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 break-words">
                          {task.task}
                        </h3>
                        <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                          {task.description || "No description"}
                        </p>
                      </div>
                      <span className="flex-shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        {task.priority || "NORMAL"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                      <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                        {task.status || "N/A"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        {dueLabel}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        {assigneeName}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditTask(task);
                          reset(task);
                        }}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTaskId(task.id);
                        }}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}

            {/* <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-between">
              <button
                disabled={listPage === 1}
                onClick={() => setListPage((p) => p - 1)}
                className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                Prev
              </button>

              <div className="text-xs text-slate-500">
                Page{" "}
                <span className="font-semibold text-slate-900">{listPage}</span>
              </div>

              <button
                disabled={(listRes?.data?.length ?? 0) < LIST_LIMIT}
                onClick={() => setListPage((p) => p + 1)}
                className="h-10 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                Next
              </button>
            </div> */}

            {listRes?.meta && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-4 text-sm text-gray-600 border-t border-slate-100">
                {/* Left info */}
                <div>
                  Showing{" "}
                  <strong>
                    {(currentPage - 1) * itemsPerPage + 1} -{" "}
                    {Math.min(currentPage * itemsPerPage, listRes.meta.total)}
                  </strong>{" "}
                  of <strong>{listRes.meta.total}</strong>
                </div>

                {/* Right buttons */}
                <div className="flex w-full sm:w-auto items-center gap-2">
                  {/* Prev */}
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition
                     ${
                       currentPage === 1
                         ? "bg-brandDisable cursor-not-allowed"
                         : "bg-brandBlue hover:bg-brandHover"
                     }`}
                  >
                    ← Prev
                  </Button>

                  {/* Page number */}
                  <span className="whitespace-nowrap px-3 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
                    Page {currentPage}
                  </span>

                  {/* Next */}
                  <Button
                    disabled={currentPage * itemsPerPage >= listRes.meta.total}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition
                     ${
                       currentPage * itemsPerPage >= listRes.meta.total
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
        </div>
      )}

      {/* ================= ADD MODAL ================= */}
      {/* <Modal isOpen={addOpen} onClose={() => setAddOpen(false)}>
        <ModalHeader>Add Task</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onCreate)} className="space-y-3">
            <Input {...register("task")} placeholder="Task title" />
            <textarea
              {...register("description")}
              className="w-full border p-2"
              placeholder="Description"
            />
            <select {...register("priority")} className="w-full border p-2">
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
            <Button type="submit">Save</Button>
          </form>
        </ModalBody>
      </Modal> */}

      <dialog id="task_modal" className="modal">
        <div
          className="modal-box w-11/12 max-w-2xl p-4 sm:p-6 overflow-y-auto"
          style={{ maxHeight: "90vh" }}
        >
          {/* HEADER */}
          <h3 className="font-semibold text-lg text-gray-900 mb-4">Add Task</h3>

          <form
            onSubmit={handleSubmit(onCreate)}
            className="space-y-4 sm:space-y-6"
          >
            {/* BASIC INFO */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Task Title
                </label>
                <Input
                  type="text"
                  {...register("task")}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    {...register("dueDate")}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Branch
                  </label>
                  <select
                    {...register("branch")}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="">Select Branch</option>
                    {branchLoading && (
                      <option disabled>Loading branches...</option>
                    )}
                    {branchError && (
                      <option disabled>Error loading branches</option>
                    )}
                    {branchData?.data?.map((branchItem) => (
                      <option
                        key={branchItem.id || branchItem._id || branchItem.name}
                        value={
                          branchItem.branch ||
                          branchItem.name ||
                          branchItem.Branch
                        }
                      >
                        {branchItem.branch ||
                          branchItem.name ||
                          branchItem.Branch}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full border rounded-md px-3 py-2 text-sm resize-none"
              />
            </div>

            {/* Linked Student */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Linked Student
              </label>

              <Controller
                name="linkedStudent"
                control={control}
                render={({ field }) => (
                  <ReactSelect
                    options={studentOptions}
                    placeholder="Search student..."
                    isClearable
                    components={{ Option: CustomOption }}
                    value={
                      studentOptions.find((o) => o.value === field.value) ||
                      null
                    }
                    onChange={(option) =>
                      field.onChange(option ? option.value : "")
                    }
                  />
                )}
              />
            </div>

            {/* ASSIGNEE */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Assigned To
              </label>
              <Controller
                name="assignedTo"
                control={control}
                render={({ field }) => (
                  <ReactSelect
                    options={userOptions}
                    placeholder="Search assignee..."
                    isClearable
                    components={{ Option: CustomOption }}
                    value={
                      userOptions.find((o) => o.value === field.value) || null
                    }
                    onChange={(option) =>
                      field.onChange(option ? option.value : "")
                    }
                  />
                )}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Priority
              </label>
              <select
                {...register("priority")}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select Priority</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
            {/* ATTACHMENT */}
            {/* <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Attachment
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="w-full text-sm"
              />
            </div> */}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Attachment
              </label>
              <input
                type="file"
                multiple // ✅ add this
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="w-full text-sm"
              />
            </div>

            {/* FOOTER */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => document.getElementById("task_modal").close()}
                className="w-full sm:w-auto px-4 py-2 rounded-md text-sm border bg-white hover:bg-gray-100"
              >
                Close
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 rounded-md text-sm bg-brandBlue text-white"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
      {/* ================= EDIT MODAL ================= */}
      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)}>
        <ModalHeader>Edit Task</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onEdit)} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Task Title
              </label>
              <Input {...register("task")} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                className="w-full border p-2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Priority
                </label>
                <select {...register("priority")} className="w-full border p-2">
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Status
                </label>
                <select {...register("status")} className="w-full border p-2">
                  {STATUSES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.key}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Due Date
                </label>
                <Input
                  type="date"
                  {...register("dueDate")}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Branch
                </label>
                <select {...register("branch")} className="w-full border p-2">
                  <option value="">Select Branch</option>
                  {branchLoading && <option disabled>Loading...</option>}
                  {branchData?.data?.map((b) => {
                    const name = b.branch || b.Branch || b.name || "";
                    return (
                      <option key={b.id || name} value={name}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Linked Student
                </label>

                <Controller
                  name="linkedStudent"
                  control={control}
                  render={({ field }) => (
                    <ReactSelect
                      options={studentOptions}
                      placeholder="Search student..."
                      isClearable
                      components={{ Option: CustomOption }}
                      value={
                        studentOptions.find((o) => o.value === field.value) ||
                        null
                      }
                      onChange={(option) =>
                        field.onChange(option ? option.value : "")
                      }
                    />
                  )}
                />
              </div>
            
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Assigned To
                </label>
                <Controller
                  name="assignedTo"
                  control={control}
                  render={({ field }) => (
                    <ReactSelect
                      options={userOptions}
                      placeholder="Search assignee..."
                      isClearable
                      components={{ Option: CustomOption }}
                      value={
                        userOptions.find((o) => o.value === field.value) || null
                      }
                      onChange={(option) =>
                        field.onChange(option ? option.value : "")
                      }
                    />
                  )}
                />
              </div> */}

              {editTask?.files?.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-600">
                    Existing Attachments
                  </div>

                  {editTask.files.map((file, i) => {
                    const url = file.path;
                    const isImage = file.mimetype?.startsWith("image");

                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 border rounded-lg bg-gray-50"
                      >
                        {/* Preview */}
                        <div className="h-12 w-12 rounded border bg-white flex items-center justify-center overflow-hidden">
                          {isImage ? (
                            <img
                              src={url}
                              alt={file.filename}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-semibold">PDF</span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {file.filename}
                          </div>
                          <div className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </div>
                        </div>

                        {/* Action */}
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-indigo-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Attachment
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={handleEditFileChange}
                  className="w-full text-sm"
                />
              </div>
            </div>
            <Button type="submit">Update</Button>
          </form>
        </ModalBody>
      </Modal>

      {/* ================= DELETE MODAL ================= */}
      <Modal isOpen={!!deleteTaskId} onClose={() => setDeleteTaskId(null)}>
        <ModalHeader>Delete Task</ModalHeader>
        <ModalBody>
          <p className="text-sm">Are you sure?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button layout="outline" onClick={() => setDeleteTaskId(null)}>
              Cancel
            </Button>
            <Button className="bg-red-600" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </ModalBody>
      </Modal>

      {/* <TaskDrawer
        open={!!drawerTask}
        task={drawerTask}
        onClose={() => setDrawerTask(null)}
      /> */}

      <TaskDrawer
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
    </div>
  );
}
