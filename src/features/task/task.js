import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const TaskApi = createApi({
  reducerPath: "TaskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://backend.eaconsultancy.org/api/v1/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["task"], // Define the tag type
  endpoints: (build) => ({
    createTask: build.mutation({
      query: (data) => ({
        url: "/task/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["task"],
    }),

    deleteTask: build.mutation({
      query: (id) => ({
        url: `/task/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["task"],
    }),

    updateTask: build.mutation({
      query: ({ id, data }) => ({
        url: `/task/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["task"],
    }),

    getAllTask: build.query({
      query: ({
        branch,
        assignedTo_id,
        user_id,
        status,
        searchTerm,
        page,
        limit,
      }) => ({
        url: "/task",
        params: {
          branch,
          assignedTo_id,
          user_id,
          status,
          searchTerm,
          page,
          limit,
        },
      }),
      providesTags: ["task"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 10000,
    }),

    getDataById: build.query({
      query: (user_id) => ({
        url: `task/${user_id}`,
      }),
      providesTags: ["task"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 10000,
    }),
    getTaskOverview: build.query({
      query: ({ branch, user_id, assignedTo_id }) => ({
        url: "/task/overview",
        params: { branch, user_id, assignedTo_id },
      }),
      providesTags: ["task"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 10000,
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetAllTaskQuery,
  useGetTaskOverviewQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetDataByIdQuery,
} = TaskApi;
