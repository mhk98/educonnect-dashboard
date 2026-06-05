import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskActivityApi = createApi({
  reducerPath: "taskActivityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
    // credentials: "include",
  }),

  tagTypes: ["TaskActivity"],

  endpoints: (build) => ({
    getTaskActivity: build.query({
      query: (taskId) => `/taskActivity/${taskId}/activity`,
      providesTags: (r, e, taskId) => [{ type: "TaskActivity", id: taskId }],
    }),
  }),
});

export const { useGetTaskActivityQuery } = taskActivityApi;
