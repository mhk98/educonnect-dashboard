import React, { useEffect, useState } from 'react'
import { Modal, ModalHeader, ModalBody, Input, Button } from '@windmill/react-ui';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useGetDataByIdQuery, useUpdateContractMutation } from '../../features/contract/contract';

function Contract({id}) {

  const role = localStorage.getItem("role")
  const userId = localStorage.getItem("userId")
  const [isModalOpen, setIsModalOpen] = useState(false)
       
  function closeModal() {
   setIsModalOpen(false)
 }


  const {
     register,
     handleSubmit,
     reset,
     formState: { errors },
   } = useForm();


    const [updateContract] = useUpdateContractMutation(id);
   
     const onFormEdit = async (data) => {

      const info = {
        registrationFees: data.registrationFees,
        visaDocumentsFees: data.visaDocumentsFees,
        serviceCharge: data.serviceCharge,
        spouseServicecharge: data.spouseServicecharge,
        applicationCode: data.applicationCode,
        note: data.note,
        userId:userId,
        user_id:id
      }
    
       try {
         const res = await updateContract({id, data:info});
         if (res.data?.success) {
           toast.success(res.data.message);
           reset();
           closeModal();
         } else {
           toast.error(res.error?.data?.message || 'Failed. Please try again.');
         }
       } catch (error) {
         toast.error('An unexpected error occurred.');
       }
     };
 

      const { data, isLoading, isError, error } = useGetDataByIdQuery(id);
               const [contract, setContract] = useState([]);
             
               useEffect(() => {
                 if (isError) {
                   console.log("Error fetching", error);
                 } else if (!isLoading && data) {
                   setContract(data.data);
                 }
               }, [data, isLoading, isError, error]);

               console.log("contracts", contract)


     const handleEnter = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const form = e.target.form;
        const index = Array.prototype.indexOf.call(form, e.target);
        form.elements[index + 1]?.focus();
      }
    };
 
  return (
    <>
      {/* <PageTitle>Dashboard</PageTitle> */}
      <div className="w-full px-4 py-6 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
               {/* Header Section */}
               <div>
                 <h4 className="text-2xl md:text-md font-semibold text-gray-900">Contract History</h4>
     
         
                 {/* Modal */}
                 <Modal isOpen={isModalOpen} onClose={closeModal}>
                                         <ModalHeader>Contract History</ModalHeader>
                                         <ModalBody>
             <form onSubmit={handleSubmit(onFormEdit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Side */}
              
                      <div className="mb-4">
                        <label className="block text-sm mb-1 text-gray-700">Registration Fees</label>
                        <Input
                          type="text"
                          {...register("registrationFees")}
                          onKeyDown={handleEnter}
                          className="input input-bordered w-full form-control shadow-md p-3"
                        />
                        {errors.registrationFees && (
                          <p className="text-red-500 text-sm mt-1">{errors.registrationFees.message}</p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm mb-1 text-gray-700">Visa Documents Fees</label>
                        <Input
                          type="text"
                          {...register("visaDocumentsFees")}
                          onKeyDown={handleEnter}
                          className="input input-bordered w-full form-control shadow-md p-3"
                        />
                        {errors.visaDocumentsFees && (
                          <p className="text-red-500 text-sm mt-1">{errors.visaDocumentsFees.message}</p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm mb-1 text-gray-700">Service Charge</label>
                        <Input
                          type="text"
                          {...register("serviceCharge")}
                          onKeyDown={handleEnter}
                          className="input input-bordered w-full form-control shadow-md p-3"
                        />
                        {errors.serviceCharge && (
                          <p className="text-red-500 text-sm mt-1">{errors.serviceCharge.message}</p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm mb-1 text-gray-700">Spouse Service Charge</label>
                        <Input
                          type="text"
                          {...register("spouseServicecharge")}
                          onKeyDown={handleEnter}
                          className="input input-bordered w-full form-control shadow-md p-3"
                        />
                        {errors.spouseServicecharge && (
                          <p className="text-red-500 text-sm mt-1">{errors.spouseServicecharge.message}</p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm mb-1 text-gray-700">Application Code</label>
                        <Input
                          type="text"
                          {...register("applicationCode")}
                          onKeyDown={handleEnter}
                          className="input input-bordered w-full form-control shadow-md p-3"
                        />
                        {errors.applicationCode && (
                          <p className="text-red-500 text-sm mt-1">{errors.applicationCode.message}</p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm mb-1 text-gray-700">Note</label>
                        <Input
                          type="text"
                          {...register("note")}
                          onKeyDown={handleEnter}
                          className="input input-bordered w-full form-control shadow-md p-3"
                        />
                        {errors.note && (
                          <p className="text-red-500 text-sm mt-1">{errors.note.message}</p>
                        )}
                      </div>
               
                  </div>
                
                  <div className="flex justify-end gap-2 mt-6">
                    <Button type="submit" className="btn bg-brandRed">
                      Save
                    </Button>
                  </div>
                </form>                                  
                                         </ModalBody>
                                       </Modal>
               </div>
     
               {/* Right Buttons */}
                {
                  role === "superAdmin" && 
                  <div className="flex flex-col sm:flex-row gap-3">
                 <button onClick={() => {
                 setIsModalOpen(true)
               }}  className="px-4 py-2 bg-brandRed text-white rounded-md text-sm md:text-base hover:bg-brandRed-700 transition">
                   + Edit Contract
                 </button>
               </div>
                }
               
             </div>
            <div>
            {contract ? (
  <div className="p-4 bg-white rounded shadow-md">
    <p><strong>Application Code:</strong> {contract.applicationCode}</p>
    <p><strong>Note:</strong> {contract.note}</p>
    <p><strong>Registration Fees:</strong> {contract.registrationFees}</p>
    <p><strong>Service Charge:</strong> {contract.serviceCharge}</p>
    <p><strong>Spouse Service Charge:</strong> {contract.spouseServicecharge}</p>
    <p><strong>Visa Document Fees:</strong> {contract.visaDocumentsFees}</p>

  </div>
) : (
  <p>No application data found.</p>
)}

            </div>
    </div>
    </>
  )
}

export default Contract
