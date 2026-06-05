import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const testsApi = createApi({
  reducerPath: "testsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["tests"], // Define the tag type
  endpoints: (build) => ({
    createTests: build.mutation({
      query: (data) => ({
        url: "/tests/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["tests"],
    }),

    deleteTests: build.mutation({
      query: (id) => ({
        url: `/tests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tests"],
    }),

    updateTests: build.mutation({
      query: ({ id, data }) => ({
        url: `/tests/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["tests"],
    }),

    getAllTests: build.query({
      query: () => ({
        url: "/tests",
      }),
      providesTags: ["tests"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `tests/${id}`,
      }),
      providesTags: ["tests"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateTestsMutation,
  useDeleteTestsMutation,
  useUpdateTestsMutation,
  useGetAllTestsQuery,
  useGetDataByIdQuery,
} = testsApi;
