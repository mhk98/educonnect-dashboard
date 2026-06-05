import React, { useEffect, useState } from "react";
import { FiSend } from "react-icons/fi";
import { useGetDataByIdQuery } from "../../features/application/application";
import axios from "axios";

const History = ({ id }) => {
  const userId = localStorage.getItem("userId");
  const branch = localStorage.getItem("branch");

  const { data, isLoading, isError, error } = useGetDataByIdQuery(id);

  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newCommentFile, setNewCommentFile] = useState(null);
  const [replyContent, setReplyContent] = useState({});
  const [replyFiles, setReplyFiles] = useState({});

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

  // Fetch comments on load
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/leadComment/${id}`,
      );
      setComments(res.data.data); // Assuming `res.data.data` holds array
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() && !newCommentFile) return;

    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("lead_id", id);
      formData.append("location", branch);
      formData.append("text", newComment);
      if (newCommentFile) formData.append("file", newCommentFile);

      await axios.post(
        "http://localhost:5000/api/v1/leadComment/create",
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
      formData.append("user_id", userId);
      formData.append("lead_id", id);
      formData.append("location", branch);
      formData.append("comment_id", commentId); // ✅ match Sequelize foreignKey
      formData.append("text", replyText);
      if (file) formData.append("file", file);

      await axios.post(
        "http://localhost:5000/api/v1/leadReply/create",
        formData,
      );
      setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
      setReplyFiles((prev) => ({ ...prev, [commentId]: null }));
      fetchComments();
    } catch (err) {
      console.error("Failed to post reply:", err);
    }
  };

  const renderCommentList = () => (
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
                href={comment.file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline"
              >
                View Attachment
              </a>
            )}

            {/* Replies */}
            <div className="ml-4 space-y-2 mt-2">
              {(comment.leadReplies || []).map((reply) => (
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
                      href={reply.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 underline"
                    >
                      (Attachment)
                    </a>
                  )}
                </div>
              ))}

              {/* Reply input */}
              <div className="flex flex-col gap-1 mt-2">
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
                  className="border px-2 py-1 rounded text-sm resize-none"
                />
                <input
                  type="file"
                  onChange={(e) =>
                    setReplyFiles((prev) => ({
                      ...prev,
                      [comment.id]: e.target.files[0],
                    }))
                  }
                  className="text-sm"
                />
                <button
                  onClick={() => handleReplySubmit(comment.id)}
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
    <div className="px-4 py-2">
      {renderCommentList()}
      {/* New comment input */}
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
          className="bg-brandBlue text-white p-2 rounded flex items-center justify-center"
        >
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default History;
