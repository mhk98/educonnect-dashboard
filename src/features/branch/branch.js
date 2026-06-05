import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const branchApi = createApi({
  reducerPath: "branchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["branch"], // Define the tag type
  endpoints: (build) => ({
    createBranch: build.mutation({
      query: (data) => ({
        url: "/branch/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["branch"],
    }),

    deleteBranch: build.mutation({
      query: (id) => ({
        url: `/branch/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["branch"],
    }),

    updateBranch: build.mutation({
      query: ({ id, data }) => ({
        url: `/branch/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["branch"],
    }),

    getAllBranch: build.query({
      query: () => ({
        url: "/branch",
      }),
      providesTags: ["branch"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `branch/${id}`,
      }),
      providesTags: ["branch"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateBranchMutation,
  useGetAllBranchQuery,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useGetDataByIdQuery,
} = branchApi;
