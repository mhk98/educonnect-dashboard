// import React, { useEffect, useState } from "react";
// import {
//   Input,
//   Label,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   Button,
// } from "@windmill/react-ui";
// import {
//   useDeleteUserMutation,
//   useGetAllUserQuery,
//   useUpdateUserMutation,
// } from "../../features/auth/auth";
// import axios from "axios";
// import { useGetAllBranchQuery } from "../../features/branch/branch";
// import { BiSolidTrashAlt } from "react-icons/bi";
// import { LiaEditSolid } from "react-icons/lia";
// import { useForm } from "react-hook-form";

// const UserManagementFilter = () => {
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   // Search input states
//   const [searchValue, setSearchValue] = useState("");
//   const [firstNameInput, setFirstNameInput] = useState("");
//   const [lastNameInput, setLastNameInput] = useState("");
//   const [emailInput, setEmailInput] = useState("");

//   // Filtered query states
//   const [searchFilter, setSearchFilter] = useState({
//     FirstName: "",
//     LastName: "",
//     Email: "",
//   });

//   const { data, isLoading, isError, error, refetch } = useGetAllUserQuery(
//     {
//       roleMode: "excludeStudent",
//       FirstName: firstNameInput,
//       LastName: lastNameInput,
//       Email: emailInput,
//       page,
//       limit,
//     },
//     // { refetchOnMountOrArgChange: true }
//   );

//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     if (isError) {
//       console.error("Error fetching user data", error);
//     } else if (!isLoading && data) {
//       setUsers(data.data);
//       // setTotalPages(Math.ceil(data.meta.total / itemsPerPage));
//     }
//   }, [data, isLoading, isError, error]);

//   console.log("users", users);
//   const [updateUser] = useUpdateUserMutation();
//   const [deleteUser] = useDeleteUserMutation();

//   const {
//     register,
//     formState: { errors },
//     handleSubmit,
//     reset,
//   } = useForm();

//   const [userId, setUserId] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const onFormEdit = async (formData) => {
//     try {
//       const res = await updateUser({ id: userId, data: formData });
//       if (res.data?.success) {
//         toast.success(res.data.message);
//         refetch();
//         setIsModalOpen(false);
//       } else {
//         toast.error(res.error?.data?.message || "Update failed.");
//       }
//     } catch {
//       toast.error("An unexpected error occurred.");
//     }
//   };

//   const handleDeleteUser = async (id) => {
//     try {
//       const res = await deleteUser(id);
//       if (res.data?.success) {
//         toast.success(res.data.message);
//         refetch();
//       } else {
//         toast.error(res.error?.data?.message || "Deletion failed.");
//       }
//     } catch {
//       toast.error("An unexpected error occurred.");
//     }
//   };

//   const handleClearSearch = () => {
//     setFirstNameInput("");
//     setLastNameInput("");
//     setEmailInput("");
//   };

//   const handleEnter = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const form = e.target.form;
//       const index = Array.prototype.indexOf.call(form, e.target);
//       form.elements[index + 1]?.focus();
//     }
//   };

//   return (
//     <div className="w-full bg-white rounded-lg shadow-sm p-4">
//       {/* Search Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//         <Label>
//           <span>First Name</span>
//           <Input
//             value={firstNameInput}
//             onChange={(e) => setFirstNameInput(e.target.value)}
//             className="mt-1"
//             placeholder="First Name"
//           />
//         </Label>
//         <Label>
//           <span>Last Name</span>
//           <Input
//             value={lastNameInput}
//             onChange={(e) => setLastNameInput(e.target.value)}
//             className="mt-1"
//             placeholder="Last Name"
//           />
//         </Label>
//         <Label>
//           <span>Email</span>
//           <Input
//             value={emailInput}
//             onChange={(e) => setEmailInput(e.target.value)}
//             className="mt-1"
//             placeholder="Email"
//           />
//         </Label>
//         <div className="flex items-end gap-2">
//           <Button
//             onClick={handleClearSearch}
//             className="w-full bg-brandBlue text-white"
//           >
//             Clear
//           </Button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="w-full overflow-x-auto">
//         <table className="w-full text-sm text-left text-gray-700 bg-white shadow-md rounded-lg">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-3">First Name</th>
//               <th className="p-3">Last Name</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Phone</th>
//               <th className="p-3">Role</th>
//               <th className="p-3">Branch</th>
//               <th className="p-3">Profile</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users?.map((user, idx) => (
//               <tr
//                 key={user.id}
//                 className={`${
//                   idx % 2 === 0 ? "bg-gray-50" : "bg-white"
//                 } border-t`}
//               >
//                 <td className="p-3">{user.FirstName}</td>
//                 <td className="p-3">{user.LastName}</td>
//                 <td className="p-3">{user.Email}</td>
//                 <td className="p-3">{user.Phone}</td>
//                 <td className="p-3">{user.Role}</td>
//                 <td className="p-3">{user.Branch}</td>
//                 <td className="p-3">{user.Profile}</td>
//                 <td className="p-3 flex gap-2 text-red-500">
//                   <BiSolidTrashAlt
//                     onClick={() => handleDeleteUser(user.id)}
//                     className="cursor-pointer"
//                   />
//                   <LiaEditSolid
//                     onClick={() => {
//                       setUserId(user.id);
//                       setIsModalOpen(true);
//                       reset(); // optional: preload data here
//                     }}
//                     className="cursor-pointer"
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         {/* {data?.meta && (
//         <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-600">
//           <div>
//             Showing{" "}
//             <strong>
//               {(page - 1) * limit + 1} -{" "}
//               {Math.min(page * limit, data.meta.total)}
//             </strong>{" "}
//             of <strong>{data.meta.total}</strong>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               disabled={page === 1}
//               onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//               className="bg-gray-200"
//             >
//               Previous
//             </Button>
//             <Button
//               disabled={page * limit >= data.meta.total}
//               onClick={() => setPage((prev) => prev + 1)}
//               className="bg-gray-200"
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       )} */}

//         {data?.meta && (
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 px-2 text-sm text-gray-600">
//             {/* Left side */}
//             <div>
//               Showing{" "}
//               <strong>
//                 {(page - 1) * limit + 1} -{" "}
//                 {Math.min(page * limit, data.meta.total)}
//               </strong>{" "}
//               of <strong>{data.meta.total}</strong>
//             </div>

//             {/* Right side */}
//             <div className="flex gap-2">
//               <Button
//                 disabled={page === 1}
//                 onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                 className={`px-4 py-2 rounded-lg text-white transition
//           ${
//             page === 1
//               ? "bg-brandDisable cursor-not-allowed"
//               : "bg-brandBlue hover:bg-brandHover"
//           }`}
//               >
//                 Prev
//               </Button>

//               <Button
//                 disabled={page * limit >= data.meta.total}
//                 onClick={() => setPage((prev) => prev + 1)}
//                 className={`px-4 py-2 rounded-lg text-white transition
//           ${
//             page * limit >= data.meta.total
//               ? "bg-brandDisable cursor-not-allowed"
//               : "bg-brandBlue hover:bg-brandHover"
//           }`}
//               >
//                 Next
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Edit Modal */}
//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//         <ModalHeader className="mb-4">Edit User Information</ModalHeader>
//         <ModalBody>
//           <form onSubmit={handleSubmit(onFormEdit)} className="space-y-4">
//             <div>
//               <Label>
//                 <span>Role</span>
//                 <select
//                   {...register("Role")}
//                   onKeyDown={handleEnter}
//                   className="input input-bordered w-full p-2 border border-gray-300"
//                 >
//                   <option value="">Select Role</option>
//                   <option value="student">Student</option>
//                   <option value="employee">Employee</option>
//                   <option value="admin">Admin</option>
//                   <option value="superAdmin">Super Admin</option>
//                 </select>
//               </Label>
//               {errors.Role && (
//                 <p className="text-red-500 text-sm">{errors.Role.message}</p>
//               )}
//             </div>
//             <div>
//               <Label>
//                 <span>Profile Status</span>
//                 <select
//                   {...register("Profile")}
//                   onKeyDown={handleEnter}
//                   className="input input-bordered w-full p-2 border border-gray-300"
//                 >
//                   <option value="">Select Status</option>
//                   <option value="active">Active</option>
//                   <option value="archive">Archive</option>
//                 </select>
//               </Label>
//               {errors.Profile && (
//                 <p className="text-red-500 text-sm">{errors.Profile.message}</p>
//               )}
//             </div>

//             <div>
//               <Label>
//                 <span>Regional Status</span>
//                 <select
//                   {...register("RegionalStatus")}
//                   onKeyDown={handleEnter}
//                   className="input input-bordered w-full p-2 border border-gray-300"
//                 >
//                   <option value="">Select Regional Status</option>
//                   <option value="Manager">Manager</option>
//                   <option value="Employee">Employee</option>
//                 </select>
//               </Label>
//               {errors.RegionalStatus && (
//                 <p className="text-red-500 text-sm">
//                   {errors.RegionalStatus.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <Label>
//                 <span>Branch</span>
//                 <select
//                   {...register("Branch")}
//                   onKeyDown={handleEnter}
//                   className="input input-bordered w-full p-2 border border-gray-300"
//                 >
//                   <option value="">Select Branch</option>
//                   <option value="Edu Anchor">Edu Anchor</option>
//                   <option value="Dhaka">Dhaka</option>
//                   <option value="Khulna">Khulna</option>
//                   <option value="Satkhira">Satkhira</option>
//                   <option value="Jashore">Jashore</option>
//                   <option value="Feni">Feni</option>
//                   <option value="Nord Edu">Nord Edu</option>
//                 </select>
//               </Label>
//               {errors.Branch && (
//                 <p className="text-red-500 text-sm">{errors.Branch.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
//                 New Password
//               </label>
//               <Input
//                 type="password"
//                 {...register("newPassword")}
//                 className="shadow-md p-3"
//               />
//               {errors.newPassword && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.newPassword.message}
//                 </p>
//               )}
//             </div>
//             <div className="flex justify-end">
//               <Button type="submit" className="bg-brandBlue text-white">
//                 Save
//               </Button>
//             </div>
//           </form>
//         </ModalBody>
//       </Modal>
//     </div>
//   );
// };

// export default UserManagementFilter;

import React, { useEffect, useState } from "react";
import { Input, Label, Button } from "@windmill/react-ui";
import {
  useDeleteUserMutation,
  useGetAllUserQuery,
  useUpdateUserMutation,
  useImpersonateUserMutation,
} from "../../features/auth/auth";
import toast from "react-hot-toast";
import { BiSolidTrashAlt } from "react-icons/bi";
import { LiaEditSolid } from "react-icons/lia";
import { FiLogIn, FiPower } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";

const UserManagementFilter = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  // Search input states
  const [searchValue, setSearchValue] = useState("");
  // const [firstNameInput, setFirstNameInput] = useState("");
  // const [lastNameInput, setLastNameInput] = useState("");
  // const [emailInput, setEmailInput] = useState("");

  const { data, isLoading, isError, error, refetch } = useGetAllUserQuery(
    {
      roleMode: "excludeStudent",
      searchTerm: searchValue,
      // LastName: lastNameInput,
      // Email: emailInput,
      page,
      limit,
    },
    // { refetchOnMountOrArgChange: true }
  );

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isError) {
      console.error("Error fetching user data", error);
    } else if (!isLoading && data) {
      setUsers(data.data);
      // setTotalPages(Math.ceil(data.meta.total / itemsPerPage));
    }
  }, [data, isLoading, isError, error]);

  console.log("users", users);
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [impersonateUser] = useImpersonateUserMutation();
  const history = useHistory();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [userId, setUserId] = useState("");

  const openEditModal = (user) => {
    setUserId(user.id);
    reset({
      Role: user.Role || "",
      Profile: user.Profile || "",
      RegionalStatus: user.RegionalStatus || "",
      Branch: user.Branch || "",
      newPassword: "",
    });
    document.getElementById("user_edit_modal")?.showModal();
  };

  const closeEditModal = () => {
    document.getElementById("user_edit_modal")?.close();
  };

  const onFormEdit = async (formData) => {
    try {
      const res = await updateUser({ id: userId, data: formData });
      if (res.data?.success) {
        toast.success(res.data.message);
        refetch();
        closeEditModal();
      } else {
        toast.error(res.error?.data?.message || "Update failed.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await deleteUser(id);
      if (res.data?.success) {
        toast.success(res.data.message);
        refetch();
      } else {
        toast.error(res.error?.data?.message || "Deletion failed.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleImpersonate = async (targetUser) => {
    try {
      const res = await impersonateUser(targetUser.id);
      if (res.data?.success) {
        const { accessToken, user: u } = res.data.data;
        localStorage.setItem("originalToken", localStorage.getItem("token") || "");
        localStorage.setItem("originalRole", localStorage.getItem("role") || "");
        localStorage.setItem("originalUserId", localStorage.getItem("userId") || "");
        localStorage.setItem("originalFirstName", localStorage.getItem("FirstName") || "");
        localStorage.setItem("originalLastName", localStorage.getItem("LastName") || "");
        localStorage.setItem("originalImage", localStorage.getItem("image") || "");
        localStorage.setItem("originalBranch", localStorage.getItem("branch") || "");
        localStorage.setItem("token", accessToken);
        localStorage.setItem("role", u.Role);
        localStorage.setItem("userId", u.id);
        localStorage.setItem("FirstName", u.FirstName || "");
        localStorage.setItem("LastName", u.LastName || "");
        localStorage.setItem("image", u.image || "");
        if (u.Branch) {
          localStorage.setItem("branch", u.Branch);
        } else {
          localStorage.removeItem("branch");
        }
        localStorage.setItem("isImpersonating", "true");
        toast.success(`Now logged in as ${u.FirstName} ${u.LastName}`);
        history.push("/app");
        window.location.reload();
      } else {
        toast.error(res.error?.data?.message || "Impersonation failed.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleToggleProfile = async (targetUser) => {
    const newProfile = targetUser.Profile === "active" ? "archive" : "active";
    const label = newProfile === "active" ? "activated" : "deactivated";
    try {
      const res = await updateUser({ id: targetUser.id, data: { Profile: newProfile } });
      if (res.data?.success) {
        toast.success(`User ${label} successfully.`);
        refetch();
      } else {
        toast.error(res.error?.data?.message || "Update failed.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleClearSearch = () => {
    // setFirstNameInput("");
    // setLastNameInput("");
    // setEmailInput("");
    setSearchValue("");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-3 sm:p-4">
      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
        <Label>
          <span className="text-sm text-gray-700">Search Users</span>
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="mt-1"
            placeholder="Search..."
          />
        </Label>
        {/* <Label>
          <span>Last Name</span>
          <Input
            value={lastNameInput}
            onChange={(e) => setLastNameInput(e.target.value)}
            className="mt-1"
            placeholder="Last Name"
          />
        </Label>
        <Label>
          <span>Email</span>
          <Input
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="mt-1"
            placeholder="Email"
          />
        </Label> */}
        <div className="flex items-end gap-2 md:col-span-2">
          <Button
            onClick={handleClearSearch}
            className="w-full bg-brandBlue text-white"
          >
            Clear
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-sm text-gray-500">
          Loading users...
        </div>
      ) : users?.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-500">
          No users found.
        </div>
      ) : (
        <>
          {/* Mobile card list */}
          <div className="space-y-3 md:hidden">
            {users?.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {user.FirstName} {user.LastName}
                    </h3>
                    <p className="break-all text-sm text-gray-600">
                      {user.Email || "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-shrink-0 gap-2 text-xl">
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(user.id)}
                      className="rounded-full bg-white p-2 shadow-sm text-red-500"
                      aria-label={`Delete ${user.FirstName || "user"}`}
                    >
                      <BiSolidTrashAlt />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(user)}
                      className="rounded-full bg-white p-2 text-brandBlue shadow-sm"
                      aria-label={`Edit ${user.FirstName || "user"}`}
                    >
                      <LiaEditSolid />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleImpersonate(user)}
                      className="rounded-full bg-white p-2 text-green-600 shadow-sm"
                      aria-label={`Login as ${user.FirstName || "user"}`}
                      title="Login as this user"
                    >
                      <FiLogIn />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleProfile(user)}
                      className={`rounded-full bg-white p-2 shadow-sm ${user.Profile === "active" ? "text-orange-500" : "text-gray-400"}`}
                      aria-label={`${user.Profile === "active" ? "Deactivate" : "Activate"} ${user.FirstName || "user"}`}
                      title={user.Profile === "active" ? "Deactivate user" : "Activate user"}
                    >
                      <FiPower />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Phone
                    </p>
                    <p className="break-words font-medium text-gray-800">
                      {user.Phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Role
                    </p>
                    <p className="break-words font-medium text-gray-800">
                      {user.Role || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Branch
                    </p>
                    <p className="break-words font-medium text-gray-800">
                      {user.Branch || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Profile
                    </p>
                    <p className="break-words font-medium text-gray-800">
                      {user.Profile || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden w-full overflow-x-auto md:block">
            <table className="w-full text-sm text-left text-gray-700 bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">First Name</th>
                  <th className="p-3">Last Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3">Profile</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } border-t`}
                  >
                    <td className="p-3">{user.FirstName || "N/A"}</td>
                    <td className="p-3">{user.LastName || "N/A"}</td>
                    <td className="p-3 break-all">{user.Email || "N/A"}</td>
                    <td className="p-3 whitespace-nowrap">{user.Phone || "N/A"}</td>
                    <td className="p-3">{user.Role || "N/A"}</td>
                    <td className="p-3">{user.Branch || "N/A"}</td>
                    <td className="p-3">{user.Profile || "N/A"}</td>
                    <td className="p-3">
                      <div className="flex gap-2 text-lg items-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user.id)}
                          className="cursor-pointer text-red-500"
                          aria-label={`Delete ${user.FirstName || "user"}`}
                          title="Delete user"
                        >
                          <BiSolidTrashAlt />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
                          className="cursor-pointer text-brandBlue"
                          aria-label={`Edit ${user.FirstName || "user"}`}
                          title="Edit user"
                        >
                          <LiaEditSolid />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleImpersonate(user)}
                          className="cursor-pointer text-green-600"
                          aria-label={`Login as ${user.FirstName || "user"}`}
                          title="Login as this user"
                        >
                          <FiLogIn />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleProfile(user)}
                          className={`cursor-pointer ${user.Profile === "active" ? "text-orange-500" : "text-gray-400"}`}
                          aria-label={`${user.Profile === "active" ? "Deactivate" : "Activate"} ${user.FirstName || "user"}`}
                          title={user.Profile === "active" ? "Deactivate user" : "Activate user"}
                        >
                          <FiPower />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        {/* Pagination */}
        {/* {data?.meta && (
        <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-600">
          <div>
            Showing{" "}
            <strong>
              {(page - 1) * limit + 1} -{" "}
              {Math.min(page * limit, data.meta.total)}
            </strong>{" "}
            of <strong>{data.meta.total}</strong>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="bg-gray-200"
            >
              Previous
            </Button>
            <Button
              disabled={page * limit >= data.meta.total}
              onClick={() => setPage((prev) => prev + 1)}
              className="bg-gray-200"
            >
              Next
            </Button>
          </div>
        </div>
      )} */}

          {data?.meta && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 px-1 sm:px-2 text-xs sm:text-sm text-gray-600">
            {/* Left side */}
              <div className="text-center sm:text-left">
              Showing{" "}
              <strong>
                {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, data.meta.total)}
              </strong>{" "}
              of <strong>{data.meta.total}</strong>
            </div>

            {/* Right side */}
              <div className="flex w-full gap-2 sm:w-auto">
              <Button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition text-xs sm:text-sm
          ${
            page === 1
              ? "bg-brandDisable cursor-not-allowed"
              : "bg-brandBlue hover:bg-brandHover"
          }`}
              >
                Prev
              </Button>

              <Button
                disabled={page * limit >= data.meta.total}
                onClick={() => setPage((prev) => prev + 1)}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition text-xs sm:text-sm
          ${
            page * limit >= data.meta.total
              ? "bg-brandDisable cursor-not-allowed"
              : "bg-brandBlue hover:bg-brandHover"
          }`}
              >
                Next
              </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      <dialog id="user_edit_modal" className="modal">
        <div className="modal-box w-11/12 max-w-xl p-4 sm:p-6 text-left">
          <h3 className="font-bold text-lg sm:text-xl text-gray-900">
            Edit User
          </h3>
          <form
            onSubmit={handleSubmit(onFormEdit)}
            className="mt-4 space-y-3 sm:space-y-4"
          >
            <div>
              <Label>
                <span>Role</span>
                <select
                  {...register("Role")}
                  onKeyDown={handleEnter}
                  className="input input-bordered w-full p-2 border border-gray-300"
                >
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                  <option value="superAdmin">Super Admin</option>
                </select>
              </Label>
              {errors.Role && (
                <p className="text-red-500 text-sm">{errors.Role.message}</p>
              )}
            </div>
            <div>
              <Label>
                <span>Profile Status</span>
                <select
                  {...register("Profile")}
                  onKeyDown={handleEnter}
                  className="input input-bordered w-full p-2 border border-gray-300"
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="archive">Archive</option>
                </select>
              </Label>
              {errors.Profile && (
                <p className="text-red-500 text-sm">
                  {errors.Profile.message}
                </p>
              )}
            </div>

            <div>
              <Label>
                <span>Regional Status</span>
                <select
                  {...register("RegionalStatus")}
                  onKeyDown={handleEnter}
                  className="input input-bordered w-full p-2 border border-gray-300"
                >
                  <option value="">Select Regional Status</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                </select>
              </Label>
              {errors.RegionalStatus && (
                <p className="text-red-500 text-sm">
                  {errors.RegionalStatus.message}
                </p>
              )}
            </div>

            <div>
              <Label>
                <span>Branch</span>
                <select
                  {...register("Branch")}
                  onKeyDown={handleEnter}
                  className="input input-bordered w-full p-2 border border-gray-300"
                >
                  <option value="">Select Branch</option>
                  <option value="Edu Anchor">Edu Anchor</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Satkhira">Satkhira</option>
                  <option value="Jashore">Jashore</option>
                  <option value="Feni">Feni</option>
                  <option value="Nord Edu">Nord Edu</option>
                </select>
              </Label>
              {errors.Branch && (
                <p className="text-red-500 text-sm">{errors.Branch.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <Input
                type="password"
                {...register("newPassword")}
                className="shadow-md p-3"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
              <button
                type="button"
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={closeEditModal}
              >
                Close
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-brandBlue text-white rounded hover:bg-brandBlue"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default UserManagementFilter;
