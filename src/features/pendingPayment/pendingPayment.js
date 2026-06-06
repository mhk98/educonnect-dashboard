// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const PendingPaymentApi = createApi({
//   reducerPath: "PendingPaymentApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "https://backend.eaconsultancy.org/api/v1/",
//   }),

//   tagTypes: ["pendingPayment"], // Define the tag type
//   endpoints: (build) => ({
//     initPendingPayment: build.mutation({
//       query: (data) => ({
//         url: "/pendingPayment/init",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["pendingPayment"],
//     }),
//     validatePendingPayment: build.mutation({
//       query: (data) => ({
//         url: "/pendingPayment/webhook",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["pendingPayment"],
//     }),
//     createPendingPayment: build.mutation({
//       query: (data) => ({
//         url: "/pendingPayment/create",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["pendingPayment"],
//     }),

//     deletePendingPayment: build.mutation({
//       query: (id) => ({
//         url: `/pendingPayment/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["pendingPayment"],
//     }),

//     updatePendingPayment: build.mutation({
//       query: ({ data, id }) => ({
//         url: `/pendingPayment/${id}`,
//         method: "PUT",
//         body: data,
//       }),
//       invalidatesTags: ["pendingPayment"],
//     }),

//     getAllPendingPayment: build.query({
//       query: ({ page, limit, user_id, branch }) => ({
//         url: "/pendingPayment",
//         params: { page, limit, user_id, branch },
//       }),
//       providesTags: ["pendingPayment"],

//       refetchOnMountOrArgChange: true,
//       pollingInterval: 1000,
//     }),

//     getAllPendingPaymentWithoutQuery: build.query({
//       query: () => ({
//         url: "/pendingPayment/all",
//       }),
//       providesTags: ["pendingPayment"],

//       refetchOnMountOrArgChange: true,
//       pollingInterval: 1000,
//     }),

//     getDataById: build.query({
//       query: (id) => ({
//         url: `pendingPayment/${id}`,
//       }),
//       providesTags: ["pendingPayment"],

//       refetchOnMountOrArgChange: true,
//       pollingInterval: 1000,
//     }),
//   }),
// });

// export const {
//   useCreatePendingPaymentMutation,
//   useDeletePendingPaymentMutation,
//   useUpdatePendingPaymentMutation,
//   useGetAllPendingPaymentQuery,
//   useGetDataByIdQuery,
//   useGetAllPendingPaymentWithoutQueryQuery,
//   useInitPendingPaymentMutation,
//   useValidatePendingPaymentMutation,
// } = PendingPaymentApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const PendingPaymentApi = createApi({
  reducerPath: "PendingPaymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://backend.eaconsultancy.org/api/v1",
  }),
  tagTypes: ["pendingPayment"],
  endpoints: (build) => ({
    getAllPendingPaymentWithoutQuery: build.query({
      query: () => ({
        url: "pendingPayment/all",
      }),
      providesTags: ["pendingPayment"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 5000, // ✅ 1000 এর বদলে
    }),

    getAllPendingPayment: build.query({
      query: ({ page, limit, user_id, branch }) => ({
        url: "pendingPayment",
        params: { page, limit, user_id, branch },
      }),
      providesTags: ["pendingPayment"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 5000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `pendingPayment/${id}`,
      }),
      providesTags: ["pendingPayment"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 5000,
    }),

    initPendingPayment: build.mutation({
      query: (data) => ({
        url: "pendingPayment/init",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["pendingPayment"],
    }),

    validatePendingPayment: build.mutation({
      query: (data) => ({
        url: "pendingPayment/webhook",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["pendingPayment"],
    }),

    createPendingPayment: build.mutation({
      query: (data) => ({
        url: "pendingPayment/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["pendingPayment"],
    }),

    deletePendingPayment: build.mutation({
      query: (id) => ({
        url: `pendingPayment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["pendingPayment"],
    }),

    updatePendingPayment: build.mutation({
      query: ({ data, id }) => ({
        url: `pendingPayment/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["pendingPayment"],
    }),
  }),
});

export const {
  useGetAllPendingPaymentWithoutQueryQuery,
  useGetAllPendingPaymentQuery,
  useGetDataByIdQuery,
  useInitPendingPaymentMutation,
  useValidatePendingPaymentMutation,
  useCreatePendingPaymentMutation,
  useDeletePendingPaymentMutation,
  useUpdatePendingPaymentMutation,
} = PendingPaymentApi;
