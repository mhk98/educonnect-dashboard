import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const eaDocumentApi = createApi({
  reducerPath: "eaDocumentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["eaDocument"], // Define the tag type
  endpoints: (build) => ({
    createEADocument: build.mutation({
      query: (data) => ({
        url: "/eaDocument/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["eaDocument"],
    }),

    deleteEADocument: build.mutation({
      query: (id) => ({
        url: `/eaDocument/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["eaDocument"],
    }),

    updateEADocument: build.mutation({
      query: ({ data, id }) => ({
        url: `/eaDocument/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["eaDocument"],
    }),

    getAllEADocument: build.query({
      query: (id) => ({
        url: `eaDocument/${id}`,
      }),
      providesTags: ["eaDocument"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `eaDocument/${id}`,
      }),
      providesTags: ["eaDocument"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateEADocumentMutation,
  useDeleteEADocumentMutation,
  useUpdateEADocumentMutation,
  useGetAllEADocumentQuery,
  useGetDataByIdQuery,
} = eaDocumentApi;
