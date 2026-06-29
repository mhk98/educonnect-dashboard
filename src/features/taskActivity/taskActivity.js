import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskActivityApi = createApi({
  reducerPath: "taskActivityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.alnawrasplus.com/api/v1/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["TaskActivity"],

  endpoints: (build) => ({
    getAllTaskActivity: build.query({
      query: ({ branch } = {}) => ({
        url: "/taskActivity",
        params: { branch },
      }),
      providesTags: ["TaskActivity"],
    }),
    getTaskActivity: build.query({
      query: (taskId) => `/taskActivity/${taskId}/activity`,
      providesTags: (r, e, taskId) => [{ type: "TaskActivity", id: taskId }],
    }),
  }),
});

export const { useGetAllTaskActivityQuery, useGetTaskActivityQuery } =
  taskActivityApi;
