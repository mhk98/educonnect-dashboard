import React, { useState, useEffect } from "react";
import {
  useGetAllEnquiriesQuery,
  useGetDataByIdQuery,
  useUpdateEnquiriesMutation,
} from "../../features/enquiries/enquiries";
import toast from "react-hot-toast";
import { Modal, ModalHeader, ModalBody, Button } from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import { FiSend } from "react-icons/fi";
import axios from "axios";

const EnquiriesRequestedPanel = () => {
  const id = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const Branch = localStorage.getItem("branch");
  const [selected, setSelected] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagesPerSet, setPagesPerSet] = useState(10);
  const itemsPerPage = 10;

  const [currentPage1, setCurrentPage1] = useState(1);
  const [startPage1, setStartPage1] = useState(1);
  const [totalPages1, setTotalPages1] = useState(1);
  const [pagesPerSet1, setPagesPerSet1] = useState(10);
  const itemsPerPage1 = 10;

  const { data, isLoading, isError, error } = useGetAllEnquiriesQuery({
    Status: "active",
    page: currentPage,
    limit: itemsPerPage,
  });
  const [programList, setProgramList] = useState([]);

  useEffect(() => {
    if (isError) {
      console.log("Error fetching", error);
    } else if (!isLoading && data) {
      // const filteredProgram = data.data.filter(
      //   (item) => item.Status === "active"
      // );
      setProgramList(data?.data);
    }
  }, [data, isLoading, isError, error]);

  // Update total pages when data changes
  useEffect(() => {
    if (isError) {
      console.error("Error fetching user data", error);
    } else if (data && data.meta?.total != null) {
      setTotalPages(Math.ceil(data.meta.total / itemsPerPage));
    }
  }, [data, isError, error]);

  // Responsive pagination button count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setPagesPerSet(5);
      else if (window.innerWidth < 1024) setPagesPerSet(7);
      else setPagesPerSet(10);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const endPage = Math.min(startPage + pagesPerSet - 1, totalPages);
  const handlePageChange = (p) => {
    setCurrentPage(p);
    if (p < startPage) setStartPage(p);
    else if (p > endPage) setStartPage(p - pagesPerSet + 1);
  };
  const handlePreviousSet = () =>
    setStartPage(Math.max(startPage - pagesPerSet, 1));
  const handleNextSet = () =>
    setStartPage(
      Math.min(startPage + pagesPerSet, totalPages - pagesPerSet + 1),
    );

  const {
    data: data1,
    isLoading: isLoading1,
    isError: isError1,
    error: error1,
  } = useGetAllEnquiriesQuery({
    Status: "active",
    Branch,
    page: currentPage,
    limit: itemsPerPage,
  });
  const [adminPrograms, setAdminPrograms] = useState([]);

  useEffect(() => {
    if (isError1) {
      console.log("Error fetching", error1);
    } else if (!isLoading1 && data1) {
      //        const allAdminPrograms = data1.data;
      //  const filtered = allAdminPrograms.filter(program => program.Status === "active");

      setAdminPrograms(data1?.data);
    }
  }, [data1, isLoading1, isError1, error1, Branch]);

  console.log("adminPrograms", adminPrograms);

  // Update total pages when data changes
  useEffect(() => {
    if (isError1) {
      console.error("Error fetching user data", error1);
    } else if (data1 && data1.meta?.total != null) {
      setTotalPages1(Math.ceil(data1.meta.total / itemsPerPage1));
    }
  }, [data1, isError1, error1]);

  // Responsive pagination button count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setPagesPerSet1(5);
      else if (window.innerWidth < 1024) setPagesPerSet1(7);
      else setPagesPerSet1(10);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const endPage1 = Math.min(startPage1 + pagesPerSet1 - 1, totalPages1);
  const handlePageChange1 = (p) => {
    setCurrentPage1(p);
    if (p < startPage1) setStartPage1(p);
    else if (p > endPage1) setStartPage1(p - pagesPerSet1 + 1);
  };
  const handlePreviousSet1 = () =>
    setStartPage1(Math.max(startPage1 - pagesPerSet1, 1));
  const handleNextSet1 = () =>
    setStartPage1(
      Math.min(startPage1 + pagesPerSet1, totalPages1 - pagesPerSet1 + 1),
    );

  const {
    data: data2,
    isLoading: isLoading2,
    isError: isError2,
    error: error2,
  } = useGetDataByIdQuery(id);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    if (isError2) {
      console.log("Error fetching", error2);
    } else if (!isLoading2 && data2) {
      setPrograms(data2.data);
    }
  }, [data2, isLoading2, isError2, error2, Branch]);

  console.log("adminPrograms", adminPrograms);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const fileBaseURL = ""; // Cloudinary URLs are full URLs

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [enquiryId, setEnquiryId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  const [updateEnquiries] = useUpdateEnquiriesMutation();

  const onFormEdit = async (data) => {
    console.log("info", data);
    console.log("enquiryId", enquiryId);

    try {
      const res = await updateEnquiries({ id: enquiryId, data });
      if (res.data?.success) {
        toast.success(res.data.message);
        reset();
        setIsModalOpen(false);
      } else {
        toast.error(res.error?.data?.message || "Failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState({});

  useEffect(() => {
    if (!selected?.id) return;
    fetchComments();
  }, [selected]);

  // const fetchComments = async () => {
  //   try {
  //     const res = await axios.get(
  //       `https://backend.eaconsultancy.org/api/v1/comment/${selected.id}?type=kc`
  //     );
  //     setComments(res.data.data);
  //   } catch (err) {
  //     console.error("Failed to fetch comments:", err);
  //   }
  // };

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `https://backend.eaconsultancy.org/api/v1/comment/${selected.id}?type=kc`,
      );
      const sortedComments = res.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setComments(sortedComments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        "https://backend.eaconsultancy.org/api/v1/comment/create",
        {
          user_id: id,
          enquiry_id: selected.id,
          text: newComment,
          type: "kc",
          hidden: false,
        },
      );
      setNewComment("");
      fetchComments();
      document.activeElement.blur();
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const handleReplySubmit = async (commentId) => {
    const replyText = replyContent[commentId];
    if (!replyText?.trim()) return;
    try {
      await axios.post(
        "https://backend.eaconsultancy.org/api/v1/reply/create",
        {
          user_id: id,
          enquiry_id: selected.id,
          comment_id: commentId,
          text: replyText,
        },
      );
      setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
      fetchComments();
    } catch (err) {
      console.error("Failed to post reply:", err);
    }
  };

  const renderCommentList = () => (
    <div className="space-y-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="border p-3 rounded-md bg-gray-50">
            <p className="text-sm mb-1 font-medium">
              {comment.User?.FirstName} {comment.User?.LastName}:
            </p>
            <p className="text-sm mb-2">{comment.text}</p>
            <div className="ml-4 space-y-2">
              {comment.replies?.map((reply) => (
                <div
                  key={reply.id}
                  className="text-sm text-gray-700 bg-white p-2 rounded border"
                >
                  <span className="font-medium">
                    {reply.User?.FirstName} {reply.User?.LastName}:
                  </span>{" "}
                  {reply.text}
                </div>
              ))}
              {/* <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={replyContent[comment.id] || ""}
                  onChange={(e) =>
                    setReplyContent((prev) => ({
                      ...prev,
                      [comment.id]: e.target.value,
                    }))
                  }
                  placeholder="Write a reply..."
                  className="flex-1 border px-2 py-1 rounded text-sm"
                />
                <button
                  onClick={() => handleReplySubmit(comment.id)}
                  className="text-sm bg-brandRed text-white px-3 py-1 rounded hover:bg-brandRed-700"
                >
                  Reply
                </button>
              </div> */}

              <div className="flex flex-col gap-2 mt-2">
                <textarea
                  rows={2}
                  value={replyContent[comment.id] || ""}
                  onChange={(e) =>
                    setReplyContent((prev) => ({
                      ...prev,
                      [comment.id]: e.target.value,
                    }))
                  }
                  placeholder="Write a reply..."
                  className="flex-1 border px-2 py-1 rounded text-sm resize-none"
                />
                <button
                  onClick={() => handleReplySubmit(comment.id)}
                  className="self-start text-sm bg-brandRed text-white px-3 py-1 rounded hover:bg-brandRed-700"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No comments yet.</p>
      )}
    </div>
  );

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://backend.eaconsultancy.org/api/v1/user",
        );
        const allUsers = response.data.data;

        // ফিল্টার লজিক
        const filtered = allUsers.filter((user) => {
          const role = user.Role?.toLowerCase(); // রোল lowercase করে নিচ্ছি
          return role && role === "employee" && user.Branch === Branch;
        });

        setEmployees(filtered);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [Branch]);

  const [superAdminEmployees, setSuperAdminEmployees] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://backend.eaconsultancy.org/api/v1/user",
        );
        const allUsers = response.data.data;

        // ফিল্টার লজিক
        const filtered = allUsers.filter((user) => {
          const role = user.Role?.toLowerCase(); // রোল lowercase করে নিচ্ছি
          return role && role !== "student";
        });

        setSuperAdminEmployees(filtered);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [Branch]);

  return (
    <div className="flex max-w-full flex-col gap-4 overflow-x-hidden p-1 sm:p-2 lg:flex-row">
      {/* Left Panel */}

      {role === "superAdmin" ? (
        <div className="w-full lg:w-1/2">
          {programList.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelected(item)}
              className={`mb-3 cursor-pointer rounded-2xl border p-4 shadow-sm transition ${
                selected?.name === item.name
                  ? "border-brandRed bg-red-50/30"
                  : "border-gray-200 bg-white hover:border-brandRed/30"
              }`}
            >
              <div className="flex justify-between items-center flex-wrap gap-2">
                <p className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  Program Options Sent
                </p>
                <p
                  onClick={() => {
                    setIsModalOpen(true);
                    setEnquiryId(item.id);
                  }}
                  className="cursor-pointer rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-brandRed"
                >
                  Edit
                </p>

                <Modal isOpen={isModalOpen} onClose={closeModal}>
                  <ModalHeader className="mb-6 text-lg font-bold text-gray-900">
                    Edit User Information
                  </ModalHeader>
                  <ModalBody>
                    <form onSubmit={handleSubmit(onFormEdit)}>
                      <div className="grid grid-cols-1 gap-4">
                        {/* Left Side */}

                        {/*                                                                
                                                               <div className="mb-4">
                                                                 <label className="block text-sm mb-1 text-gray-700 mb-4">Assign To</label>
                                                                 <select
                                                                     {...register("assignedTo")}
                                                                     className="input input-bordered w-full shadow-md p-3"
                                                                   >
                                                                     <option value="">Select Assignee</option>
                                                                     <option value="A">A</option>
                                                                     <option value="B">B</option>        
                                                                     <option value="C">C</option>        
                                                                   </select>
                                                                   {errors.assignedTo && (
                                                                     <p className="text-red-500 text-sm mt-1">{errors.assignedTo.message}</p>
                                                                   )}
                                                               </div> */}

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Assignee
                          </label>
                          <select
                            {...register("assignedTo")}
                            className="input input-bordered w-full rounded-2xl border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandRed"
                          >
                            <option value="">Select Assignee</option>
                            {superAdminEmployees.map((employee) => (
                              <option
                                key={employee.id}
                                value={`${employee.FirstName} ${employee.LastName}`}
                              >
                                {employee.FirstName} {employee.LastName}
                              </option>
                            ))}
                          </select>
                          {errors.assignedTo && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.assignedTo.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Status
                          </label>
                          <select
                            {...register("Status")}
                            className="input input-bordered w-full rounded-2xl border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandRed"
                          >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="archive">Archive</option>
                          </select>
                          {errors.Status && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.Status.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end gap-2">
                        <Button
                          type="submit"
                          className="btn w-full rounded-2xl bg-brandRed px-8 py-3 font-semibold sm:w-auto"
                        >
                          Save
                        </Button>
                      </div>
                    </form>
                  </ModalBody>
                </Modal>
              </div>
              <h3 className="mt-3 text-base font-bold text-gray-900">
                {item.firstName} {item.lastName}
              </h3>
              <p className="mt-2 text-sm text-gray-700">
                Preferred Destination:{" "}
                <span className="inline-flex items-center gap-1">
                  {item.destination}
                </span>
              </p>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">Created On:</span>{" "}
                {formatDate(item.createdAt)}
              </p>
            </div>
          ))}

          {/* -- Pagination -- */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handlePreviousSet}
              disabled={startPage === 1}
              className="rounded-2xl bg-brandRed px-4 py-2 text-white disabled:bg-brandDisable"
            >
              Prev
            </button>
            {[...Array(endPage - startPage + 1)].map((_, i) => {
              const p = startPage + i;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`rounded-2xl px-4 py-2 text-white ${
                    p === currentPage ? "bg-brandRed" : "bg-brandDisable"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={handleNextSet}
              disabled={endPage === totalPages}
              className="rounded-2xl bg-brandRed px-4 py-2 text-white disabled:bg-brandDisable"
            >
              Next
            </button>
          </div>
        </div>
      ) : role === "admin" || role === "employee" ? (
        <div className="w-full lg:w-1/2">
          {adminPrograms.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelected(item)}
              className={`mb-3 cursor-pointer rounded-2xl border p-4 shadow-sm transition ${
                selected?.name === item.name
                  ? "border-brandRed bg-red-50/30"
                  : "border-gray-200 bg-white hover:border-brandRed/30"
              }`}
            >
              <div className="flex justify-between items-center flex-wrap gap-2">
                <p className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  Program Options Sent
                </p>
                <p
                  onClick={() => {
                    setIsModalOpen(true);
                    setEnquiryId(item.id);
                  }}
                  className="cursor-pointer rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-brandRed"
                >
                  Edit
                </p>

                <Modal isOpen={isModalOpen} onClose={closeModal}>
                  <ModalHeader className="mb-6 text-lg font-bold text-gray-900">
                    Edit User Information
                  </ModalHeader>
                  <ModalBody>
                    <form onSubmit={handleSubmit(onFormEdit)}>
                      <div className="grid grid-cols-1 gap-4">
                        {/* Left Side */}

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Assignee
                          </label>
                          <select
                            {...register("assignedTo")}
                            className="input input-bordered w-full rounded-2xl border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandRed"
                          >
                            <option value="">Select Assignee</option>
                            {employees.map((employee) => (
                              <option
                                key={employee.id}
                                value={`${employee.FirstName} ${employee.LastName}`}
                              >
                                {employee.FirstName} {employee.LastName}
                              </option>
                            ))}
                          </select>
                          {errors.assignedTo && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.assignedTo.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Status
                          </label>
                          <select
                            {...register("Status")}
                            className="input input-bordered w-full rounded-2xl border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandRed"
                          >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="archive">Archive</option>
                          </select>
                          {errors.Status && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.Status.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end gap-2">
                        <Button
                          type="submit"
                          className="btn w-full rounded-2xl bg-brandRed px-8 py-3 font-semibold sm:w-auto"
                        >
                          Save
                        </Button>
                      </div>
                    </form>
                  </ModalBody>
                </Modal>
              </div>
              <h3 className="mt-3 text-base font-bold text-gray-900">
                {item.firstName} {item.lastName}
              </h3>
              <p className="mt-2 text-sm text-gray-700">
                Preferred Destination:{" "}
                <span className="inline-flex items-center gap-1">
                  {item.destination}
                </span>
              </p>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">Created On:</span>{" "}
                {formatDate(item.createdAt)}
              </p>
            </div>
          ))}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handlePreviousSet1}
              disabled={startPage1 === 1}
              className="rounded-2xl bg-brandRed px-4 py-2 text-white disabled:bg-brandDisable"
            >
              Prev
            </button>
            {[...Array(endPage1 - startPage1 + 1)].map((_, i) => {
              const p = startPage1 + i;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange1(p)}
                  className={`rounded-2xl px-4 py-2 text-white ${
                    p === currentPage1 ? "bg-brandRed" : "bg-brandDisable"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={handleNextSet1}
              disabled={endPage1 === totalPages1}
              className="rounded-2xl bg-brandRed px-4 py-2 text-white disabled:bg-brandDisable"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full lg:w-1/2">
          {programs.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelected(item)}
              className={`mb-3 cursor-pointer rounded-2xl border p-4 shadow-sm transition ${
                selected?.name === item.name
                  ? "border-brandRed bg-red-50/30"
                  : "border-gray-200 bg-white hover:border-brandRed/30"
              }`}
            >
              <div className="flex justify-between items-center flex-wrap gap-2">
                <p className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  Program Options Sent
                </p>
                {/* <p onClick={() => {
                              setIsModalOpen(true);
                              setEnquiryId(item.id);
                            }} className="bg-green-200 text-green-800 text-xs px-3 py-1 rounded font-semibold cursor-pointer">
                Edit
              </p> */}

                <Modal isOpen={isModalOpen} onClose={closeModal}>
                  <ModalHeader className="mb-6 text-lg font-bold text-gray-900">
                    Edit User Information
                  </ModalHeader>
                  <ModalBody>
                    <form onSubmit={handleSubmit(onFormEdit)}>
                      <div className="grid grid-cols-1 gap-4">
                        {/* Left Side */}

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Assign To
                          </label>
                          <select
                            {...register("assignedTo")}
                            className="input input-bordered w-full rounded-2xl border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandRed"
                          >
                            <option value="">Select Assignee</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                          </select>
                          {errors.assignedTo && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.assignedTo.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Status
                          </label>
                          <select
                            {...register("Status")}
                            className="input input-bordered w-full rounded-2xl border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-brandRed"
                          >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="archive">Archive</option>
                          </select>
                          {errors.Status && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.Status.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end gap-2">
                        <Button
                          type="submit"
                          className="btn w-full rounded-2xl bg-brandRed px-8 py-3 font-semibold sm:w-auto"
                        >
                          Save
                        </Button>
                      </div>
                    </form>
                  </ModalBody>
                </Modal>
              </div>
              <h3 className="mt-3 text-base font-bold text-gray-900">
                {item.firstName} {item.lastName}
              </h3>
              <p className="mt-2 text-sm text-gray-700">
                Preferred Destination:{" "}
                <span className="inline-flex items-center gap-1">
                  {item.destination}
                </span>
              </p>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">Created On:</span>{" "}
                {formatDate(item.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Right Panel */}
      {selected && (
        <div className="w-full rounded-3xl border border-gray-100 bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] sm:p-5 lg:w-1/2">
          <div className="flex justify-between items-start flex-wrap gap-2 mb-4">
            <h3 className="font-bold text-lg max-w-sm leading-tight">
              {selected.firstName} {selected.lastName}
            </h3>
            <div className="flex flex-col items-end">
              <span className="mb-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Program Options Sent
              </span>
              <p className="text-xs text-gray-500">
                Created On: {formatDate(selected.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-x-8 text-sm">
            <p>
              <span className="font-semibold">Assigned To:</span>{" "}
              <span className="text-brandRed font-medium">
                {selected.assignedTo}
              </span>{" "}
              {/* — {selected.contact} */}
            </p>
            <p className="mt-4">
              <span className="font-semibold">Country Of Education:</span>
              {selected.educationCountry}
            </p>
            <p className="mt-4">
              <span className="font-semibold">Highest Education Level:</span>{" "}
              {selected.educationLevel}
            </p>
            <p className="mt-4">
              <span className="font-semibold">Preferred Destination:</span>{" "}
              <span className="inline-flex items-center gap-1">
                {selected.flag} {selected.destination}
              </span>
            </p>
            <p className="mt-4">
              <span className="font-semibold">Preferred Study Level:</span>{" "}
              {selected.studyLevel}
            </p>
            <p className="mt-4">
              <span className="font-semibold">Preferred Study Area:</span>{" "}
              {selected.studyArea}
            </p>
            <p className="md:col-span-2 mt-4">
              <span className="font-semibold">Additional Information:</span>{" "}
              {selected.additionalInfo}
            </p>

            {/* PDF Documents Section */}
            {selected.files && selected.files.length > 0 && (
              <div className="flex flex-col gap-3 mt-4">
                <p className="font-semibold">Documents:</p>
                {selected.files.map((file, index) => (
                  <button
                    key={index}
                    className="rounded-xl border border-brandRed/30 bg-red-50 px-3 py-2 text-sm font-medium text-brandRed"
                  >
                    <a
                      href={`${fileBaseURL}${file.path.replace(/\\/g, "/")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.originalName}
                    </a>
                  </button>
                ))}
              </div>
            )}

            {/* KC Team Comments Only */}

            {/* <div className="flex items-center gap-2 mt-4">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleCommentSubmit()
                  }
                  placeholder="Write comments..."
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <button
                  className="bg-brandRed text-white p-2 rounded hover:bg-brandRed-700"
                  onClick={handleCommentSubmit}
                >
                  <FiSend size={20} />
                </button>
              </div>
              {renderCommentList()} */}

            <div className="flex flex-col gap-2 mt-4">
              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write comments..."
                className="flex-1 resize-none rounded-2xl border border-gray-200 px-3 py-2 text-sm focus:border-brandRed focus:outline-none"
              />
              <div className="flex items-center justify-end">
                <button
                  className="rounded-xl bg-brandRed p-3 text-white hover:bg-brandRed"
                  onClick={handleCommentSubmit}
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>

            {renderCommentList()}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiriesRequestedPanel;
