// import cartSlice from "@/Redux-Thunk/reducers/cartSlice";

import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/auth";
import { profileApi } from "../features/profile/profile";
import { applicationApi } from "../features/application/application";
import { documentApi } from "../features/document/document";
import { academicApi } from "../features/academic/academic";
import { testsApi } from "../features/tests/tests";
import { studentCommentApi } from "../features/studentComment/studentComment";
import { studentReplyApi } from "../features/studentReply/studentReply";
import { additionalDocumentApi } from "../features/additionalDocument/additionalDocument";
import { programCountryApi } from "../features/programCountry/programCountry";
import { programIntakeApi } from "../features/programIntake/programIntake";
import { programUniversityApi } from "../features/programUniversity/programUniversity";
import { programNameApi } from "../features/programName/programName";
import { programYearsApi } from "../features/programYears/programYears";
import { PendingPaymentApi } from "../features/pendingPayment/pendingPayment";
import { RequestPaymentApi } from "../features/requestPayment/requestPayment";
import { CashInApi } from "../features/cashIn/cashIn";
import { EnquiriesApi } from "../features/enquiries/enquiries";
import { CommissionApi } from "../features/commission/commission";
import { TaskApi } from "../features/task/task";
import { taskActivityApi } from "../features/taskActivity/taskActivity";
import { taskCommentApi } from "../features/taskComment/taskComment";
import { ContractApi } from "../features/contract/contract";
import { eaDocumentApi } from "../features/eaDocument/eaDocument";
import { ConsultationApi } from "../features/consultation/consultation";
import { leadDocumentApi } from "../features/leadDocument/leadDocument";
import { NotificationApi } from "../features/notification/notification";
import { noticeApi } from "../features/notice/notice";
import { branchApi } from "../features/branch/branch";
import { countryApi } from "../features/country/country";
import { quickLinkApi } from "../features/quickLink/quickLink";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [noticeApi.reducerPath]: noticeApi.reducer,
    [NotificationApi.reducerPath]: NotificationApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [applicationApi.reducerPath]: applicationApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
    [academicApi.reducerPath]: academicApi.reducer,
    [testsApi.reducerPath]: testsApi.reducer,
    [studentCommentApi.reducerPath]: studentCommentApi.reducer,
    [studentReplyApi.reducerPath]: studentReplyApi.reducer,
    [additionalDocumentApi.reducerPath]: additionalDocumentApi.reducer,
    [programYearsApi.reducerPath]: programYearsApi.reducer,
    [programCountryApi.reducerPath]: programCountryApi.reducer,
    [programIntakeApi.reducerPath]: programIntakeApi.reducer,
    [programUniversityApi.reducerPath]: programUniversityApi.reducer,
    [programNameApi.reducerPath]: programNameApi.reducer,
    [branchApi.reducerPath]: branchApi.reducer,
    [countryApi.reducerPath]: countryApi.reducer,
    [RequestPaymentApi.reducerPath]: RequestPaymentApi.reducer,
    [PendingPaymentApi.reducerPath]: PendingPaymentApi.reducer,
    [CashInApi.reducerPath]: CashInApi.reducer,
    [CommissionApi.reducerPath]: CommissionApi.reducer,
    [EnquiriesApi.reducerPath]: EnquiriesApi.reducer,
    [TaskApi.reducerPath]: TaskApi.reducer,
    [taskCommentApi.reducerPath]: taskCommentApi.reducer,
    [taskActivityApi.reducerPath]: taskActivityApi.reducer,
    [ContractApi.reducerPath]: ContractApi.reducer,
    [eaDocumentApi.reducerPath]: eaDocumentApi.reducer,
    [ConsultationApi.reducerPath]: ConsultationApi.reducer,
    [leadDocumentApi.reducerPath]: leadDocumentApi.reducer,
    [quickLinkApi.reducerPath]: quickLinkApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // contactApi.middleware,
      authApi.middleware,
      NotificationApi.middleware,
      noticeApi.middleware,
      profileApi.middleware,
      documentApi.middleware,
      academicApi.middleware,
      branchApi.middleware,
      testsApi.middleware,
      studentCommentApi.middleware,
      studentReplyApi.middleware,
      additionalDocumentApi.middleware,
      programCountryApi.middleware,
      programIntakeApi.middleware,
      programUniversityApi.middleware,
      programNameApi.middleware,
      programYearsApi.middleware,
      countryApi.middleware,
      RequestPaymentApi.middleware,
      PendingPaymentApi.middleware,
      CashInApi.middleware,
      CommissionApi.middleware,
      EnquiriesApi.middleware,
      TaskApi.middleware,
      taskCommentApi.middleware,
      taskActivityApi.middleware,
      ContractApi.middleware,
      applicationApi.middleware,
      eaDocumentApi.middleware,
      ConsultationApi.middleware,
      leadDocumentApi.middleware,
      quickLinkApi.middleware,
    ),
});

export default store;
