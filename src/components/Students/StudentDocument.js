import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTrashAlt } from "react-icons/fa";
import { MdOutlineGrading } from "react-icons/md";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Modal, ModalHeader, ModalBody, Button } from "@windmill/react-ui";
import {
  useGetDataByIdQuery,
  useUpdateDocumentMutation,
} from "../../features/document/document";
import {
  useCreateAdditionalDocumentMutation,
  useDeleteAdditionalDocumentMutation,
  useGetSingleAdditionalDataByIdQuery,
  useUpdateAdditionalDocumentMutation,
} from "../../features/additionalDocument/additionalDocument";

const BASE_URL = ""; // Cloudinary URLs are full URLs
const MAX_FILE_SIZE_MB = 5;

const StudentDocument = ({ id }) => {
  const { register, handleSubmit, reset } = useForm();
  const [file, setFile] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [document, setDocument] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [editFile, setEditFile] = useState(null);

  const userId = localStorage.getItem("userId");

  const { data, isLoading, isError, error } = useGetDataByIdQuery(id);
  const [updateDocument] = useUpdateDocumentMutation();

  const { data: additionalDocsData, refetch } =
    useGetSingleAdditionalDataByIdQuery(id);
  const [createAdditionalDocument] = useCreateAdditionalDocumentMutation();
  const [updateAdditionalDocument] = useUpdateAdditionalDocumentMutation();
  const [deleteAdditionalDocument] = useDeleteAdditionalDocumentMutation();

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Failed to load document");
    } else if (!isLoading && data) {
      setDocument(data.data);
    }
  }, [data, isLoading, isError, error]);

  const openPdf = (filePath) => {
    if (!filePath) return;
    const finalUrl = BASE_URL + filePath.replace(/\\/g, "/");
    window.open(finalUrl, "_blank");
  };

  const handleFileChange = (e, fieldName) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`"${fieldName}" exceeds 5MB limit`);
      return;
    }
    setFile((prev) => ({
      ...prev,
      [fieldName]: selectedFile,
    }));
  };

  // const onEditSubmit = async () => {
  //   const formData = new FormData();
  //   let hasFile = false;

  //   Object.entries(file).forEach(([key, value]) => {
  //     if (value) {
  //       formData.append(key, value);
  //       hasFile = true;
  //     }
  //   });

  //   if (!hasFile) {
  //     toast.error("Please select at least one document to upload");
  //     return;
  //   }

  //   const data = {
  //     ...formData,
  //     userId,
  //   };

  //   try {
  //     const res = await updateDocument({ data, id });
  //     if (res.data.success === true) {
  //       toast.success("Mandatory documents updated");
  //       setIsModalOpen(false);
  //       reset();
  //       setFile({});
  //     } else {
  //       toast.error(res?.error?.data?.message || "Update failed");
  //     }
  //   } catch {
  //     toast.error("Something went wrong");
  //   }
  // };

  const onEditSubmit = async () => {
    const formData = new FormData();
    let hasFile = false;

    Object.entries(file).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
        hasFile = true;
      }
    });

    if (!hasFile) {
      toast.error("Please select at least one document to upload");
      return;
    }

    formData.append("userId", userId);

    try {
      const res = await updateDocument({ id, data: formData });
      if (res?.data?.success) {
        toast.success("Mandatory documents updated");
        setIsModalOpen(false);
        reset();
        setFile({});
      } else {
        toast.error(res?.error?.data?.message || "Update failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleAdditionalDocSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fileInput = form.file.files[0];

    if (fileInput && fileInput.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error("File exceeds 5MB limit");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title.value);
    formData.append("file", fileInput);
    formData.append("user_id", id);
    formData.append("userId", userId);

    try {
      const res = await createAdditionalDocument(formData);
      if (res?.data?.success === true) {
        toast.success("Additional document uploaded");
        form.reset();
        refetch();
      } else {
        toast.error(res?.error?.data?.message || "Upload failed");
      }
    } catch {
      toast.error("Failed to upload document");
    }
  };

  const handleDeleteAdditionalDoc = async (docId) => {
    try {
      const res = await deleteAdditionalDocument(docId);
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

  const handleUpdateAdditionalDoc = async (e) => {
    e.preventDefault();

    if (!editDoc?.id) return;

    if (editFile && editFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error("File exceeds 5MB limit");
      return;
    }

    const formData = new FormData();
    formData.append("title", editDoc.title);
    if (editFile) formData.append("file", editFile);
    formData.append("user_id", id);
    formData.append("userId", userId);

    try {
      const res = await updateAdditionalDocument({
        id: editDoc.id,
        data: formData,
      });
      if (res?.data?.success) {
        toast.success("Document updated");
        setEditDoc(null);
        setEditFile(null);
        setEditModalOpen(false);
        refetch();
      } else {
        toast.error(res?.error?.data?.message || "Update failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="border rounded-2xl p-4 mb-6 shadow-sm bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-brandRed font-semibold text-sm">
          <MdOutlineGrading className="w-5 h-5" />
          Mandatory Documents
        </div>
        <button
          onClick={() => {
            reset();
            setFile({});
            setIsModalOpen(true);
          }}
          className="btn btn-outline btn-sm text-brandRed bg-brandLight p-2 rounded-sm"
        >
          Request Edit
        </button>
      </div>

      {document && (
        <>
          <DocumentSection
            title="Std. 10th Certificate & Transcript"
            files={[
              { name: "10th Certificate", path: document.tenthCertificate },
              { name: "10th Marksheet", path: document.tenthMarksheet },
            ]}
            openPdf={openPdf}
          />
          <DocumentSection
            title="Std. 12th Certificate & Transcript"
            files={[
              { name: "12th Marksheet", path: document.twelveMarksheet },
              { name: "12th Certificate", path: document.twelveCertificate },
            ]}
            openPdf={openPdf}
          />
          <DocumentSection
            title="Std. Bachelor Certificate & Transcript"
            files={[
              {
                name: "Bachelor Certificate",
                path: document.bachelorCertificate,
              },
              {
                name: "Bachelor Transcript",
                path: document.bachelorTranscript,
              },
            ]}
            openPdf={openPdf}
          />
          <DocumentSection
            title="Passport, Essay & Instruction Letter"
            files={[
              { name: "Passport", path: document.passport },
              { name: "Essay", path: document.essay },
              { name: "Instruction Letter", path: document.instructionLetter },
            ]}
            openPdf={openPdf}
          />
        </>
      )}

      {/* Additional Documents */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Additional Documents</h3>
        <form
          onSubmit={handleAdditionalDocSubmit}
          className="flex flex-col md:flex-row gap-4 items-start mb-6"
        >
          <input
            type="text"
            name="title"
            placeholder="Document Title"
            required
            className="input border px-3 py-2 rounded w-full md:w-1/2"
          />
          <input
            type="file"
            name="file"
            accept="application/pdf"
            required
            className="input"
          />
          <p>Limit 5MB</p>
          <button
            type="submit"
            className="bg-brandRed text-white px-4 py-2 rounded hover:bg-brandRed-700"
          >
            Upload
          </button>
        </form>

        {additionalDocsData?.data?.length > 0 ? (
          <div className="space-y-3">
            {additionalDocsData.data.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded bg-gray-50 hover:bg-gray-100"
              >
                <a
                  href={`${BASE_URL}${doc.file?.replace(/\\/g, "/")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brandRed"
                >
                  {doc.title}
                </a>
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => {
                      setEditDoc({ id: doc.id, title: doc.title });
                      setEditFile(null);
                      setEditModalOpen(true);
                    }}
                    className="text-blue-500 text-sm"
                  >
                    Edit
                  </button>
                  <FaTrashAlt
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteAdditionalDoc(doc.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No additional documents uploaded yet.
          </p>
        )}
      </div>

      {/* Mandatory Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>
          Mandatory Document Upload (Filesize Limit 5MB)
        </ModalHeader>
        <ModalBody className="max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onEditSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Std. 10th Certificate", name: "tenthCertificate" },
                { label: "Std. 10th Transcript", name: "tenthMarksheet" },
                { label: "Std. 12th Certificate", name: "twelveCertificate" },
                { label: "Std. 12th Transcript", name: "twelveMarksheet" },
                { label: "Bachelor Certificate", name: "bachelorCertificate" },
                { label: "Bachelor Transcript", name: "bachelorTranscript" },
                { label: "Passport", name: "passport" },
                { label: "SOP", name: "essay" },
                { label: "Instruction Letter", name: "instructionLetter" },
              ].map((input, idx) => (
                <div key={idx} className="mb-4">
                  <label className="block text-sm mb-1 text-gray-700">
                    {input.label}
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, input.name)}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button type="submit" style={{ backgroundColor: "#C71320" }}>
                Save
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>

      {/* Additional Doc Edit Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <ModalHeader>Edit Additional Document</ModalHeader>
        <ModalBody>
          <form onSubmit={handleUpdateAdditionalDoc} className="space-y-4">
            <input
              type="text"
              value={editDoc?.title || ""}
              onChange={(e) =>
                setEditDoc({ ...editDoc, title: e.target.value })
              }
              className="input border p-2 w-full"
              placeholder="Document Title"
              required
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setEditFile(e.target.files[0])}
            />
            <div className="flex justify-end gap-3 mt-2">
              <Button
                onClick={() => setEditModalOpen(false)}
                className="bg-brandRed"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-brandRed text-white">
                Update
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
};

const DocumentSection = ({ title, files, openPdf }) => (
  <div className="mb-8">
    <h2 className="text-lg font-semibold">
      {title} <span className="text-red-500">*</span>
    </h2>
    <div className="flex flex-wrap gap-4 my-4">
      {files.map(
        (file, index) =>
          file.path && (
            <div
              key={index}
              onClick={() => openPdf(file.path)}
              className="flex items-center border rounded-lg px-3 py-2 bg-gray-100 cursor-pointer hover:bg-gray-200"
            >
              <span className="text-sm">{file.name}</span>
            </div>
          ),
      )}
    </div>
  </div>
);

export default StudentDocument;
