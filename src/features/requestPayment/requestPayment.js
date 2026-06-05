import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const RequestPaymentApi = createApi({
  reducerPath: "RequestPaymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["requestPayment"], // Define the tag type
  endpoints: (build) => ({
    createRequestPayment: build.mutation({
      query: (data) => ({
        url: "/requestPayment/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["requestPayment"],
    }),

    deleteRequestPayment: build.mutation({
      query: (id) => ({
        url: `/requestPayment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["requestPayment"],
    }),

    updateRequestPayment: build.mutation({
      query: ({ id, data }) => ({
        url: `/requestPayment/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["requestPayment"],
    }),

    getAllRequestPayment: build.query({
      query: () => ({
        url: "/requestPayment",
      }),
      providesTags: ["requestPayment"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `requestPayment/${id}`,
      }),
      providesTags: ["requestPayment"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateRequestPaymentMutation,
  useDeleteRequestPaymentMutation,
  useUpdateRequestPaymentMutation,
  useGetAllRequestPaymentQuery,
  useGetDataByIdQuery,
} = RequestPaymentApi;
