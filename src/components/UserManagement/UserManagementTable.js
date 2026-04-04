import React, { useEffect, useState } from "react";
import { LiaEditSolid } from "react-icons/lia";
import { Link } from "react-router-dom/cjs/react-router-dom";
import {  BiSolidTrashAlt } from "react-icons/bi";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Modal, ModalHeader, ModalBody, Button } from '@windmill/react-ui'
import { useDeleteUserMutation, useGetAllUserQuery, useUpdateUserMutation } from "../../features/auth/auth";


export default function UserManagementTable() {

  const [userId, setUserId] = useState("")

const {data, isLoading, isError, error, refetch} = useGetAllUserQuery()
const [users, setUsers] = useState([]);


useEffect(() => {
if(isError) {
  console.log("Error fetching", error)
} else if(!isLoading && data) {
    setUsers(data.data)
    refetch()
}
}, [data, isLoading, isError, error]) 


const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

console.log("users", users)


 const [isModalOpen, setIsModalOpen] = useState(false)
  
   function closeModal() {
    setIsModalOpen(false)
  }



    const {
      register,
      formState: { errors },
      handleSubmit,
      reset,
    } = useForm()

    const [updateUser] = useUpdateUserMutation()

    const onFormEdit = async (data) => {
   

      console.log("info", data)
    try {
      const res = await updateUser({id:userId, data});
      if (res.data?.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.error?.data?.message || "Failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

    const [deleteUser] = useDeleteUserMutation()

    const handleDeleteUser = async (id) => {
    try {
      const res = await deleteUser(id);
      if (res.data?.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.error?.data?.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };


  return (
    <div className="w-full px-4 py-6">
        <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-700 bg-white shadow-md rounded-lg">
        <thead className="text-sm text-gray-700">
          <tr className="text-left">
            <th className="p-3">First Name</th>
            <th className="p-3">Last Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Role</th>
            <th className="p-3">Profile Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr
              key={idx}
              className={`text-sm border-t border-gray-200 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
            >
              <td className="p-3 whitespace-nowrap">{user.FirstName}</td>
              <td className="p-3 whitespace-nowrap">{user.LastName}</td>
              <td className="p-3 whitespace-nowrap">{user.Email}</td>
              <td className="p-3 whitespace-nowrap">{user.Phone}</td>
              <td className="p-3 whitespace-nowrap">{user.Role}</td>
              <td className="p-3 whitespace-nowrap">{user.Profile}</td>
              <td className="p-3 whitespace-nowrap flex gap-3 text-brandRed">
                {/* <FaLink className="cursor-pointer" /> */}
                <Link>
                <BiSolidTrashAlt onClick={ () => handleDeleteUser(user.id)} fontSize={20} className="cursor-pointer text-red-500" />
                </Link>
                <LiaEditSolid fontSize={20} onClick={() => {
            setIsModalOpen(true);
            setUserId(user.id);
          }}  className="cursor-pointer" />
              </td>

              <Modal isOpen={isModalOpen} onClose={closeModal}>
                                      <ModalHeader className="mb-8">Edit User Information</ModalHeader>
                                      <ModalBody>
                                      <form onSubmit={handleSubmit(onFormEdit)}>
                          <div className="grid grid-cols-1 gap-4">
                            {/* Left Side */}
                      
                              <div className="mb-4">
                                <label className="block text-sm mb-1 text-gray-700 mb-4">User Role</label>
                                <select
                                    {...register("Role")}
                                    className="input input-bordered w-full shadow-md p-3"
                                  >
                                    <option value="">Select Role</option>
                                    <option value="student">Student</option>
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                    <option value="superAdmin">Super Admin</option>
                                  </select>
                                  {errors.Role && (
                                    <p className="text-red-500 text-sm mt-1">{errors.Role.message}</p>
                                  )}
                              </div>

                              <div className="mb-4">
                                <label className="block text-sm mb-1 text-gray-700 mb-4">Profile Status</label>
                                <select
                                    {...register("Profile")}
                                    className="input input-bordered w-full shadow-md p-3"
                                  >
                                    <option value="">Select Profile Status</option>
                                    <option value="active">Active</option>
                                    <option value="archive">Archive</option>        
                                  </select>
                                  {errors.Profile && (
                                    <p className="text-red-500 text-sm mt-1">{errors.Profile.message}</p>
                                  )}
                              </div>
                             
                          </div>
                        
                          <div className="flex justify-end gap-2 mt-6">
                            <Button type="submit" className="btn" style={{backgroundColor:"#C71320"}}>
                              Save
                            </Button>
                          </div>
                        </form>
                        
                                      </ModalBody>
                                    </Modal>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

