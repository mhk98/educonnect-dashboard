import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const CashInApi = createApi({
  reducerPath: "CashInApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["cashIn"], // Define the tag type
  endpoints: (build) => ({
    createCashIn: build.mutation({
      query: (data) => ({
        url: "/cashIn/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["cashIn"],
    }),

    deleteCashIn: build.mutation({
      query: (id) => ({
        url: `/cashIn/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cashIn"],
    }),

    updateCashIn: build.mutation({
      query: ({ id, data }) => ({
        url: `/cashIn/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["cashIn"],
    }),

    getAllCashIn: build.query({
      query: () => ({
        url: "/cashIn",
      }),
      providesTags: ["cashIn"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `cashIn/${id}`,
      }),
      providesTags: ["cashIn"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateCashInMutation,
  useGetAllCashInQuery,
  useUpdateCashInMutation,
  useDeleteCashInMutation,
  useGetDataByIdQuery,
} = CashInApi;
