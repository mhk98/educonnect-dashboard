import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const additionalDocumentApi = createApi({
  reducerPath: "additionalDocumentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["additionalDocument"], // Define the tag type
  endpoints: (build) => ({
    createAdditionalDocument: build.mutation({
      query: (data) => ({
        url: "/additionalDocument/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["additionalDocument"],
    }),

    deleteAdditionalDocument: build.mutation({
      query: (id) => ({
        url: `/additionalDocument/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["additionalDocument"],
    }),

    updateAdditionalDocument: build.mutation({
      query: ({ data, id }) => ({
        url: `/additionalDocument/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["additionalDocument"],
    }),

    getAllAdditionalDocument: build.query({
      query: () => ({
        url: "/additionalDocument",
      }),
      providesTags: ["additionalDocument"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getSingleAdditionalDataById: build.query({
      query: (id) => ({
        url: `additionalDocument/${id}`,
      }),
      providesTags: ["additionalDocument"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateAdditionalDocumentMutation,
  useDeleteAdditionalDocumentMutation,
  useUpdateAdditionalDocumentMutation,
  useGetAllAdditionalDocumentQuery,
  useGetSingleAdditionalDataByIdQuery,
} = additionalDocumentApi;
