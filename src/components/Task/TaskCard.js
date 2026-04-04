import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

function StatusPill({ status }) {
  const statusStyles = {
    OPEN: "bg-blue-500 text-white",
    IN_PROGRESS: "bg-orange-500 text-white",
    COMPLETED: "bg-green-500 text-white",
    BLOCKED: "bg-red-500 text-white",
  };

  return (
    <span
      className={`text-sm font-semibold px-3 py-1 rounded-md ${
        statusStyles[status] || "bg-gray-400 text-white"
      }`}
    >
      {status}
    </span>
  );
}

function PriorityPill({ priority }) {
  const priorityStyles = {
    LOW: "bg-blue-50 text-blue-700 border-blue-200",
    MEDIUM: "bg-yellow-50 text-yellow-800 border-yellow-200",
    HIGH: "bg-orange-50 text-orange-800 border-orange-200",
    URGENT: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md uppercase ${
        priorityStyles[priority] || "bg-gray-100 text-gray-600"
      }`}
    >
      {priority || "NORMAL"}
    </span>
  );
}

export default function TaskCard({ task, onClick }) {
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: `task-${task.id}`,
    data: { status: task.status },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white rounded-xl border border-gray-200
        px-4 py-3 mb-3
        hover:shadow-md hover:border-gray-300
        transition-all
        ${isDragging ? "opacity-40" : ""}
      `}
    >
      {/* 🔹 MAIN CLICK AREA */}
      <div onClick={onClick} className="cursor-pointer space-y-2 min-w-0">
        {/* Due date */}
        <div className="text-[11px] text-gray-500">
          {task.dueDate || "No due date"}
        </div>

        {/* Assigned user */}
        <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
          {task?.assignee?.image ? (
            <img
              src={task?.assignee?.image}
              alt=""
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
              {task.assignee?.FirstName?.[0]}
              {task.assignee?.LastName?.[0]}
            </div>
          )}
          <span className="truncate">
            {task.assignee?.FirstName}
            {/* {task.assignee?.LastName} */}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
          {task?.creator?.image ? (
            <img
              src={task?.creator?.image}
              alt=""
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
              {task?.creator?.FirstName?.[0]}
              {task.creator?.LastName?.[0]}
            </div>
          )}
          {/* <UserPlus size={13} /> */}
          <span className="truncate">
            {task?.creator?.FirstName}
            {/* {task.assignee?.LastName} */}
          </span>
        </div>

        {task?.linkedStudent && (
          <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
            {task?.linkedStudent?.image ? (
              <img
                src={task?.linkedStudent?.image}
                alt=""
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                {task?.linkedStudent?.FirstName?.[0]}
                {task.linkedStudent?.LastName?.[0]}
              </div>
            )}
            {/* <UserPlus size={13} /> */}
            <span className="truncate">
              {task?.linkedStudent?.FirstName}
              {/* {task.linkedStudent?.LastName} */}
            </span>
          </div>
        )}

        {/* Task title */}
        <div className="text-sm font-semibold text-gray-900 leading-snug break-words">
          {task.task}
        </div>

        {/* Footer */}
        {/* <div className="flex items-center justify-between pt-2">
          <StatusPill status={task.status} />
        </div> */}

        {/* Footer */}

        <div className="">
          <PriorityPill priority={task.priority} />
        </div>
        <div className="">
          <StatusPill status={task.status} />
        </div>
      </div>

      {/* 🔹 DRAG HANDLE */}
      <div className="flex justify-end mt-2">
        <span
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
          title="Drag task"
        >
          <GripVertical size={16} />
        </span>
      </div>
    </div>
  );
}
