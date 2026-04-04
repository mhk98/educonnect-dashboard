import React, { useState } from "react";
import PendingPayment from "./PendingPayment";
import PreviousPayment from "./PreviousPayment";
import RequestPayment from "./RequestPayment";
import Contract from "./Contract";

const  Finance = ({id}) => {

const role = localStorage.getItem("role")

  const [activeTab, setActiveTab] = useState("contract");
  
    const isContract = activeTab === "contract";
    const isRequestPayment = activeTab === "requestPayment";
    const isPendingPayment = activeTab === "pendingPayment";
    const isPreviousPayment = activeTab === "previousPayment";



  return (
    <div className="p-4 md:p-8 w-full mx-auto">
        {/* Navigation Steps */}
       
        
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <div onClick={() => setActiveTab("contract")} className={`flex flex-col items-center cursor-pointer ${isContract ? "bg-brandRed text-white rounded-md py-1" : "bg-gray-200 text-gray-700 rounded-md py-1"}`}>
             <h1  className="mt-1 text-xl">Contract</h1>         
              </div>
            <div onClick={() => setActiveTab("requestPayment")} className={`flex flex-col items-center cursor-pointer ${isRequestPayment ? "bg-brandRed text-white rounded-md py-1" : "bg-gray-200 text-gray-700 rounded-md py-1"}`}>
              <h1  className="mt-1 text-xl">Request Payment</h1>
            </div>
            <div  onClick={() => setActiveTab("pendingPayment")}
            className={`flex flex-col items-center cursor-pointer ${isPendingPayment ? "bg-brandRed text-white rounded-md py-1" : "bg-gray-200 text-gray-700 rounded-md py-1"}`}>
              {/* className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
        isFinance ? "bg-brandRed text-white" : "bg-gray-200"
      }`} */}
              <h1 className="mt-1 text-xl">Pending Payment</h1>
  
            </div>
  
            {/* <div 
                onClick={() => setActiveTab("work")}  className="flex flex-col items-center cursor-pointer">
              <span className="mt-1 text-sm text-gray-700">Work Experience</span>
            </div> */}
            <div 
                onClick={() => setActiveTab("previousPayment")}  className={`flex flex-col items-center cursor-pointer ${isPreviousPayment ? "bg-brandRed text-white rounded-md py-1" : "bg-gray-200 text-gray-700 rounded-md py-1"}`}>
              <h1 className="mt-1 text-xl">Previous Payment</h1>
  
            </div>
          </div>
        

       

         {/* Separated Content Section Below */}
             
                
                  <div className="mt-4 p-4 bg-white rounded-md">
              {
              isContract ? (
                <Contract id={id}/>
                
              ): isRequestPayment ?  (
                <div>

                <RequestPayment id = {id}/>

                </div>
              ): isPendingPayment ? (
                <div>

                <PendingPayment id = {id}/>

                </div>
              ): (

                  <PreviousPayment id={id}/>
  
                )
              
            
            }
            </div>
                
              
    </div>
  );
}

export default Finance;