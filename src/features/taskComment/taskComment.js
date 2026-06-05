import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskCommentApi = createApi({
  reducerPath: "taskCommentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
    credentials: "include",
  }),

  tagTypes: ["TaskComment", "TaskActivity"],

  endpoints: (build) => ({
    getTaskComments: build.query({
      query: (taskId) => `/taskComment/${taskId}/comment`,
      providesTags: (r, e, taskId) => [{ type: "TaskComment", id: taskId }],
    }),

    addTaskComment: build.mutation({
      query: ({ taskId, data }) => ({
        url: `/taskComment/${taskId}/comment`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (r, e, { taskId }) => [
        { type: "TaskComment", id: taskId },
        "TaskActivity",
      ],
    }),

    updateTaskComment: build.mutation({
      query: ({ commentId, data }) => ({
        url: `/taskComment/comment/${commentId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["TaskComment", "TaskActivity"],
    }),

    deleteTaskComment: build.mutation({
      query: ({ commentId, data }) => ({
        url: `/taskComment/comment/${commentId}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["TaskComment", "TaskActivity"],
    }),
  }),
});

export const {
  useGetTaskCommentsQuery,
  useAddTaskCommentMutation,
  useUpdateTaskCommentMutation,
  useDeleteTaskCommentMutation,
} = taskCommentApi;

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const taskCommentApi = createApi({
//   reducerPath: "taskCommentApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "http://localhost:5000/api/v1/",
//     credentials: "include",
//   }),

//   tagTypes: ["TaskComment", "TaskActivity"],

//   endpoints: (build) => ({
//     // =======================
//     // GET COMMENTS
//     // =======================
//     getTaskComments: build.query({
//       query: (taskId) => `/taskComment/${taskId}/comment`,
//       providesTags: (result, error, taskId) => [
//         { type: "TaskComment", id: taskId },
//       ],
//     }),

//     // =======================
//     // ADD COMMENT
//     // =======================
//     addTaskComment: build.mutation({
//       query: ({ taskId, ...data }) => ({
//         url: `/taskComment/${taskId}/comment`,
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: (result, error, { taskId }) => [
//         { type: "TaskComment", id: taskId },
//         { type: "TaskActivity", id: taskId },
//       ],
//     }),

//     // =======================
//     // UPDATE COMMENT
//     // =======================
//     updateTaskComment: build.mutation({
//       query: ({ commentId, taskId, ...data }) => ({
//         url: `/taskComment/comment/${commentId}`,
//         method: "PUT",
//         body: data,
//       }),
//       invalidatesTags: (result, error, { taskId }) => [
//         { type: "TaskComment", id: taskId },
//         { type: "TaskActivity", id: taskId },
//       ],
//     }),

//     // =======================
//     // DELETE COMMENT
//     // =======================
//     deleteTaskComment: build.mutation({
//       query: ({ commentId, taskId }) => ({
//         url: `/taskComment/comment/${commentId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: (result, error, { taskId }) => [
//         { type: "TaskComment", id: taskId },
//         { type: "TaskActivity", id: taskId },
//       ],
//     }),

//     // =======================
//     // GET ACTIVITY
//     // =======================
//     getTaskActivity: build.query({
//       query: (taskId) => `/taskActivity/${taskId}/activity`,
//       providesTags: (result, error, taskId) => [
//         { type: "TaskActivity", id: taskId },
//       ],
//     }),
//   }),
// });

// export const {
//   useGetTaskCommentsQuery,
//   useAddTaskCommentMutation,
//   useUpdateTaskCommentMutation,
//   useDeleteTaskCommentMutation,
//   useGetTaskActivityQuery,
// } = taskCommentApi;
