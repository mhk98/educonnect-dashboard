import React, { useState } from "react";
import {
  useCreateNoticeMutation,
  useGetAllNoticeQuery,
  useDeleteNoticeMutation,
  useUpdateNoticeMutation,
} from "../../features/notice/notice";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";

const Notice = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [noticesPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // API Hooks
  const {
    data: noticeData,
    isLoading,
    error,
    refetch,
  } = useGetAllNoticeQuery();
  const [createNotice, { isLoading: isCreating }] = useCreateNoticeMutation();
  const [updateNotice, { isLoading: isUpdating }] = useUpdateNoticeMutation();
  const [deleteNotice, { isLoading: isDeleting }] = useDeleteNoticeMutation();

  // Extract notices from response
  const notices = Array.isArray(noticeData?.data)
    ? noticeData.data
    : noticeData?.data
      ? [noticeData.data]
      : [];

  // Pagination calculations
  const indexOfLastNotice = currentPage * noticesPerPage;
  const indexOfFirstNotice = indexOfLastNotice - noticesPerPage;
  const currentNotices = notices.slice(indexOfFirstNotice, indexOfLastNotice);
  const totalPages = Math.ceil(notices.length / noticesPerPage);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (editingId) {
        // Update notice
        await updateNotice({
          id: editingId,
          data: {
            title: formData.title,
            description: formData.description,
          },
        }).unwrap();
        alert("Notice updated successfully!");
        setEditingId(null);
      } else {
        // Create notice
        await createNotice({
          title: formData.title,
          description: formData.description,
        }).unwrap();
      }

      setFormData({ title: "", description: "" });
      setShowForm(false);
      refetch();
    } catch (err) {
      console.error("Error:", err);
      alert(`Failed to ${editingId ? "update" : "create"} notice`);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await deleteNotice(id).unwrap();
        refetch();
      } catch (err) {
        console.error("Error deleting notice:", err);
        alert("Failed to delete notice");
      }
    }
  };

  // Handle edit
  const handleEdit = (notice) => {
    setFormData({
      title: notice.title,
      description: notice.description,
    });
    setEditingId(notice.id);
    setShowForm(true);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", description: "" });
    setShowForm(false);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const formatNoticeDate = (dateValue) =>
    dateValue
      ? new Date(dateValue).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

  return (
    <div className="w-full space-y-5 p-3 sm:p-4 md:p-6">
      {/* Header with Add Button */}
      <div className="rounded-[28px] border border-red-100 bg-gradient-to-br from-white via-red-50/40 to-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brandBlue">
              Notice Board
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Notices
            </h1>
            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Create, update and manage latest office notices.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brandBlue to-red-500 px-5 py-3 text-sm font-semibold text-brandBlue shadow-lg shadow-red-100 transition hover:shadow-xl sm:w-auto"
          >
            <FaPlus /> Add Notice
          </button>
        </div>
      </div>

      {/* Create/Edit Notice Form */}
      {showForm && (
        <div className="rounded-[24px] border border-gray-100 bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] sm:p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            {editingId ? "Edit Notice" : "Create New Notice"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter notice title"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-brandBlue focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter notice description"
                rows="5"
                className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-brandBlue focus:ring-2 focus:ring-red-100"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="rounded-2xl bg-brandBlue px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-gray-400"
              >
                {isCreating || isUpdating
                  ? "Saving..."
                  : editingId
                    ? "Update Notice"
                    : "Create Notice"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin">
            <div className="h-8 w-8 border-4 border-brandBlue border-r-transparent rounded-full"></div>
          </div>
          <p className="mt-2 text-gray-600">Loading notices...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error loading notices: {error?.message || "Unknown error"}
        </div>
      )}

      {/* Notices Table */}
      {!isLoading && !error && (
        <>
          {currentNotices.length > 0 ? (
            <>
              <div className="space-y-3 lg:hidden">
                {currentNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-gray-900">
                          {notice.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatNoticeDate(notice.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-700 break-words">
                      {notice.description}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleEdit(notice)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700"
                      >
                        <FaEdit size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(notice.id)}
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 disabled:opacity-50"
                      >
                        <FaTrash size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.06)] lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="border-b border-gray-100 bg-gray-50/90 px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                          Title
                        </th>
                        <th className="border-b border-gray-100 bg-gray-50/90 px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                          Description
                        </th>
                        <th className="border-b border-gray-100 bg-gray-50/90 px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                          Created At
                        </th>
                        <th className="border-b border-gray-100 bg-gray-50/90 px-4 py-4 text-center text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentNotices.map((notice, index) => (
                        <tr
                          key={notice.id}
                          className="border-b border-gray-100 bg-white transition hover:bg-red-50/30"
                        >
                          <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                            {notice.title}
                          </td>
                          <td className="max-w-xs truncate px-4 py-4 text-sm text-gray-600">
                            {notice.description}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {formatNoticeDate(notice.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(notice)}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100 disabled:opacity-50"
                              >
                                <FaEdit size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(notice.id)}
                                disabled={isDeleting}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                              >
                                <FaTrash size={14} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-4 text-sm text-gray-600 sm:flex-row">
                  <div className="text-sm text-gray-600">
                    Showing {indexOfFirstNotice + 1} to{" "}
                    {Math.min(indexOfLastNotice, notices.length)} of{" "}
                    {notices.length} notices
                  </div>
                  <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:w-auto">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
                            currentPage === page
                              ? "bg-brandBlue text-white"
                              : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-[24px] border border-gray-100 bg-white p-8 text-center shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
              <p className="text-gray-600 text-lg">No notices found</p>
              <p className="text-gray-500 text-sm mt-2">
                Create a new notice to get started
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notice;
