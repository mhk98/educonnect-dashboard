import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quickLinkApi = createApi({
  reducerPath: "quickLinkApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://backend.eaconsultancy.org/api/v1/",
  }),
  tagTypes: ["quickLink"],
  endpoints: (build) => ({
    getAllQuickLinks: build.query({
      query: () => "/quickLink",
      providesTags: ["quickLink"],
    }),
    createQuickLink: build.mutation({
      query: (data) => ({
        url: "/quickLink/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["quickLink"],
    }),
    updateQuickLink: build.mutation({
      query: ({ id, data }) => ({
        url: `/quickLink/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["quickLink"],
    }),
    deleteQuickLink: build.mutation({
      query: (id) => ({
        url: `/quickLink/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["quickLink"],
    }),
  }),
});

export const {
  useGetAllQuickLinksQuery,
  useCreateQuickLinkMutation,
  useUpdateQuickLinkMutation,
  useDeleteQuickLinkMutation,
} = quickLinkApi;
