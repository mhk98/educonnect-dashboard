import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const leadDocumentApi = createApi({
  reducerPath: "leadDocumentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["leadDocument"], // Define the tag type
  endpoints: (build) => ({
    createLeadDocument: build.mutation({
      query: (data) => ({
        url: "/leadDocument/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["leadDocument"],
    }),

    deleteLeadDocument: build.mutation({
      query: (id) => ({
        url: `/leadDocument/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["leadDocument"],
    }),

    updateLeadDocument: build.mutation({
      query: ({ data, id }) => ({
        url: `/leadDocument/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["leadDocument"],
    }),

    getAllLeadDocument: build.query({
      query: (id) => ({
        url: `leadDocument/${id}`,
      }),
      providesTags: ["leadDocument"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `leadDocument/${id}`,
      }),
      providesTags: ["leadDocument"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateLeadDocumentMutation,
  useDeleteLeadDocumentMutation,
  useUpdateLeadDocumentMutation,
  useGetAllLeadDocumentQuery,
  useGetDataByIdQuery,
} = leadDocumentApi;
