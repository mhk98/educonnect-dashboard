import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const documentApi = createApi({
  reducerPath: "documentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["document"], // Define the tag type
  endpoints: (build) => ({
    createDocument: build.mutation({
      query: (data) => ({
        url: "/document/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["document"],
    }),

    deleteDocument: build.mutation({
      query: (id) => ({
        url: `/document/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["document"],
    }),

    updateDocument: build.mutation({
      query: ({ id, data }) => ({
        url: `/document/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["document"],
    }),

    getAllDocument: build.query({
      query: () => ({
        url: "/document",
      }),
      providesTags: ["document"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `document/${id}`,
      }),
      providesTags: ["document"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateDocumentMutation,
  useDeleteDocumentMutation,
  useUpdateDocumentMutation,
  useGetAllDocumentQuery,
  useGetDataByIdQuery,
} = documentApi;
