import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const programIntakeApi = createApi({
  reducerPath: "programIntakeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["programIntake"], // Define the tag type
  endpoints: (build) => ({
    createprogramIntake: build.mutation({
      query: (data) => ({
        url: "/programIntake/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["programIntake"],
    }),

    deleteprogramIntake: build.mutation({
      query: (id) => ({
        url: `/programIntake/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["programIntake"],
    }),

    updateprogramIntake: build.mutation({
      query: ({ id, data }) => ({
        url: `/programIntake/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["programIntake"],
    }),

    getAllprogramIntake: build.query({
      query: () => ({
        url: "/programIntake",
      }),
      providesTags: ["programIntake"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `programIntake/${id}`,
      }),
      providesTags: ["programIntake"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateprogramIntakeMutation,
  useDeleteprogramIntakeMutation,
  useUpdateprogramIntakeMutation,
  useGetAllprogramIntakeQuery,
  useGetDataByIdQuery,
} = programIntakeApi;
