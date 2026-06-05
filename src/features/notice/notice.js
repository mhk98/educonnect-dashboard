import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const noticeApi = createApi({
  reducerPath: "noticeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["notice"], // Define the tag type
  endpoints: (build) => ({
    createNotice: build.mutation({
      query: (data) => ({
        url: "/notice/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["notice"],
    }),

    deleteNotice: build.mutation({
      query: (id) => ({
        url: `/notice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notice"],
    }),

    updateNotice: build.mutation({
      query: ({ id, data }) => ({
        url: `/notice/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["notice"],
    }),

    getAllNotice: build.query({
      query: () => ({
        url: "/notice",
      }),
      providesTags: ["notice"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `/notice/${id}`,
      }),
      providesTags: ["notice"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
  useUpdateNoticeMutation,
  useGetAllNoticeQuery,
  useGetDataByIdQuery,
} = noticeApi;
