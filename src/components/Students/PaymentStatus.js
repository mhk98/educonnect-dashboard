import React from "react"
import { useLocation } from "react-router-dom/cjs/react-router-dom";


const PaymentStatus = () => {
    const location = useLocation()

    const query = new URLSearchParams(location.search)
    const status = query.get('status')  // 'success' or 'fail'

    console.log("Status", status)

    return (
        <div>
            {
                status === "success" ?(
                    <div class="flex flex-col items-center justify-center min-h-screen bg-white px-4">
  <div class="flex items-center justify-center w-20 h-20 rounded-full bg-green-500 mb-4">
    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>
  <h2 class="text-xl font-semibold text-gray-800 mb-4">Successfully Paid</h2>
  <a href="/payment-list" class="px-4 py-2 bg-brandRed text-white text-sm font-medium rounded hover:bg-brandRed-700 transition">
    Back to payment list
  </a>
</div>

                ) : status==="error" ? (
                    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-500 mb-4">
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 className="text-xl font-medium text-gray-800 mb-4">
        Something Went Wrong...
      </h2>
      <button
        className="px-4 py-2 bg-brandRed text-white text-sm font-medium rounded hover:bg-brandRed-700 transition"
      >
        Back to payment list
      </button>
    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
                    {/* Warning icon */}
                    <div className="bg-yellow-400 text-white rounded-full p-4 mb-4">
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.73-3l-6.93-12a2 2 0 00-3.46 0l-6.93 12a2 2 0 001.73 3z"
                        />
                      </svg>
                    </div>
              
                    {/* Message */}
                    <h1 className="text-lg font-semibold text-gray-800">Something Went Wrong...</h1>
              
                    {/* Back Button */}
                    <a
                      href="/app/payments"
                      className="mt-4 px-4 py-2 bg-brandRed text-white rounded hover:bg-brandRed-700 transition"
                    >
                      Back to payment list
                    </a>
                  </div>
                )
            }
        </div>
    )
}


export default PaymentStatus;