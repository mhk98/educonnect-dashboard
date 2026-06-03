import React, { useState } from "react";
import { FiExternalLink, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  useGetAllQuickLinksQuery,
  useCreateQuickLinkMutation,
  useUpdateQuickLinkMutation,
  useDeleteQuickLinkMutation,
} from "../features/quickLink/quickLink";

export default function QuickLinks() {
  const role = localStorage.getItem("role");
  const canEdit = role === "superAdmin" || role === "admin";

  const { data, isLoading } = useGetAllQuickLinksQuery();
  const links = data?.data ?? [];

  const [createQuickLink] = useCreateQuickLinkMutation();
  const [updateQuickLink] = useUpdateQuickLinkMutation();
  const [deleteQuickLink] = useDeleteQuickLinkMutation();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newLink, setNewLink] = useState({ name: "", href: "" });
  const [editValues, setEditValues] = useState({ name: "", href: "" });

  const normalizeUrl = (url) =>
    url.startsWith("http") ? url : `https://${url}`;

  const handleAdd = async () => {
    if (!newLink.name.trim()) { toast.error("Link name is required"); return; }
    if (!newLink.href.trim()) { toast.error("URL is required"); return; }
    const res = await createQuickLink({ name: newLink.name.trim(), href: normalizeUrl(newLink.href) });
    if (res.data?.success) {
      toast.success("Link added");
      setNewLink({ name: "", href: "" });
      setIsAdding(false);
    } else {
      toast.error("Failed to add link");
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteQuickLink(id);
    if (res.data?.success) toast.success("Link removed");
    else toast.error("Failed to delete link");
  };

  const startEdit = (link) => {
    setEditingId(link.id);
    setEditValues({ name: link.name, href: link.href });
  };

  const saveEdit = async () => {
    if (!editValues.name.trim() || !editValues.href.trim()) {
      toast.error("Name and URL are required");
      return;
    }
    const res = await updateQuickLink({
      id: editingId,
      data: { name: editValues.name.trim(), href: normalizeUrl(editValues.href) },
    });
    if (res.data?.success) { toast.success("Link updated"); setEditingId(null); }
    else toast.error("Failed to update link");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-800">Quick Links</h2>
        {canEdit && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-brandBlue transition-colors"
          >
            <FiPlus className="w-3.5 h-3.5" />
            Add
          </button>
        )}
      </div>

      {/* Add form */}
      {isAdding && (
        <div className="mb-3 p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
          <input
            autoFocus
            value={newLink.name}
            onChange={e => setNewLink(p => ({ ...p, name: e.target.value }))}
            placeholder="Link name"
            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-brandBlue"
          />
          <input
            value={newLink.href}
            onChange={e => setNewLink(p => ({ ...p, href: e.target.value }))}
            placeholder="https://example.com"
            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-brandBlue"
            onKeyDown={e => e.key === "Enter" && handleAdd()}
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex items-center gap-1 px-3 py-1 bg-brandBlue text-white text-xs font-medium rounded-lg">
              <FiCheck className="w-3 h-3" /> Save
            </button>
            <button
              onClick={() => { setIsAdding(false); setNewLink({ name: "", href: "" }); }}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
            >
              <FiX className="w-3 h-3" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Links list — original design */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {links.length === 0 && !isAdding && (
            <p className="text-sm text-gray-400 py-3 text-center">
              {canEdit ? 'No links yet. Click "Add" to create one.' : "No links available."}
            </p>
          )}
          {links.map(link => (
            <div key={link.id} className="group">
              {editingId === link.id ? (
                <div className="py-2.5 space-y-1.5">
                  <input
                    autoFocus
                    value={editValues.name}
                    onChange={e => setEditValues(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brandBlue"
                  />
                  <input
                    value={editValues.href}
                    onChange={e => setEditValues(p => ({ ...p, href: e.target.value }))}
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brandBlue"
                    onKeyDown={e => e.key === "Enter" && saveEdit()}
                  />
                  <div className="flex gap-1.5">
                    <button onClick={saveEdit} className="px-2.5 py-1 bg-brandBlue text-white text-xs rounded-lg">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between py-2.5 hover:text-blue-700 group transition p-3">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between flex-1 min-w-0 group/link"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover/link:text-blue-700 transition truncate pr-2">
                      {link.name}
                    </span>
                    <FiExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-gray-300 group-hover/link:text-blue-500 transition" />
                  </a>

                  {canEdit && (
                    <div className="flex items-center gap-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(link)}
                        className="p-1 text-gray-300 hover:text-brandBlue transition-colors"
                      >
                        <FiEdit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
