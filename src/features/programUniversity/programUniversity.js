import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const programUniversityApi = createApi({
  reducerPath: "programUniversityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["programUniversity"], // Define the tag type
  endpoints: (build) => ({
    createprogramUniversity: build.mutation({
      query: (data) => ({
        url: "/programUniversity/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["programUniversity"],
    }),

    deleteprogramUniversity: build.mutation({
      query: (id) => ({
        url: `/programUniversity/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["programUniversity"],
    }),

    updateprogramUniversity: build.mutation({
      query: ({ id, data }) => ({
        url: `/programUniversity/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["programUniversity"],
    }),

    getAllprogramUniversity: build.query({
      query: ({ country_id }) => ({
        url: "/programUniversity",
        params: { country_id },
      }),
      providesTags: ["programUniversity"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `programUniversity/${id}`,
      }),
      providesTags: ["programUniversity"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateprogramUniversityMutation,
  useDeleteprogramUniversityMutation,
  useUpdateprogramUniversityMutation,
  useGetAllprogramUniversityQuery,
  useGetDataByIdQuery,
} = programUniversityApi;
