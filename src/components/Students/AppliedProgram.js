// import React, { useEffect, useState } from "react";
// import { FiSend } from "react-icons/fi";
// import { useGetDataByIdQuery } from "../../features/application/application";
// import axios from "axios";

// const AppliedProgram = ({ user_id }) => {
//   const [tab, setTab] = useState("kc");
//   const id = localStorage.getItem("userId");
//   const role = localStorage.getItem("role");
//   const { data, isLoading, isError, error } = useGetDataByIdQuery(user_id);
//   const [programs, setPrograms] = useState([]);
//   const [selectedProgram, setSelectedProgram] = useState(null);

//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [newCommentFile, setNewCommentFile] = useState(null);
//   const [replyContent, setReplyContent] = useState({});
//   const [replyFiles, setReplyFiles] = useState({});

//   const [kcComments, setKCComments] = useState([]);
//   const [newKCComment, setNewKCComment] = useState("");
//   const [newKCCommentFile, setNewKCCommentFile] = useState(null);
//   const [replyKCContent, setReplyKCContent] = useState({});
//   const [replyKCFiles, setReplyKCFiles] = useState({});

//   useEffect(() => {
//     if (isError) {
//       console.log(error?.data?.message || "An error occurred");
//     } else if (!isLoading && data) {
//       setPrograms(data.data);
//       if (data.data.length > 0) {
//         setSelectedProgram(data.data[0]);
//       }
//     }
//   }, [data, isLoading, isError, error]);

//   useEffect(() => {
//     if (!selectedProgram?.id) return;
//     tab === "student" ? fetchComments() : fetchKCComments();
//   }, [selectedProgram, tab]);

//   const fetchComments = async () => {
//     try {
//       const res = await axios.get(
//         `https://backend.eaconsultancy.org/api/v1/studentComment/${selectedProgram.id}?type=${tab}`
//       );
//       setComments(res.data.data);
//     } catch (err) {
//       console.error("Failed to fetch comments:", err);
//     }
//   };

//   const fetchKCComments = async () => {
//     try {
//       const res = await axios.get(
//         `https://backend.eaconsultancy.org/api/v1/kcComment/${selectedProgram.id}?type=${tab}`
//       );
//       setKCComments(res.data.data);
//     } catch (err) {
//       console.error("Failed to fetch KC comments:", err);
//     }
//   };

//   const formatDateTime = (dateTimeStr) => {
//     const date = new Date(dateTimeStr);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     let hours = date.getHours();
//     const minutes = String(date.getMinutes()).padStart(2, "0");
//     const ampm = hours >= 12 ? "PM" : "AM";
//     hours = hours % 12 || 12;
//     return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
//   };

//   const handleCommentSubmit = async () => {
//     if (!newComment.trim() && !newCommentFile) return;
//     try {
//       const formData = new FormData();
//       formData.append("user_id", id);
//       formData.append("application_id", selectedProgram.id);
//       formData.append("text", newComment);
//       formData.append("type", tab);
//       formData.append("hidden", false);
//       if (newCommentFile) formData.append("file", newCommentFile);

//       await axios.post(
//         "https://backend.eaconsultancy.org/api/v1/studentComment/create",
//         formData
//       );
//       setNewComment("");
//       setNewCommentFile(null);
//       fetchComments();
//     } catch (err) {
//       console.error("Failed to post comment:", err);
//     }
//   };

//   const handleReplySubmit = async (commentId) => {
//     const replyText = replyContent[commentId];
//     const file = replyFiles[commentId];
//     if (!replyText?.trim() && !file) return;
//     try {
//       const formData = new FormData();
//       formData.append("user_id", id);
//       formData.append("studentComment_id", commentId);
//       formData.append("text", replyText);
//       if (file) formData.append("file", file);

//       await axios.post(
//         "https://backend.eaconsultancy.org/api/v1/studentReply/create",
//         formData
//       );
//       setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
//       setReplyFiles((prev) => ({ ...prev, [commentId]: null }));
//       fetchComments();
//     } catch (err) {
//       console.error("Failed to post reply:", err);
//     }
//   };

//   const handleKCCommentSubmit = async () => {
//     if (!newKCComment.trim() && !newKCCommentFile) return;
//     try {
//       const formData = new FormData();
//       formData.append("user_id", id);
//       formData.append("userId", user_id);
//       formData.append("application_id", selectedProgram.id);
//       formData.append("text", newKCComment);
//       formData.append("type", tab);
//       formData.append("hidden", false);
//       if (newKCCommentFile) formData.append("file", newKCCommentFile);

//       await axios.post(
//         "https://backend.eaconsultancy.org/api/v1/kcComment/create",
//         formData
//       );
//       setNewKCComment("");
//       setNewKCCommentFile(null);
//       fetchKCComments();
//     } catch (err) {
//       console.error("Failed to post KC comment:", err);
//     }
//   };

//   const handleKCReplySubmit = async (commentId) => {
//     const replyText = replyKCContent[commentId];
//     const file = replyKCFiles[commentId];
//     if (!replyText?.trim() && !file) return;
//     try {
//       const formData = new FormData();
//       formData.append("user_id", id);
//       formData.append("userId", user_id);
//       formData.append("kcComment_id", commentId);
//       formData.append("text", replyText);
//       if (file) formData.append("file", file);

//       await axios.post("https://backend.eaconsultancy.org/api/v1/kcReply/create", formData);
//       setReplyKCContent((prev) => ({ ...prev, [commentId]: "" }));
//       setReplyKCFiles((prev) => ({ ...prev, [commentId]: null }));
//       fetchKCComments();
//     } catch (err) {
//       console.error("Failed to post KC reply:", err);
//     }
//   };

//   const renderCommentList = (
//     comments,
//     repliesKey,
//     replyContentState,
//     setReplyContentState,
//     handleReplySubmitFunc,
//     replyFileState,
//     setReplyFileState
//   ) => (
//     <div className="space-y-4">
//       {comments.length === 0 ? (
//         <p className="text-sm text-gray-500">No comments yet.</p>
//       ) : (
//         comments.map((comment) => (
//           <div key={comment.id} className="border p-3 rounded-md bg-gray-50">
//             <p className="text-sm mb-1 font-medium">
//               {comment.User?.FirstName} {comment.User?.LastName}:
//             </p>
//             <p className="text-sm mb-2 whitespace-pre-line">{comment.text}</p>

//             {comment.file && (
//               <a
//                 href={`https://backend.eaconsultancy.org/${comment.file}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-sm text-blue-600 underline"
//               >
//                 View Attachment
//               </a>
//             )}

//             <div className="ml-4 space-y-2 mt-2">
//               {comment[repliesKey]?.map((reply) => (
//                 <div
//                   key={reply.id}
//                   className="text-sm bg-white p-2 rounded border"
//                 >
//                   <span className="font-medium">
//                     {reply.User?.FirstName} {reply.User?.LastName}:
//                   </span>{" "}
//                   {reply.text}
//                   {reply.file && (
//                     <a
//                       href={`https://backend.eaconsultancy.org/${reply.file}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="ml-2 text-blue-600 underline"
//                     >
//                       (Attachment)
//                     </a>
//                   )}
//                 </div>
//               ))}

//               <div className="flex flex-col gap-1 mt-2">
//                 <textarea
//                   rows={2}
//                   value={replyContentState[comment.id] || ""}
//                   onChange={(e) =>
//                     setReplyContentState((prev) => ({
//                       ...prev,
//                       [comment.id]: e.target.value,
//                     }))
//                   }
//                   placeholder="Write a reply..."
//                   className="border px-2 py-1 rounded text-sm resize-none"
//                 />
//                 <input
//                   type="file"
//                   onChange={(e) =>
//                     setReplyFileState((prev) => ({
//                       ...prev,
//                       [comment.id]: e.target.files[0],
//                     }))
//                   }
//                   className="text-sm"
//                 />
//                 <button
//                   onClick={() => handleReplySubmitFunc(comment.id)}
//                   className="bg-brandBlue text-white px-3 py-1 rounded text-sm"
//                 >
//                   Reply
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );

//   return (
//     <div className="flex flex-col lg:flex-row gap-4 p-4">
//       <div className="lg:w-1/3 w-full flex flex-col gap-4">
//         {programs.map((item) => (
//           <div
//             key={item.id}
//             onClick={() => setSelectedProgram(item)}
//             className={`border rounded-md cursor-pointer ${
//               selectedProgram?.id === item.id
//                 ? "border-brandBlue bg-brandBlue-50"
//                 : "border-gray-300"
//             }`}
//           >
//             <div className="bg-green-100 text-green-800 px-4 py-2 rounded-t-md text-sm font-medium">
//               {item.status}
//             </div>
//             <div className="p-4 text-sm">
//               <div className="mb-2">
//                 <strong>Ack. No:</strong> {item.acknowledge}
//                 <span className="ml-2 bg-red-400 text-white text-xs px-2 py-1 rounded">
//                   {item.priority}
//                 </span>
//               </div>
//               <div>
//                 <strong>Date:</strong> {formatDateTime(item.createdAt)}
//               </div>
//               <div>
//                 <strong>Course:</strong> {item.program}
//               </div>
//               <div>
//                 <strong>University:</strong> {item.university}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="lg:w-2/3 w-full border border-gray-200 rounded-md">
//         {selectedProgram ? (
//           <>
//             <div className="flex justify-between items-center bg-green-100 px-4 py-2 rounded-t-md">
//               <span className="text-sm">
//                 {formatDateTime(selectedProgram.createdAt)}
//               </span>
//               <span className="text-sm text-green-800 font-medium">
//                 {selectedProgram.status}
//               </span>
//             </div>

//             <div className="px-4 py-2">
//               <p className="text-gray-800 font-medium mb-4">
//                 {selectedProgram.program}
//               </p>

//               {role === "student" ? (
//                 // Students see ONLY student tab
//                 <button
//                   className={`px-4 py-2 text-sm font-medium ${
//                     tab === "student"
//                       ? "text-brandBlue border-b-2 border-brandBlue"
//                       : "text-gray-600"
//                   }`}
//                   onClick={() => setTab("student")}
//                 >
//                   Student
//                 </button>
//               ) : (
//                 // Admin / Employee / SuperAdmin / Others see BOTH
//                 <div className="flex border-b mb-4">
//                   <button
//                     className={`px-4 py-2 text-sm font-medium ${
//                       tab === "kc"
//                         ? "text-brandBlue border-b-2 border-brandBlue"
//                         : "text-gray-600"
//                     }`}
//                     onClick={() => setTab("kc")}
//                   >
//                     EduConnect Team
//                   </button>

//                   <button
//                     className={`px-4 py-2 text-sm font-medium ${
//                       tab === "student"
//                         ? "text-brandBlue border-b-2 border-brandBlue"
//                         : "text-gray-600"
//                     }`}
//                     onClick={() => setTab("student")}
//                   >
//                     Student
//                   </button>
//                 </div>
//               )}

//               {tab === "student" ? (
//                 <>
//                   {renderCommentList(
//                     comments,
//                     "studentReplies",
//                     replyContent,
//                     setReplyContent,
//                     handleReplySubmit,
//                     replyFiles,
//                     setReplyFiles
//                   )}
//                   <div className="flex flex-col gap-2 mt-4">
//                     <textarea
//                       rows={3}
//                       value={newComment}
//                       onChange={(e) => setNewComment(e.target.value)}
//                       placeholder="Write comment..."
//                       className="border px-3 py-2 text-sm rounded resize-none"
//                     />
//                     <input
//                       type="file"
//                       onChange={(e) => setNewCommentFile(e.target.files[0])}
//                       className="text-sm"
//                     />
//                     <button
//                       onClick={handleCommentSubmit}
//                       className="bg-brandBlue text-white p-2 rounded"
//                     >
//                       <FiSend size={20} />
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   {renderCommentList(
//                     kcComments,
//                     "kcReplies",
//                     replyKCContent,
//                     setReplyKCContent,
//                     handleKCReplySubmit,
//                     replyKCFiles,
//                     setReplyKCFiles
//                   )}
//                   <div className="flex flex-col gap-2 mt-4">
//                     <textarea
//                       rows={3}
//                       value={newKCComment}
//                       onChange={(e) => setNewKCComment(e.target.value)}
//                       placeholder="Write comment..."
//                       className="border px-3 py-2 text-sm rounded resize-none"
//                     />
//                     <input
//                       type="file"
//                       onChange={(e) => setNewKCCommentFile(e.target.files[0])}
//                       className="text-sm"
//                     />
//                     <button
//                       onClick={handleKCCommentSubmit}
//                       className="bg-brandBlue text-white p-2 rounded"
//                     >
//                       <FiSend size={20} />
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </>
//         ) : (
//           <div className="p-6 text-center text-gray-500">
//             Select an application to see details.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AppliedProgram;

import React, { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";
import { useGetDataByIdQuery } from "../../features/application/application";
import axios from "axios";
import StatusBadge from "../StatusBadge";

const AppliedProgram = ({ user_id }) => {
  const [tab, setTab] = useState("student");
  const id = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const { data, isLoading, isError, error } = useGetDataByIdQuery(user_id);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newCommentFile, setNewCommentFile] = useState(null);
  const [replyContent, setReplyContent] = useState({});
  const [replyFiles, setReplyFiles] = useState({});

  const [kcComments, setKCComments] = useState([]);
  const [newKCComment, setNewKCComment] = useState("");
  const [newKCCommentFile, setNewKCCommentFile] = useState(null);
  const [replyKCContent, setReplyKCContent] = useState({});
  const [replyKCFiles, setReplyKCFiles] = useState({});

  // Set default tab based on role
  useEffect(() => {
    if (role === "student") {
      setTab("student");
    } else {
      setTab("kc");
    }
  }, [role]);

  useEffect(() => {
    if (isError) {
      console.log(error?.data?.message || "An error occurred");
    } else if (!isLoading && data) {
      setPrograms(data.data);
      if (data.data.length > 0) {
        setSelectedProgram(data.data[0]);
      }
    }
  }, [data, isLoading, isError, error]);

  useEffect(() => {
    if (!selectedProgram?.id) return;
    tab === "student" ? fetchComments() : fetchKCComments();
  }, [selectedProgram, tab]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `https://backend.eaconsultancy.org/api/v1/studentComment/${selectedProgram.id}?type=${tab}`,
      );
      setComments(res.data.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const fetchKCComments = async () => {
    try {
      const res = await axios.get(
        `https://backend.eaconsultancy.org/api/v1/kcComment/${selectedProgram.id}?type=${tab}`,
      );
      setKCComments(res.data.data);
    } catch (err) {
      console.error("Failed to fetch KC comments:", err);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() && !newCommentFile) return;
    try {
      const formData = new FormData();
      formData.append("user_id", id);
      formData.append("userId", user_id);
      formData.append("application_id", selectedProgram.id);
      formData.append("text", newComment);
      formData.append("type", tab);
      formData.append("hidden", false);
      if (newCommentFile) formData.append("file", newCommentFile);

      await axios.post(
        "https://backend.eaconsultancy.org/api/v1/studentComment/create",
        formData,
      );
      setNewComment("");
      setNewCommentFile(null);
      fetchComments();
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const handleReplySubmit = async (commentId) => {
    const replyText = replyContent[commentId];
    const file = replyFiles[commentId];
    if (!replyText?.trim() && !file) return;
    try {
      const formData = new FormData();
      formData.append("user_id", id);
      formData.append("userId", user_id);
      formData.append("application_id", selectedProgram.id);
      formData.append("studentComment_id", commentId);
      formData.append("text", replyText);
      if (file) formData.append("file", file);

      await axios.post(
        "https://backend.eaconsultancy.org/api/v1/studentReply/create",
        formData,
      );
      setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
      setReplyFiles((prev) => ({ ...prev, [commentId]: null }));
      fetchComments();
    } catch (err) {
      console.error("Failed to post reply:", err);
    }
  };

  const handleKCCommentSubmit = async () => {
    if (!newKCComment.trim() && !newKCCommentFile) return;
    try {
      const formData = new FormData();
      formData.append("user_id", id);
      formData.append("userId", user_id);
      formData.append("application_id", selectedProgram.id);
      formData.append("text", newKCComment);
      formData.append("type", tab);
      formData.append("hidden", false);
      if (newKCCommentFile) formData.append("file", newKCCommentFile);

      await axios.post(
        "https://backend.eaconsultancy.org/api/v1/kcComment/create",
        formData,
      );
      setNewKCComment("");
      setNewKCCommentFile(null);
      fetchKCComments();
    } catch (err) {
      console.error("Failed to post KC comment:", err);
    }
  };

  const handleKCReplySubmit = async (commentId) => {
    const replyText = replyKCContent[commentId];
    const file = replyKCFiles[commentId];
    if (!replyText?.trim() && !file) return;
    try {
      const formData = new FormData();
      formData.append("user_id", id);
      formData.append("userId", user_id);
      formData.append("application_id", selectedProgram.id);
      formData.append("kcComment_id", commentId);
      formData.append("text", replyText);
      if (file) formData.append("file", file);

      await axios.post(
        "https://backend.eaconsultancy.org/api/v1/kcReply/create",
        formData,
      );
      setReplyKCContent((prev) => ({ ...prev, [commentId]: "" }));
      setReplyKCFiles((prev) => ({ ...prev, [commentId]: null }));
      fetchKCComments();
    } catch (err) {
      console.error("Failed to post KC reply:", err);
    }
  };

  const renderCommentList = (
    comments,
    repliesKey,
    replyContentState,
    setReplyContentState,
    handleReplySubmitFunc,
    replyFileState,
    setReplyFileState,
  ) => (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="border p-3 rounded-md bg-gray-50">
            <p className="text-sm mb-1 font-medium">
              {comment.User?.FirstName} {comment.User?.LastName}:
            </p>
            <p className="text-sm mb-2 whitespace-pre-line">{comment.text}</p>

            {comment.file && (
              <a
                href={`https://backend.eaconsultancy.org/${comment.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline"
              >
                View Attachment
              </a>
            )}

            <div className="ml-4 space-y-2 mt-2">
              {comment[repliesKey]?.map((reply) => (
                <div
                  key={reply.id}
                  className="text-sm bg-white p-2 rounded border"
                >
                  <span className="font-medium">
                    {reply.User?.FirstName} {reply.User?.LastName}:
                  </span>{" "}
                  {reply.text}
                  {reply.file && (
                    <a
                      href={`https://backend.eaconsultancy.org/${reply.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 underline"
                    >
                      (Attachment)
                    </a>
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-1 mt-2">
                <textarea
                  rows={2}
                  value={replyContentState[comment.id] || ""}
                  onChange={(e) =>
                    setReplyContentState((prev) => ({
                      ...prev,
                      [comment.id]: e.target.value,
                    }))
                  }
                  placeholder="Write a reply..."
                  className="border px-2 py-1 rounded text-sm resize-none"
                />
                <input
                  type="file"
                  onChange={(e) =>
                    setReplyFileState((prev) => ({
                      ...prev,
                      [comment.id]: e.target.files[0],
                    }))
                  }
                  className="text-sm"
                />
                <button
                  onClick={() => handleReplySubmitFunc(comment.id)}
                  className="bg-brandBlue text-white px-3 py-1 rounded text-sm"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      <div className="lg:w-1/3 w-full flex flex-col gap-4">
        {programs.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedProgram(item)}
            className={`border rounded-md cursor-pointer ${
              selectedProgram?.id === item.id
                ? "border-brandBlue bg-brandBlue-50"
                : "border-gray-300"
            }`}
          >
            <div className="bg-gray-50 px-4 py-2 rounded-t-md">
              <StatusBadge status={item.status} />
            </div>
            <div className="p-4 text-sm">
              <div className="mb-2">
                <strong>Ack. No:</strong> {item.acknowledge}
                <span className="ml-2 bg-red-400 text-white text-xs px-2 py-1 rounded">
                  {item.priority}
                </span>
              </div>
              <div>
                <strong>Date:</strong> {formatDateTime(item.createdAt)}
              </div>
              <div>
                <strong>Course:</strong> {item.program}
              </div>
              <div>
                <strong>University:</strong> {item.university}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:w-2/3 w-full border border-gray-200 rounded-md">
        {selectedProgram ? (
          <>
            <div className="flex justify-between items-center bg-green-100 px-4 py-2 rounded-t-md">
              <span className="text-sm">
                {formatDateTime(selectedProgram.createdAt)}
              </span>
              <StatusBadge status={selectedProgram.status} />
            </div>

            <div className="px-4 py-2">
              <p className="text-gray-800 font-medium mb-4">
                {selectedProgram.program}
              </p>

              {/* ROLE BASED TAB VISIBILITY */}
              {role === "student" ? (
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    tab === "student"
                      ? "text-brandBlue border-b-2 border-brandBlue"
                      : "text-gray-600"
                  } border-b`}
                  onClick={() => setTab("student")}
                >
                  Student
                </button>
              ) : (
                <div className="flex border-b mb-4">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      tab === "kc"
                        ? "text-brandBlue border-b-2 border-brandBlue"
                        : "text-gray-600"
                    }`}
                    onClick={() => setTab("kc")}
                  >
                    EduConnect Team
                  </button>

                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      tab === "student"
                        ? "text-brandBlue border-b-2 border-brandBlue"
                        : "text-gray-600"
                    }`}
                    onClick={() => setTab("student")}
                  >
                    Student
                  </button>
                </div>
              )}

              {/* COMMENT SECTIONS */}
              {tab === "student" ? (
                <>
                  {renderCommentList(
                    comments,
                    "studentReplies",
                    replyContent,
                    setReplyContent,
                    handleReplySubmit,
                    replyFiles,
                    setReplyFiles,
                  )}
                  <div className="flex flex-col gap-2 mt-4">
                    <textarea
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write comment..."
                      className="border px-3 py-2 text-sm rounded resize-none"
                    />
                    <input
                      type="file"
                      onChange={(e) => setNewCommentFile(e.target.files[0])}
                      className="text-sm"
                    />
                    <button
                      onClick={handleCommentSubmit}
                      className="bg-brandBlue text-white p-2 rounded"
                    >
                      <FiSend size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {renderCommentList(
                    kcComments,
                    "kcReplies",
                    replyKCContent,
                    setReplyKCContent,
                    handleKCReplySubmit,
                    replyKCFiles,
                    setReplyKCFiles,
                  )}
                  <div className="flex flex-col gap-2 mt-4">
                    <textarea
                      rows={3}
                      value={newKCComment}
                      onChange={(e) => setNewKCComment(e.target.value)}
                      placeholder="Write comment..."
                      className="border px-3 py-2 text-sm rounded resize-none"
                    />
                    <input
                      type="file"
                      onChange={(e) => setNewKCCommentFile(e.target.files[0])}
                      className="text-sm"
                    />
                    <button
                      onClick={handleKCCommentSubmit}
                      className="bg-brandBlue text-white p-2 rounded"
                    >
                      <FiSend size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="p-6 text-center text-gray-500">
            Select an application to see details.
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedProgram;
