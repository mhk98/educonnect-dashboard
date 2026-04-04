import { useState } from "react";
import MentionDropdown from "./MentionDropdown";
import {
  useGetTaskCommentsQuery,
  useAddTaskCommentMutation,
  useUpdateTaskCommentMutation,
  useDeleteTaskCommentMutation,
} from "../../features/taskComment/taskComment";

export default function TaskComments({ taskId }) {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const user_id = localStorage.getItem("userId");
  const branch = localStorage.getItem("branch");

  const { data } = useGetTaskCommentsQuery(taskId);

  const [addTaskComment] = useAddTaskCommentMutation();
  const [deleteTaskComment] = useDeleteTaskCommentMutation();
  const [updateTaskComment] = useUpdateTaskCommentMutation();

  const [newCommentHtml, setNewCommentHtml] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editHtml, setEditHtml] = useState("");

  /* ---------- ADD COMMENT ---------- */
  const submit = async () => {
    if (!newCommentHtml.trim()) return;

    const data = {
      message: newCommentHtml, // ✅ HTML with mentions
      user_id,
      branch,
    };

    await addTaskComment({
      taskId,
      data,
    });
    setNewCommentHtml("");
  };

  return (
    <div>
      <h4 className="font-semibold text-sm mb-2">Comments</h4>

      {/* ---------- COMMENT LIST ---------- */}
      <div className="space-y-3 max-h-56 overflow-y-auto">
        {data?.data?.map((c) => {
          const canEdit = c.user_id == userId;
          const canDelete =
            canEdit || role === "admin" || role === "superAdmin";

          return (
            <div key={c.id} className="bg-gray-100 rounded p-2">
              <div className="text-xs font-semibold">
                {c.User?.FirstName} {c.User?.LastName}
              </div>

              {/* ---------- COMMENT BODY ---------- */}
              {editingId === c.id ? (
                <MentionDropdown value={editHtml} onChange={setEditHtml} />
              ) : (
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: c.message }}
                />
              )}

              {/* ---------- META ---------- */}
              <div className="flex gap-2 text-[11px] text-gray-500 mt-1">
                <span>
                  {new Date(c.createdAt).toLocaleString()}
                  {c.updatedAt !== c.createdAt && " (edited)"}
                </span>

                {canEdit && editingId !== c.id && (
                  <button
                    onClick={() => {
                      setEditingId(c.id);
                      setEditHtml(c.message); // ✅ keep mentions
                    }}
                  >
                    Edit
                  </button>
                )}

                {editingId === c.id && (
                  <button
                    onClick={() => {
                      updateTaskComment({
                        commentId: c.id,
                        data: {
                          user_id,
                          role,
                          branch,
                          message: editHtml,
                        },
                      });
                      setEditingId(null);
                      setEditHtml("");
                    }}
                  >
                    Save
                  </button>
                )}

                {canDelete && (
                  <button
                    onClick={() =>
                      deleteTaskComment({
                        commentId: c.id,
                        data: { user_id, role },
                      })
                    }
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- NEW COMMENT INPUT ---------- */}
      <div className="mt-3">
        <MentionDropdown value={newCommentHtml} onChange={setNewCommentHtml} />

        <button
          onClick={submit}
          className="mt-2 px-3 py-1 bg-brandRed text-white rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
