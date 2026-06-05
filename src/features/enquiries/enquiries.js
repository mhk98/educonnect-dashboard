import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const EnquiriesApi = createApi({
  reducerPath: "EnquiriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["enquiries"], // Define the tag type
  endpoints: (build) => ({
    createEnquiries: build.mutation({
      query: (data) => ({
        url: "/enquiries/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["enquiries"],
    }),

    deleteEnquiries: build.mutation({
      query: (id) => ({
        url: `/enquiries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["enquiries"],
    }),

    updateEnquiries: build.mutation({
      query: ({ id, data }) => ({
        url: `/enquiries/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["enquiries"],
    }),

    getAllEnquiries: build.query({
      query: ({ Status, Branch, page, limit }) => ({
        params: { Status, Branch, page, limit },
        url: "/enquiries",
      }),
      providesTags: ["enquiries"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `enquiries/${id}`,
      }),
      providesTags: ["enquiries"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateEnquiriesMutation,
  useDeleteEnquiriesMutation,
  useUpdateEnquiriesMutation,
  useGetAllEnquiriesQuery,
  useGetDataByIdQuery,
} = EnquiriesApi;
