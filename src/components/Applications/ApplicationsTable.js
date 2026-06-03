// import React, { useState, useEffect, useMemo } from "react";
// import { LiaEditSolid } from "react-icons/lia";
// import { Link } from "react-router-dom/cjs/react-router-dom";
// import {
//   Input,
//   Label,
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
// } from "@windmill/react-ui";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { BiShow, BiSolidTrashAlt } from "react-icons/bi";
// import {
//   useDeleteApplicationMutation,
//   useGetAllApplicationQuery,
//   useUpdateApplicationMutation,
// } from "../../features/application/application";
// import axios from "axios";

// export default function ApplicationsTable() {
//   const [filters, setFilters] = useState({
//     FirstName: "",
//     LastName: "",
//     country: "",
//     university: "",
//     intake: "",
//     StudentId: "",
//     Branch: "",
//   });

//   const [stdId, setStdId] = useState("");
//   const [applicationId, setApplicationId] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 20;

//   const role = localStorage.getItem("role");
//   const Branch = localStorage.getItem("branch");
//   const userId = localStorage.getItem("userId");

//   const queryArgs =
//     role === "superAdmin"
//       ? {
//           ...filters,
//           user_id: filters.StudentId,
//           page: currentPage,
//           limit: itemsPerPage,
//         }
//       : role === "admin" || role === "employee"
//       ? {
//           Branch,
//           ...filters,
//           user_id: filters.StudentId,
//           page: currentPage,
//           limit: itemsPerPage,
//         }
//       : role === "student"
//       ? {
//           user_id: userId,
//           page: currentPage,
//           limit: itemsPerPage,
//         }
//       : null;

//   console.log("ApplicationQuery", queryArgs);
//   console.log("Branch", Branch);

//   const { data, isLoading } = useGetAllApplicationQuery(queryArgs, {
//     skip: !queryArgs,
//   });

//   const [updateApplication] = useUpdateApplicationMutation();
//   const [deleteApplication] = useDeleteApplicationMutation();

//   const students = useMemo(() => data?.data || [], [data]);

//   const { register, handleSubmit, reset } = useForm();

//   const onFormEdit = async (formData) => {
//     const payload = {
//       assignee: formData.assignee,
//       status: formData.status,
//       user_id: stdId,
//     };

//     try {
//       const res = await updateApplication({ id: applicationId, data: payload });
//       if (res.data?.success) {
//         toast.success(res.data.message);
//         reset();
//         setIsModalOpen(false);
//       } else {
//         toast.error(res.error?.data?.message || "Update failed.");
//       }
//     } catch {
//       toast.error("An unexpected error occurred.");
//     }
//   };

//   const handleDeleteApplication = async (acknowledge) => {
//     try {
//       const res = await deleteApplication(acknowledge);
//       if (res.data?.success) {
//         toast.success(res.data.message);
//       } else {
//         toast.error(res.error?.data?.message || "Deletion failed.");
//       }
//     } catch {
//       toast.error("An unexpected error occurred.");
//     }
//   };

//   const [admins, setAdmins] = useState([]);
//   const [superAdmins, setSuperAdmins] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get(
//           "https://backend.eaconsultancy.org/api/v1/user/student"
//         );
//         const all = res.data.data;
//         setAdmins(
//           all.filter(
//             (u) => u.Role?.toLowerCase() !== "student" && u.Branch === Branch
//           )
//         );
//         setSuperAdmins(all.filter((u) => u.Role?.toLowerCase() !== "student"));
//       } catch (err) {
//         console.error("Error fetching users:", err);
//       }
//     };
//     fetchUsers();
//   }, [Branch]);

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return isNaN(date.getTime())
//       ? ""
//       : date.toLocaleDateString("en-GB", {
//           day: "2-digit",
//           month: "long",
//           year: "numeric",
//         });
//   };

//   const renderTableRows = (dataToRender) =>
//     dataToRender.map((program, idx) => (
//       <tr
//         key={program.id}
//         className={`text-sm border-t border-gray-200 ${
//           idx % 2 === 0 ? "bg-gray-50" : "bg-white"
//         }`}
//       >
//         <td className="p-3">{program.user_id}</td>
//         <td className="p-3">{program.acknowledge}</td>
//         <td className="p-3">{formatDate(program.createdAt)}</td>
//         <td className="p-3">
//           {program.FirstName} {program.LastName}
//         </td>
//         <td className="p-3">{program.university}</td>
//         <td className="p-3">{program.program}</td>
//         <td className="p-3">{program.intake}</td>
//         <td className="p-3">
//           {program.FirstName} {program.LastName}
//         </td>
//         <td className="p-3">{program.status}</td>
//         <td className="p-3">{program.assignee}</td>
//         <td className="p-3 flex gap-3 text-brandBlue">
//           <Link to={`/app/editprofile/${program.user_id}`}>
//             <BiShow fontSize={20} className="cursor-pointer" />
//           </Link>
//           <LiaEditSolid
//             fontSize={20}
//             className="cursor-pointer"
//             onClick={() => {
//               setIsModalOpen(true);
//               setStdId(program.user_id);
//               setApplicationId(program.id);
//             }}
//           />
//           {role === "superAdmin" && (
//             <BiSolidTrashAlt
//               onClick={() => handleDeleteApplication(program.acknowledge)}
//               className="cursor-pointer"
//             />
//           )}
//         </td>
//       </tr>
//     ));

//   const clearFilters = () => {
//     setFilters({
//       FirstName: "",
//       LastName: "",
//       country: "",
//       university: "",
//       intake: "",
//       StudentId: "",
//       Branch: "",
//     });
//     setCurrentPage(1);
//   };

//   return (
//     <div className="overflow-x-auto p-4">
//       {/* Filters */}
//       {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//         {Object.keys(filters).map((key) => (
//           <Label key={key}>
//             <span>{key.replace(/([A-Z])/g, " $1")}</span>
//             <Input
//               value={filters[key]}
//               onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
//               className="mt-1"
//               placeholder={key}
//             />
//           </Label>
//         ))}
//         <div className="flex items-end gap-2">
//           <Button className="w-full bg-brandBlue text-white" onClick={clearFilters}>
//             Clear
//           </Button>
//         </div>
//       </div> */}

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//         {[
//           "FirstName",
//           "LastName",
//           "country",
//           "university",
//           "intake",
//           "StudentId",
//         ].map((key) => (
//           <Label key={key}>
//             <span>
//               {key
//                 .replace(/([A-Z])/g, " $1")
//                 .replace(/^./, (str) => str.toUpperCase())}
//             </span>
//             <Input
//               value={filters[key]}
//               onChange={(e) =>
//                 setFilters({ ...filters, [key]: e.target.value })
//               }
//               className="mt-1"
//               placeholder={key}
//             />
//           </Label>
//         ))}
//         <Label>
//           <span htmlFor="Branch" className="block mb-1">
//             Branch
//           </span>
//           <select
//             id="Branch"
//             name="Branch"
//             value={filters.Branch}
//             onChange={(e) => setFilters({ ...filters, Branch: e.target.value })}
//             className="w-full border rounded p-2"
//           >
//             <option value="">Select Branch</option>
//             {[
//               "Edu Anchor",
//               "Dhaka",
//               "Khulna",
//               "Barishal",
//               "Satkhira",
//               "Tangail",
//               "Jashore",
//               "Rangpur",
//               "Dinajpur",
//               "Gopalganj",
//               "Savar",
//               "Feni",
//             ].map((branch) => (
//               <option key={branch} value={branch}>
//                 {branch}
//               </option>
//             ))}
//           </select>
//         </Label>
//         <div className="flex items-end gap-2">
//           <Button
//             className="w-full bg-brandBlue text-white"
//             onClick={clearFilters}
//           >
//             Clear
//           </Button>
//         </div>
//       </div>

//       {/* Table */}
//       <table className="min-w-full w-full border border-gray-200 bg-white shadow-md rounded-lg">
//         <thead className="bg-gray-100 text-sm text-gray-700">
//           <tr className="text-left">
//             <th className="p-3">Student ID</th>
//             <th className="p-3">Ack No</th>
//             <th className="p-3">Date Created</th>
//             <th className="p-3">Student</th>
//             <th className="p-3">University</th>
//             <th className="p-3">Program</th>
//             <th className="p-3">Intake</th>
//             <th className="p-3">Created</th>
//             <th className="p-3">Status</th>
//             <th className="p-3">Assignee</th>
//             <th className="p-3">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {isLoading ? (
//             <tr>
//               <td colSpan="11" className="p-4 text-center text-gray-500">
//                 Loading...
//               </td>
//             </tr>
//           ) : students.length > 0 ? (
//             renderTableRows(students)
//           ) : (
//             <tr>
//               <td colSpan="11" className="p-4 text-center text-gray-500">
//                 No student applications found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       {data?.meta && (
//         <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-600">
//           <div>
//             Showing{" "}
//             <strong>
//               {(currentPage - 1) * itemsPerPage + 1} -{" "}
//               {Math.min(currentPage * itemsPerPage, data.meta.total)}
//             </strong>{" "}
//             of <strong>{data.meta.total}</strong>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             >
//               Prev
//             </Button>
//             <Button
//               disabled={currentPage * itemsPerPage >= data.meta.total}
//               onClick={() => setCurrentPage((p) => p + 1)}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Modal */}
//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <ModalHeader className="mb-8">Edit Application</ModalHeader>
//         <ModalBody>
//           <form onSubmit={handleSubmit(onFormEdit)}>
//             <div className="grid grid-cols-1 gap-4">
//               {role === "superAdmin" && (
//                 <Label>
//                   <span>Status</span>
//                   <select
//                     {...register("status")}
//                     className="input input-bordered w-full shadow-md p-3"
//                   >
//                     <option value="">Select Status</option>
//                     <option value="Application Submitted">
//                       Application Submitted
//                     </option>
//                     <option value="University Application Initiated">
//                       University Application Initiated
//                     </option>
//                     <option value="Offer Recieved">Offer Received</option>
//                     <option value="Tuition Fees Paid">Tuition Fees Paid</option>
//                     <option value="LOA Received">LOA Received</option>
//                     <option value="Visa Submitted">Visa Submitted</option>
//                     <option value="Visa Received">Visa Received</option>
//                     <option value="Case Closed">Case Closed</option>
//                   </select>
//                 </Label>
//               )}
//               <Label>
//                 <span>Assignee</span>
//                 <select
//                   {...register("assignee")}
//                   className="input input-bordered w-full shadow-md p-3"
//                 >
//                   <option value="">Select Assignee</option>
//                   {(role === "superAdmin" ? superAdmins : admins).map(
//                     (admin) => (
//                       <option
//                         key={admin.id}
//                         value={`${admin.FirstName} ${admin.LastName}`}
//                       >
//                         {admin.FirstName} {admin.LastName}
//                       </option>
//                     )
//                   )}
//                 </select>
//               </Label>
//             </div>
//             <div className="flex justify-end gap-2 mt-6">
//               <Button type="submit" style={{ backgroundColor: "#1B2E6B" }}>
//                 Save
//               </Button>
//             </div>
//           </form>
//         </ModalBody>
//       </Modal>
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo } from "react";
import { LiaEditSolid } from "react-icons/lia";
import { Link } from "react-router-dom/cjs/react-router-dom";
import {
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BiShow, BiSolidTrashAlt } from "react-icons/bi";
import {
  useDeleteApplicationMutation,
  useGetAllApplicationQuery,
  useUpdateApplicationMutation,
} from "../../features/application/application";
import axios from "axios";
import { useGetAllBranchQuery } from "../../features/branch/branch";
import StatusBadge from "../StatusBadge";

export default function ApplicationsTable() {
  const [stdId, setStdId] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const role = localStorage.getItem("role");
  const Branch = localStorage.getItem("branch");
  const userId = localStorage.getItem("userId");
  const [searchValue, setSearchValue] = useState("");
  const [filterBranch, setFilterBranch] = useState("");

  const {
    data: branchData,
    isLoading: branchLoading,
    isError: branchError,
  } = useGetAllBranchQuery();

  const queryArgs =
    role === "superAdmin"
      ? {
          // ...filters,
          // user_id: filters.StudentId,
          Branch: filterBranch,
          searchTerm: searchValue,
          page: currentPage,
          limit: itemsPerPage,
        }
      : role === "admin" || role === "employee"
        ? {
            searchTerm: searchValue,
            Branch,
            page: currentPage,
            limit: itemsPerPage,
          }
        : role === "student"
          ? {
              user_id: userId,
              page: currentPage,
              limit: itemsPerPage,
            }
          : null;

  const { data, isLoading } = useGetAllApplicationQuery(queryArgs, {
    skip: !queryArgs,
  });

  const [updateApplication] = useUpdateApplicationMutation();
  const [deleteApplication] = useDeleteApplicationMutation();

  const students = useMemo(() => data?.data || [], [data]);

  const { register, handleSubmit, reset } = useForm();

  const onFormEdit = async (formData) => {
    const payload = {
      assignee: formData.assignee,
      status: formData.status,
      user_id: stdId,
      userId: userId,
    };

    try {
      const res = await updateApplication({ id: applicationId, data: payload });
      if (res.data?.success) {
        toast.success(res.data.message);
        reset();
        setIsModalOpen(false);
      } else {
        toast.error(res.error?.data?.message || "Update failed.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleDeleteApplication = async (acknowledge) => {
    try {
      const res = await deleteApplication(acknowledge);
      if (res.data?.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.error?.data?.message || "Deletion failed.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  const [admins, setAdmins] = useState([]);
  const [superAdmins, setSuperAdmins] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://backend.eaconsultancy.org/api/v1/user/student",
        );
        const all = res.data.data;
        setAdmins(
          all.filter(
            (u) => u.Role?.toLowerCase() !== "student" && u.Branch === Branch,
          ),
        );
        setSuperAdmins(all.filter((u) => u.Role?.toLowerCase() !== "student"));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [Branch]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
  };

  const renderTableRows = (dataToRender) =>
    dataToRender.map((program, idx) => (
      <tr
        key={program.id}
        className={`text-sm border-t border-gray-200 ${
          idx % 2 === 0 ? "bg-gray-50" : "bg-white"
        }`}
      >
        <td className="p-3">{program.user_id}</td>
        <td className="p-3">{program.acknowledge}</td>
        <td className="p-3">{formatDate(program.createdAt)}</td>
        <td className="p-3">
          {program.FirstName} {program.LastName}
        </td>
        <td className="p-3">{program.university}</td>
        <td className="p-3">{program.program}</td>
        <td className="p-3">{program.intake}</td>
        <td className="p-3">
          {program.FirstName} {program.LastName}
        </td>
        <td className="p-3">
          <StatusBadge status={program.status} />
        </td>
        <td className="p-3">{program.assignee}</td>
        <td className="p-3 flex gap-3 text-brandBlue">
          <Link to={`/app/editprofile/${program.user_id}`}>
            <BiShow fontSize={20} className="cursor-pointer" />
          </Link>
          <LiaEditSolid
            fontSize={20}
            className="cursor-pointer"
            onClick={() => {
              setIsModalOpen(true);
              setStdId(program.user_id);
              setApplicationId(program.id);
              reset({
                assignee: program.assignee || "",
                status: program.status || "",
              });
            }}
          />
          {role === "superAdmin" && (
            <BiSolidTrashAlt
              onClick={() => handleDeleteApplication(program.acknowledge)}
              className="cursor-pointer"
            />
          )}
        </td>
      </tr>
    ));

  const clearFilters = () => {
    setSearchValue("");
    setFilterBranch("");
    setCurrentPage(1);
  };

  return (
    <div className="p-3 sm:p-4 max-w-7xl mx-auto">
      {/* Filters */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {Object.keys(filters).map((key) => (
          <Label key={key}>
            <span>{key.replace(/([A-Z])/g, " $1")}</span>
            <Input
              value={filters[key]}
              onChange={(e) =>
                setFilters({ ...filters, [key]: e.target.value })
              }
              className="mt-1"
              placeholder={key}
            />
          </Label>
        ))}
        <div className="flex items-end gap-2">
          <Button
            className="w-full bg-brandBlue text-white"
            onClick={clearFilters}
          >
            Clear
          </Button>
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 bg-white rounded-xl shadow-sm p-3 sm:p-4">
        {/* {[
          "FirstName",
          "LastName",
          "country",
          "university",
          "intake",
          "StudentId",
        ].map((key) => (
          <Label key={key}>
            <span>
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </span>
            <Input
              value={filters[key]}
              onChange={(e) =>
                setFilters({ ...filters, [key]: e.target.value })
              }
              className="mt-1"
              placeholder={key}
            />
          </Label>
        ))} */}
        <Label>
          <span className="text-sm text-gray-700">Search Applications</span>
          {/* <span>First Name</span> */}
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="mt-1"
            placeholder="Search..."
          />
        </Label>
        {role === "superAdmin" && (
          <Label>
            <span className="text-sm text-gray-700">Branch</span>
            {/* <span htmlFor="Branch" className="block mb-1">
              Branch
            </span> */}
            <Label>
              {/* <span htmlFor="Branch" className="block mb-1">
                      Branch
                    </span> */}
              <select
                id="Branch"
                name="Branch"
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                className="w-full border rounded p-2 mt-1"
              >
                <option value="">Select Branch</option>
                {branchLoading && <option disabled>Loading branches...</option>}
                {branchError && (
                  <option disabled>Error loading branches</option>
                )}
                {branchData?.data?.map((branchItem) => (
                  <option
                    key={branchItem.id || branchItem._id || branchItem.name}
                    value={
                      branchItem.branch || branchItem.name || branchItem.Branch
                    }
                  >
                    {branchItem.branch || branchItem.name || branchItem.Branch}
                  </option>
                ))}
              </select>
            </Label>
          </Label>
        )}

        <div className="flex items-end gap-2">
          <Button
            className="w-full bg-brandBlue text-white"
            onClick={clearFilters}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full w-full border border-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr className="text-left">
              <th className="p-3">Student ID</th>
              <th className="p-3">Ack No</th>
              <th className="p-3">Date Created</th>
              <th className="p-3">Student</th>
              <th className="p-3">University</th>
              <th className="p-3">Program</th>
              <th className="p-3">Intake</th>
              <th className="p-3">Created</th>
              <th className="p-3">Status</th>
              <th className="p-3">Assignee</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="11" className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : students.length > 0 ? (
              renderTableRows(students)
            ) : (
              <tr>
                <td colSpan="11" className="p-4 text-center text-gray-500">
                  No student applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-xl p-6 text-center text-sm text-gray-500 shadow-sm">
            Loading applications...
          </div>
        ) : students.length > 0 ? (
          students.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 break-words">
                    {program.FirstName} {program.LastName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 break-words">
                    {program.university || "N/A"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    ID: {program.user_id || "N/A"} | Ack:{" "}
                    {program.acknowledge || "N/A"}
                  </p>
                </div>

                <StatusBadge
                  status={program.status}
                  className="flex-shrink-0"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase text-gray-500">Program</p>
                  <p className="font-medium text-gray-800 break-words">
                    {program.program || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Intake</p>
                  <p className="font-medium text-gray-800 break-words">
                    {program.intake || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Assignee</p>
                  <p className="font-medium text-gray-800 break-words">
                    {program.assignee || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-500">Date</p>
                  <p className="font-medium text-gray-800 break-words">
                    {formatDate(program.createdAt) || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(true);
                    setStdId(program.user_id);
                    setApplicationId(program.id);
                    reset({
                      assignee: program.assignee || "",
                      status: program.status || "",
                    });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700"
                >
                  <LiaEditSolid />
                  Edit
                </button>
                <Link
                  to={`/app/editprofile/${program.user_id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brandBlue px-3 py-2 text-sm text-white"
                >
                  <BiShow />
                  View
                </Link>
              </div>

              {role === "superAdmin" && (
                <button
                  type="button"
                  onClick={() => handleDeleteApplication(program.acknowledge)}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  <BiSolidTrashAlt />
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-6 text-center text-sm text-gray-500 shadow-sm">
            No student applications found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {/* {data?.meta && (
        <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-600">
          <div>
            Showing{" "}
            <strong>
              {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, data.meta.total)}
            </strong>{" "}
            of <strong>{data.meta.total}</strong>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              Prev
            </Button>
            <Button
              disabled={currentPage * itemsPerPage >= data.meta.total}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )} */}

      {data?.meta && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 px-2 text-sm text-gray-600">
          {/* Left info */}
          <div>
            Showing{" "}
            <strong>
              {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, data.meta.total)}
            </strong>{" "}
            of <strong>{data.meta.total}</strong>
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
              disabled={currentPage * itemsPerPage >= data.meta.total}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition
          ${
            currentPage * itemsPerPage >= data.meta.total
              ? "bg-brandDisable cursor-not-allowed"
              : "bg-brandBlue hover:bg-brandHover"
          }`}
            >
              Next →
            </Button>
          </div>
        </div>
      )}
      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader className="mb-8">Edit Application</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onFormEdit)}>
            <div className="grid grid-cols-1 gap-4">
              {role === "superAdmin" && (
                <Label>
                  <span>Status</span>
                  <select
                    {...register("status")}
                    className="input input-bordered w-full shadow-md p-3"
                  >
                    <option value="">Select Status</option>
                    <option value="Application Submitted">
                      Application Submitted
                    </option>
                    <option value="University Application Initiated">
                      University Application Initiated
                    </option>
                    <option value="Offer Recieved">Offer Received</option>
                    <option value="Tuition Fees Paid">Tuition Fees Paid</option>
                    <option value="LOA Received">LOA Received</option>
                    <option value="Visa Submitted">Visa Submitted</option>
                    <option value="Visa Received">Visa Received</option>
                    <option value="Case Closed">Case Closed</option>
                  </select>
                </Label>
              )}
              <Label>
                <span>Assignee</span>
                <select
                  {...register("assignee")}
                  className="input input-bordered w-full shadow-md p-3"
                >
                  <option value="">Select Assignee</option>
                  {(role === "superAdmin" ? superAdmins : admins).map(
                    (admin) => (
                      <option
                        key={admin.id}
                        value={`${admin.FirstName} ${admin.LastName}`}
                      >
                        {admin.FirstName} {admin.LastName}
                      </option>
                    ),
                  )}
                </select>
              </Label>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
              <Button
                type="button"
                layout="outline"
                className="w-full sm:w-auto"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: "#1B2E6B" }}
                className="w-full sm:w-auto"
              >
                Save
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
