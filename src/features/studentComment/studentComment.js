import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const studentCommentApi = createApi({
  reducerPath: "studentCommentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["studentComment"], // Define the tag type
  endpoints: (build) => ({
    createStudentComment: build.mutation({
      query: (data) => ({
        url: "/studentComment/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["studentComment"],
    }),

    deleteStudentComment: build.mutation({
      query: (id) => ({
        url: `/studentComment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["studentComment"],
    }),

    updateStudentComment: build.mutation({
      query: ({ id, data }) => ({
        url: `/studentComment/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["studentComment"],
    }),

    getAllStudentComment: build.query({
      query: () => ({
        url: "/studentComment",
      }),
      providesTags: ["studentComment"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `studentComment/${id}`,
      }),
      providesTags: ["studentComment"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateStudentCommentMutation,
  useDeleteStudentCommentMutation,
  useUpdateStudentCommentMutation,
  useGetAllStudentCommentQuery,
  useGetDataByIdQuery,
} = studentCommentApi;
