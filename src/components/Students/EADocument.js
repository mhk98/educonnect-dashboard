import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  useCreateEADocumentMutation,
  useDeleteEADocumentMutation,
  useGetAllEADocumentQuery,
} from "../../features/eaDocument/eaDocument";

const BASE_URL = ""; // Cloudinary URLs are full URLs

const EADocument = ({ id }) => {
  const [file, setFile] = useState(null);
  const [document, setDocument] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const {
    data,
    isLoading: queryLoading,
    isError,
    error,
    refetch,
  } = useGetAllEADocumentQuery(id);

  console.log("studentid", id);

  const [createEADocument] = useCreateEADocumentMutation();
  const [deleteEADocument] = useDeleteEADocumentMutation();

  useEffect(() => {
    if (isError) {
      // toast.error(error?.data?.message || "Failed to load documents.");a
      console.log(error?.data?.message);
    } else if (!queryLoading && data?.data) {
      setDocument(data.data);
    }
  }, [data, queryLoading, isError, error]);

  const handleEADocSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    const selectedFile = file;
    if (!selectedFile) {
      toast.error("Please select a file.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    formData.append("title", form.title.value);
    formData.append("file", selectedFile);
    formData.append("user_id", id);
    formData.append("userId", userId);

    try {
      setIsLoading(true);
      const res = await createEADocument(formData);
      if (res?.data?.success) {
        toast.success("Document uploaded successfully");
        form.reset();
        setFile(null);
        refetch();
      } else {
        toast.error(res?.error?.data?.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEADoc = async (docId) => {
    try {
      const res = await deleteEADocument(docId);
      if (res?.data?.success) {
        toast.success("Document deleted");
        refetch();
      } else {
        toast.error("Failed to delete document");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="border rounded-2xl p-4 mb-6 shadow-sm bg-white">
      <div className="mt-2">
        <h3 className="text-lg font-semibold mb-4">EduConnect Documents</h3>

        {role === "superAdmin" && (
          <form
            onSubmit={handleEADocSubmit}
            className="flex flex-col md:flex-row gap-4 items-start mb-6"
          >
            <input
              type="text"
              name="title"
              placeholder="Document Title"
              required
              className="input border px-3 py-2 rounded w-full md:w-1/2"
            />
            <div className="flex flex-col gap-1">
              <input
                type="file"
                name="file"
                accept=".pdf, .doc, .docx, .png, .jpg, .jpeg"
                required
                className="input"
                onChange={(e) => {
                  const selected = e.target.files[0];
                  if (selected && selected.size > 5 * 1024 * 1024) {
                    toast.error("File size must be under 5MB");
                    e.target.value = "";
                    setFile(null);
                  } else {
                    setFile(selected);
                  }
                }}
              />
              {file && (
                <p className="text-sm text-gray-700">
                  Selected: <strong>{file.name}</strong> (
                  {(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              <p className="text-xs text-gray-500">
                Max 5MB. Allowed: PDF, DOCX, PNG, JPG
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-brandBlue text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </form>
        )}

        {queryLoading && <p className="text-gray-500">Loading documents...</p>}

        {document?.length > 0 ? (
          <div className="space-y-3">
            {document.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded bg-gray-50 hover:bg-gray-100"
              >
                <span className="text-sm text-brandBlue">
                  <a
                    href={`${BASE_URL}${doc.file?.replace(/\\/g, "/")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {doc.title}
                  </a>
                </span>
                <FaTrashAlt
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDeleteEADoc(doc.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          !queryLoading && (
            <p className="text-sm text-gray-500">
              No EduConnect documents uploaded yet.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default EADocument;
