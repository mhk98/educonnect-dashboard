import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const studentReplyApi = createApi({
  reducerPath: "studentReplyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["studentReply"], // Define the tag type
  endpoints: (build) => ({
    createStudentReply: build.mutation({
      query: (data) => ({
        url: "/studentReply/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["studentReply"],
    }),

    deleteStudentReply: build.mutation({
      query: (id) => ({
        url: `/studentReply/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["studentReply"],
    }),

    updateStudentReply: build.mutation({
      query: ({ id, data }) => ({
        url: `/studentReply/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["studentReply"],
    }),

    getAllStudentReply: build.query({
      query: () => ({
        url: "/studentReply",
      }),
      providesTags: ["studentReply"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `studentReply/${id}`,
      }),
      providesTags: ["studentReply"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateStudentReplyMutation,
  useDeleteStudentReplyMutation,
  useUpdateStudentReplyMutation,
  useGetAllStudentReplyQuery,
  useGetDataByIdQuery,
} = studentReplyApi;
