// import React, { useEffect, useState } from "react";

// import { TbCurrencyTaka } from "react-icons/tb";
// import Amount from "../components/Wallet/Amount";
// import CashIn from "../components/Wallet/CashIn";
// import CashOut from "../components/Wallet/CashOut";
// import { useGetAllPendingPaymentWithoutQueryQuery } from "../features/pendingPayment/pendingPayment";
// import SuperAdminStatement from "../components/Wallet/SuperAdminStatement";

// function Wallet() {
//   const id = localStorage.getItem("userId");
//   const role = localStorage.getItem("role");
//   const branch = localStorage.getItem("branch");
//   const [activeTab, setActiveTab] = useState("amount");

//   const iseduAnchor = activeTab === "eduAnchor";
//   const isamount = activeTab === "amount";
//   const iscashIn = activeTab === "cashIn";
//   const iscashOut = activeTab === "cashOut";

//   const { data, isLoading, isError, error } =
//     useGetAllPendingPaymentWithoutQueryQuery();
//   // const [creditPayments, setCreditPayments] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);

//   useEffect(() => {
//     if (isError) {
//       console.log("Error fetching", error);
//     } else if (!isLoading && data) {
//       const allCreditPayments = data.data;

//       // ✅ Filter payments with any of the 3 paymentStatus values
//       const filtered = allCreditPayments.filter(
//         (payment) =>
//           ["Cash-In", "Offline", "Online"].includes(payment.paymentStatus) &&
//           payment.status === "PAID"
//       );

//       // setCreditPayments(filtered);

//       // ✅ Sum amounts
//       const total = filtered.reduce((sum, payment) => {
//         return sum + Number(payment.amount || 0);
//       }, 0);

//       setTotalAmount(total);
//     }
//   }, [data, isLoading, isError, error]);

//   const {
//     data: data1,
//     isLoading: isLoading1,
//     isError: isError1,
//     error: error1,
//   } = useGetAllPendingPaymentWithoutQueryQuery();
//   // const [creditPayments, setCreditPayments] = useState([]);
//   const [totalDebitAmount, setTotalDebitAmount] = useState(0);

//   useEffect(() => {
//     if (isError1) {
//       console.log("Error fetching", error1);
//     } else if (!isLoading1 && data1) {
//       const allCreditPayments = data1.data;

//       // ✅ Filter payments with any of the 3 paymentStatus values
//       const filtered = allCreditPayments.filter(
//         (payment) =>
//           ["Cash-Out"].includes(payment.paymentStatus) &&
//           payment.status === "PAID"
//       );

//       // setCreditPayments(filtered);

//       // ✅ Sum amounts
//       const total = filtered.reduce((sum, payment) => {
//         return sum + Number(payment.amount || 0);
//       }, 0);

//       setTotalDebitAmount(total);
//     }
//   }, [data1, isLoading1, isError1, error1]);

//   const balance = totalAmount - totalDebitAmount;

//   console.log("balance", balance);

//   const {
//     data: data2,
//     isLoading: isLoading2,
//     isError: isError2,
//     error: error2,
//   } = useGetAllPendingPaymentWithoutQueryQuery();
//   // const [creditPayments, setCreditPayments] = useState([]);
//   const [totalBranchAmount, setTotalBranchAmount] = useState(0);

//   useEffect(() => {
//     if (isError2) {
//       console.log("Error fetching", error2);
//     } else if (!isLoading2 && data2) {
//       const allCreditPayments = data2.data;

//       // ✅ Filter payments with any of the 3 paymentStatus values
//       const filtered = allCreditPayments.filter(
//         (payment) =>
//           ["Cash-In", "Offline", "Online"].includes(payment.paymentStatus) &&
//           payment.status === "PAID" &&
//           payment.branch === branch
//       );

//       // setCreditPayments(filtered);

//       // ✅ Sum amounts
//       const total = filtered.reduce((sum, payment) => {
//         return sum + Number(payment.amount || 0);
//       }, 0);

//       setTotalBranchAmount(total);
//     }
//   }, [data2, isLoading2, isError2, error2, branch]);

//   const {
//     data: data3,
//     isLoading: isLoading3,
//     isError: isError3,
//     error: error3,
//   } = useGetAllPendingPaymentWithoutQueryQuery();
//   // const [creditPayments, setCreditPayments] = useState([]);
//   const [totalBranchDebitAmount, setTotalBranchDebitAmount] = useState(0);

//   useEffect(() => {
//     if (isError3) {
//       console.log("Error fetching", error3);
//     } else if (!isLoading3 && data3) {
//       const allCreditPayments = data3.data;

//       // ✅ Filter payments with any of the 3 paymentStatus values
//       const filtered = allCreditPayments.filter(
//         (payment) =>
//           ["Cash-Out"].includes(payment.paymentStatus) &&
//           payment.status === "PAID" &&
//           payment.branch === branch
//       );

//       // setCreditPayments(filtered);

//       // ✅ Sum amounts
//       const total = filtered.reduce((sum, payment) => {
//         return sum + Number(payment.amount || 0);
//       }, 0);

//       setTotalBranchDebitAmount(total);
//     }
//   }, [data3, isLoading3, isError3, error3, branch]);

//   const branchBalance = totalBranchAmount - totalBranchDebitAmount;

//   console.log("balance", balance);

//   console.log("totalAmount", totalAmount);
//   console.log("totalBranchAmount", totalBranchAmount);
//   console.log("totalBranchDebitAmount", totalBranchDebitAmount);

//   return (
//     <>
//       {/* <PageTitle>Dashboard</PageTitle> */}
//       <div className="w-full px-4 py-6 bg-gray-50">
//         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           {/* Left: Title and Subtitle */}
//           <div>
//             <h4 className="text-2xl md:text-md font-semibold text-gray-900">
//               My Wallet
//             </h4>
//             {/* <p className="text-sm md:text-sm text-gray-500 mt-1">Manage your Students and their Profiles</p> */}
//           </div>

//           {/* Right: Buttons */}
//           {role === "superAdmin" ? (
//             <div className="flex items-center sm:flex-row gap-3">
//               <p>Balance:</p>
//               <button className="px-4 py-2 flex items-center bg-white text-brandRed border-2 border-brandRed rounded-md text-sm md:text-base transition">
//                 <TbCurrencyTaka /> {balance}
//               </button>

//               {/* Register New Student */}
//               {/* <button className="px-4 py-2 bg-brandRed text-white rounded-md text-sm md:text-base hover:bg-brandRed-700 transition">
//             ADD MONEY
//           </button> */}
//             </div>
//           ) : (
//             <div className="flex items-center sm:flex-row gap-3">
//               <p>Balance:</p>
//               <button className="px-4 py-2 flex items-center bg-white text-brandRed border-2 border-brandRed rounded-md text-sm md:text-base transition">
//                 <TbCurrencyTaka /> {branchBalance}
//               </button>

//               {/* Register New Student */}
//               {/* <button className="px-4 py-2 bg-brandRed text-white rounded-md text-sm md:text-base hover:bg-brandRed-700 transition">
//             ADD MONEY
//           </button> */}
//             </div>
//           )}
//         </div>
//       </div>
//       {/* <CTA /> */}

//       {/* <WalletTable/> */}
//       <div className="p-4 md:p-8 w-full mx-auto">
//         {/* Navigation Steps */}

//         {role === "superAdmin" ? (
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center">
//             <div
//               onClick={() => setActiveTab("eduAnchor")}
//               className={`flex flex-col items-center cursor-pointer ${
//                 iseduAnchor
//                   ? "bg-brandRed text-white rounded-md py-1"
//                   : "bg-gray-200 text-gray-700 rounded-md py-1"
//               }`}
//             >
//               <h1 className="mt-1 text-xl">EduAnchor</h1>
//             </div>

//             <div
//               onClick={() => setActiveTab("amount")}
//               className={`flex flex-col items-center cursor-pointer ${
//                 isamount
//                   ? "bg-brandRed text-white rounded-md py-1"
//                   : "bg-gray-200 text-gray-700 rounded-md py-1"
//               }`}
//             >
//               <h1 className="mt-1 text-xl">Amount</h1>
//             </div>
//             <div
//               onClick={() => setActiveTab("cashIn")}
//               className={`flex flex-col items-center cursor-pointer ${
//                 iscashIn
//                   ? "bg-brandRed text-white rounded-md py-1"
//                   : "bg-gray-200 text-gray-700 rounded-md py-1"
//               }`}
//             >
//               {/* className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
//       isFinance ? "bg-brandRed text-white" : "bg-gray-200"
//     }`} */}
//               <h1 className="mt-1 text-xl">Cash In</h1>
//             </div>

//             {/* <div
//               onClick={() => setActiveTab("work")}  className="flex flex-col items-center cursor-pointer">
//             <span className="mt-1 text-sm text-gray-700">Work Experience</span>
//           </div> */}
//             <div
//               onClick={() => setActiveTab("cashOut")}
//               className={`flex flex-col items-center cursor-pointer ${
//                 iscashOut
//                   ? "bg-brandRed text-white rounded-md py-1"
//                   : "bg-gray-200 text-gray-700 rounded-md py-1"
//               }`}
//             >
//               <h1 className="mt-1 text-xl">Cash Out</h1>
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 items-center">
//             <div
//               onClick={() => setActiveTab("amount")}
//               className={`flex flex-col items-center cursor-pointer ${
//                 isamount
//                   ? "bg-brandRed text-white rounded-md py-1"
//                   : "bg-gray-200 text-gray-700 rounded-md py-1"
//               }`}
//             >
//               <h1 className="mt-1 text-xl">Amount</h1>
//             </div>
//             <div
//               onClick={() => setActiveTab("cashIn")}
//               className={`flex flex-col items-center cursor-pointer ${
//                 iscashIn
//                   ? "bg-brandRed text-white rounded-md py-1"
//                   : "bg-gray-200 text-gray-700 rounded-md py-1"
//               }`}
//             >
//               {/* className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
//       isFinance ? "bg-brandRed text-white" : "bg-gray-200"
//     }`} */}
//               <h1 className="mt-1 text-xl">Cash In</h1>
//             </div>

//             {/* <div
//               onClick={() => setActiveTab("work")}  className="flex flex-col items-center cursor-pointer">
//             <span className="mt-1 text-sm text-gray-700">Work Experience</span>
//           </div> */}
//             <div
//               onClick={() => setActiveTab("cashOut")}
//               className={`flex flex-col items-center cursor-pointer ${
//                 iscashOut
//                   ? "bg-brandRed text-white rounded-md py-1"
//                   : "bg-gray-200 text-gray-700 rounded-md py-1"
//               }`}
//             >
//               <h1 className="mt-1 text-xl">Cash Out</h1>
//             </div>
//           </div>
//         )}

//         {/* Separated Content Section Below */}
//         {role === "superAdmin" ? (
//           <div className="mt-4 p-4 bg-white rounded-md">
//             {iseduAnchor ? (
//               <div>
//                 <SuperAdminStatement id={id} />
//               </div>
//             ) : isamount ? (
//               <div>
//                 <Amount id={id} />
//               </div>
//             ) : iscashIn ? (
//               <div>
//                 <CashIn id={id} />
//               </div>
//             ) : (
//               <CashOut id={id} />
//             )}
//           </div>
//         ) : (
//           <div className="mt-4 p-4 bg-white rounded-md">
//             {isamount ? (
//               <div>
//                 <Amount id={id} />
//               </div>
//             ) : iscashIn ? (
//               <div>
//                 <CashIn id={id} />
//               </div>
//             ) : (
//               <CashOut id={id} />
//             )}
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default Wallet;

import React, { useMemo, useState } from "react";
import { TbCurrencyTaka, TbTrendingDown, TbTrendingUp } from "react-icons/tb";

import Amount from "../components/Wallet/Amount";
import CashIn from "../components/Wallet/CashIn";
import CashOut from "../components/Wallet/CashOut";
import SuperAdminStatement from "../components/Wallet/SuperAdminStatement";
import { useGetAllPendingPaymentWithoutQueryQuery } from "../features/pendingPayment/pendingPayment";

function Wallet() {
  const id = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const branch = localStorage.getItem("branch");

  const [activeTab, setActiveTab] = useState("amount");

  const { data, isLoading, isError, error } =
    useGetAllPendingPaymentWithoutQueryQuery();

  const payments = useMemo(() => data?.data ?? [], [data]);

  const sumAmount = (arr) =>
    arr.reduce((sum, p) => sum + Number(p?.amount ?? 0), 0);

  const creditPaid = useMemo(() => {
    return payments.filter(
      (p) =>
        ["Cash-In", "Offline", "Online"].includes(p?.paymentStatus) &&
        p?.status === "PAID",
    );
  }, [payments]);

  const debitPaid = useMemo(() => {
    return payments.filter(
      (p) => p?.paymentStatus === "Cash-Out" && p?.status === "PAID",
    );
  }, [payments]);

  const totalAmount = useMemo(() => sumAmount(creditPaid), [creditPaid]);
  const totalDebitAmount = useMemo(() => sumAmount(debitPaid), [debitPaid]);
  const balance = totalAmount - totalDebitAmount;

  const branchCreditPaid = useMemo(() => {
    if (!branch) return [];
    return creditPaid.filter((p) => p?.branch === branch);
  }, [creditPaid, branch]);

  const branchDebitPaid = useMemo(() => {
    if (!branch) return [];
    return debitPaid.filter((p) => p?.branch === branch);
  }, [debitPaid, branch]);

  const totalBranchAmount = useMemo(
    () => sumAmount(branchCreditPaid),
    [branchCreditPaid],
  );
  const totalBranchDebitAmount = useMemo(
    () => sumAmount(branchDebitPaid),
    [branchDebitPaid],
  );
  const branchBalance = totalBranchAmount - totalBranchDebitAmount;

  const iseduAnchor = activeTab === "eduAnchor";
  const isamount = activeTab === "amount";
  const iscashIn = activeTab === "cashIn";
  const iscashOut = activeTab === "cashOut";

  const tabClass = (isActive) =>
    `flex cursor-pointer flex-col items-center rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-300 sm:text-base ${
      isActive
        ? "bg-gradient-to-r from-brandRed to-red-500 text-brandRed shadow-lg shadow-red-100"
        : "border border-gray-200 bg-white text-gray-700 shadow-sm hover:border-brandRed/30 hover:bg-red-50"
    }`;

  if (isError) console.log("Error fetching", error);
  // চাইলে UI তে error দেখাতে পারো

  return (
    <>
      <div className="w-full px-3 py-4 sm:px-4 sm:py-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-red-100 bg-gradient-to-br from-white via-red-50/40 to-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brandRed">
                Finance Wallet
              </p>
              <h4 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                My Wallet
              </h4>
              <p className="mt-2 max-w-xl text-sm text-gray-500 sm:text-base">
                Track balance, cash-in requests, and cash-out history.
              </p>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-3 lg:w-[460px]">
              <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Balance
                </p>
                <div className="mt-3 flex items-center gap-1 text-2xl font-bold text-brandRed">
                  <TbCurrencyTaka className="text-3xl" />
                  <span>{role === "superAdmin" ? balance : branchBalance}</span>
                </div>
              </div>
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  <TbTrendingUp className="text-lg" />
                  Cash In
                </div>
                <p className="mt-3 text-xl font-bold text-emerald-700">
                  <TbCurrencyTaka className="inline text-2xl" />
                  {role === "superAdmin" ? totalAmount : totalBranchAmount}
                </p>
              </div>
              <div className="rounded-3xl border border-red-100 bg-red-50/80 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-red-600">
                  <TbTrendingDown className="text-lg" />
                  Cash Out
                </div>
                <p className="mt-3 text-xl font-bold text-red-600">
                  <TbCurrencyTaka className="inline text-2xl" />
                  {role === "superAdmin"
                    ? totalDebitAmount
                    : totalBranchDebitAmount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 pb-6 w-full mx-auto max-w-7xl">
        {role === "superAdmin" ? (
          <div className="grid grid-cols-2 gap-2 rounded-[24px] bg-white/70 p-2 shadow-sm ring-1 ring-gray-100 backdrop-blur lg:grid-cols-4 sm:gap-3">
            <div
              onClick={() => setActiveTab("eduAnchor")}
              className={tabClass(iseduAnchor)}
            >
              <h1>EduAnchor</h1>
            </div>

            <div
              onClick={() => setActiveTab("amount")}
              className={tabClass(isamount)}
            >
              <h1>Amount</h1>
            </div>

            <div
              onClick={() => setActiveTab("cashIn")}
              className={tabClass(iscashIn)}
            >
              <h1>Cash In</h1>
            </div>

            <div
              onClick={() => setActiveTab("cashOut")}
              className={tabClass(iscashOut)}
            >
              <h1>Cash Out</h1>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 rounded-[24px] bg-white/70 p-2 shadow-sm ring-1 ring-gray-100 backdrop-blur sm:gap-3">
            <div
              onClick={() => setActiveTab("amount")}
              className={tabClass(isamount)}
            >
              <h1>Amount</h1>
            </div>

            <div
              onClick={() => setActiveTab("cashIn")}
              className={tabClass(iscashIn)}
            >
              <h1>Cash In</h1>
            </div>

            <div
              onClick={() => setActiveTab("cashOut")}
              className={tabClass(iscashOut)}
            >
              <h1>Cash Out</h1>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-[28px] border border-gray-100 bg-white/90 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-5">
          {role === "superAdmin" ? (
            iseduAnchor ? (
              <SuperAdminStatement id={id} />
            ) : isamount ? (
              <Amount id={id} />
            ) : iscashIn ? (
              <CashIn id={id} />
            ) : (
              <CashOut id={id} />
            )
          ) : isamount ? (
            <Amount id={id} />
          ) : iscashIn ? (
            <CashIn id={id} />
          ) : (
            <CashOut id={id} />
          )}
        </div>

        {isLoading && <p className="mt-3 text-sm text-gray-500">Loading...</p>}
      </div>
    </>
  );
}

export default Wallet;
