import React, { useEffect, useState } from "react"
import { useDeleteRequestPaymentMutation, useGetDataByIdQuery, useUpdateRequestPaymentMutation } from "../../features/requestPayment/requestPayment";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { LiaEditSolid } from "react-icons/lia";
import { FaTrash } from "react-icons/fa";
import { Modal, ModalHeader, ModalBody, Button } from '@windmill/react-ui'
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";



const StudentPayment = () => {
  
   

    const { data, isLoading, isError, error } = useGetDataByIdQuery();
      const [students, setStudents] = useState([]);
    
      useEffect(() => {
        if (isError) {
          console.log("Error fetching", error);
        } else if (!isLoading && data) {
          setStudents(data.data);
        }
      }, [data, isLoading, isError, error]);

      console.log("StudentPayment", students)

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      };



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
   
       const [updateRequestPayment] = useUpdateRequestPaymentMutation()
   
       const onFormEdit = async (data) => {
      
   
         console.log("info", data)
       try {
         const res = await updateRequestPayment({ data});
         if (res.data?.success) {
           toast.success(res.data.message);
         } else {
           toast.error(res.error?.data?.message || "Failed. Please try again.");
         }
       } catch (error) {
         toast.error("An unexpected error occurred.");
       }
     };
   
       const [deleteRequestPayment] = useDeleteRequestPaymentMutation()
   
       const handleDeleteUser = async (id) => {
       try {
         const res = await deleteRequestPayment(id);
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
            <div className="w-full px-4 py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Title and Subtitle */}
        <div>
          <h4 className="text-2xl md:text-md font-semibold text-gray-900">Student Payment</h4>
          <p className="text-sm md:text-sm text-gray-500 mt-1">Student payment history</p>
        </div>

        {/* Right: Buttons */}
        {/* <div className="">
          <button className="flex items-center sm:flex-row gap-3 px-4 py-2 bg-white text-brandRed border-2 border-brandRed rounded-md text-sm md:text-base transition">
            <span>Export Application Data </span>
            <TbDownload />
          </button>
          
        </div> */}
      </div>
    </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="p-3 min-w-[180px]">Request Date</th>
              <th className="p-3 min-w-[180px]">Payment Reason</th>
              <th className="p-3 min-w-[120px]">Amount</th>
              <th className="p-3 min-w-[160px]">Refund Condition</th>
              <th className="p-3 min-w-[160px]">Status</th>
              <th className="p-3 min-w-[160px]">Action</th>
              
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr
                key={idx}
                className={`border-b border-gray-200 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="p-3 whitespace-nowrap">{formatDate(student.createdAt)}</td>
                <td className="p-3 whitespace-nowrap">{student.paymentReason}</td>
                <td className="p-3 whitespace-nowrap">{student.amount}</td>
                <td className="p-3 whitespace-nowrap">{student.refundCondition}</td>
                <td className="p-3 whitespace-nowrap">{student?.status}</td>
                <td className="p-3 whitespace-nowrap flex gap-3 text-brandRed">
                                  <Link to={`/app/editprofile/${student.id}`}>
                                    <LiaEditSolid className="cursor-pointer" />
                                  </Link>
                                  <FaTrash className="cursor-pointer text-red-500" />
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
                                                            <Button type="submit" className="btn btn-brandRed">
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
    )
}


export default StudentPayment;