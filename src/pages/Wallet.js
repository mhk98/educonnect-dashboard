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
//               <button className="px-4 py-2 flex items-center bg-white text-brandBlue border-2 border-brandBlue rounded-md text-sm md:text-base transition">
//                 <TbCurrencyTaka /> {balance}
//               </button>

//               {/* Register New Student */}
//               {/* <button className="px-4 py-2 bg-brandBlue text-white rounded-md text-sm md:text-base hover:bg-brandBlue-700 transition">
//             ADD MONEY
//           </button> */}
//             </div>
//           ) : (
//             <div className="flex items-center sm:flex-row gap-3">
//               <p>Balance:</p>
//               <button className="px-4 py-2 flex items-center bg-white text-brandBlue border-2 border-brandBlue rounded-md text-sm md:text-base transition">
//                 <TbCurrencyTaka /> {branchBalance}
//               </button>

//               {/* Register New Student */}
//               {/* <button className="px-4 py-2 bg-brandBlue text-white rounded-md text-sm md:text-base hover:bg-brandBlue-700 transition">
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
//                   ? "bg-brandBlue text-white rounded-md py-1"
//                   : "bg-gray-200 text-gray-700 rounded-md py-1"
//               }`}
//             >
//               <h1 className="mt-1 text-xl">EduConnect</h1>
//             </div>

//             <div
//               onClick={() => setActiveTab("amount")}
//               className={`flex flex-col items-center cursor-pointer ${
//                 isamount
//                   ? "bg-brandBlue text-white rounded-md py-1"
//                   : "bg-gray-200 text-gray-700 rounded-md py-1"
//               }`}
//             >
//               <h1 className="mt-1 text-xl">Amount</h1>
//             </div>
//             <div
//               onClick={() => setActiveTab("cashIn")}
//               className={`flex flex-col items-center cursor-pointer ${
//                 iscashIn
//                   ? "bg-brandBlue text-white rounded-md py-1"
//                   : "bg-gray-200 text-gray-700 rounded-md py-1"
//               }`}
//             >
//               {/* className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
//       isFinance ? "bg-brandBlue text-white" : "bg-gray-200"
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
//                   ? "bg-brandBlue text-white rounded-md py-1"
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
//                   ? "bg-brandBlue text-white rounded-md py-1"
//                   : "bg-gray-200 text-gray-700 rounded-md py-1"
//               }`}
//             >
//               <h1 className="mt-1 text-xl">Amount</h1>
//             </div>
//             <div
//               onClick={() => setActiveTab("cashIn")}
//               className={`flex flex-col items-center cursor-pointer ${
//                 iscashIn
//                   ? "bg-brandBlue text-white rounded-md py-1"
//                   : "bg-gray-200 text-gray-700 rounded-md py-1"
//               }`}
//             >
//               {/* className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
//       isFinance ? "bg-brandBlue text-white" : "bg-gray-200"
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
//                   ? "bg-brandBlue text-white rounded-md py-1"
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
import { Wallet as WalletIcon, LayoutList, ArrowDownCircle, ArrowUpCircle, Building2 } from "lucide-react";

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

  const creditPaid = useMemo(
    () => payments.filter((p) => ["Cash-In", "Offline", "Online"].includes(p?.paymentStatus) && p?.status === "PAID"),
    [payments],
  );
  const debitPaid = useMemo(
    () => payments.filter((p) => p?.paymentStatus === "Cash-Out" && p?.status === "PAID"),
    [payments],
  );

  const totalAmount = useMemo(() => sumAmount(creditPaid), [creditPaid]);
  const totalDebitAmount = useMemo(() => sumAmount(debitPaid), [debitPaid]);
  const balance = totalAmount - totalDebitAmount;

  const branchCreditPaid = useMemo(
    () => (!branch ? [] : creditPaid.filter((p) => p?.branch === branch)),
    [creditPaid, branch],
  );
  const branchDebitPaid = useMemo(
    () => (!branch ? [] : debitPaid.filter((p) => p?.branch === branch)),
    [debitPaid, branch],
  );

  const totalBranchAmount = useMemo(() => sumAmount(branchCreditPaid), [branchCreditPaid]);
  const totalBranchDebitAmount = useMemo(() => sumAmount(branchDebitPaid), [branchDebitPaid]);
  const branchBalance = totalBranchAmount - totalBranchDebitAmount;

  const displayBalance = role === "superAdmin" ? balance : branchBalance;
  const displayCashIn = role === "superAdmin" ? totalAmount : totalBranchAmount;
  const displayCashOut = role === "superAdmin" ? totalDebitAmount : totalBranchDebitAmount;

  const iseduAnchor = activeTab === "eduAnchor";
  const isamount = activeTab === "amount";
  const iscashIn = activeTab === "cashIn";
  const iscashOut = activeTab === "cashOut";

  if (isError) console.log("Error fetching", error);

  const superAdminTabs = [
    { id: "eduAnchor", label: "EduConnect", icon: Building2 },
    { id: "amount",    label: "Amount",     icon: LayoutList },
    { id: "cashIn",    label: "Cash In",    icon: ArrowDownCircle },
    { id: "cashOut",   label: "Cash Out",   icon: ArrowUpCircle },
  ];
  const regularTabs = [
    { id: "amount",  label: "Amount",   icon: LayoutList },
    { id: "cashIn",  label: "Cash In",  icon: ArrowDownCircle },
    { id: "cashOut", label: "Cash Out", icon: ArrowUpCircle },
  ];
  const tabs = role === "superAdmin" ? superAdminTabs : regularTabs;

  return (
    <div className="w-full px-4 sm:px-8 py-6 bg-gray-50 min-h-screen">

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-brandBlue flex items-center justify-center flex-shrink-0">
            <WalletIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brandBlue">Finance Wallet</p>
            <h4 className="text-2xl font-bold text-gray-900 leading-tight">My Wallet</h4>
          </div>
        </div>
        <p className="hidden md:block text-sm text-gray-400">
          Track balance, cash-in requests, and cash-out history
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Balance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Balance</p>
          <div className={`flex items-center gap-1 text-3xl font-bold ${displayBalance < 0 ? "text-red-500" : "text-brandBlue"}`}>
            <TbCurrencyTaka />
            <span>{displayBalance.toLocaleString()}</span>
          </div>
        </div>

        {/* Cash In */}
        <div className="bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">
            <TbTrendingUp className="text-base" />
            Cash In
          </div>
          <div className="flex items-center gap-1 text-3xl font-bold text-emerald-700">
            <TbCurrencyTaka />
            <span>{displayCashIn.toLocaleString()}</span>
          </div>
        </div>

        {/* Cash Out */}
        <div className="bg-red-50 rounded-2xl border border-red-100 shadow-sm p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-500 mb-3">
            <TbTrendingDown className="text-base" />
            Cash Out
          </div>
          <div className="flex items-center gap-1 text-3xl font-bold text-red-600">
            <TbCurrencyTaka />
            <span>{displayCashOut.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Card with Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-100">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center py-5 text-sm font-semibold border-b-2 transition-all -mb-px outline-none focus:outline-none ${
                activeTab === id
                  ? "border-brandBlue text-brandBlue"
                  : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
              }`}
            >
              <span className={`w-8 h-8 mr-2.5 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                activeTab === id ? "bg-brandBlue/10 text-brandBlue" : "text-gray-400"
              }`}>
                <Icon className="w-4 h-4" />
              </span>
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading...</div>
          ) : role === "superAdmin" ? (
            iseduAnchor ? <SuperAdminStatement id={id} /> :
            isamount    ? <Amount id={id} /> :
            iscashIn    ? <CashIn id={id} /> :
                          <CashOut id={id} />
          ) : (
            isamount  ? <Amount id={id} /> :
            iscashIn  ? <CashIn id={id} /> :
                        <CashOut id={id} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Wallet;
