import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const academicApi = createApi({
  reducerPath: "academicApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["academic"], // Define the tag type
  endpoints: (build) => ({
    createAcademic: build.mutation({
      query: (data) => ({
        url: "/academic/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["academic"],
    }),

    deleteAcademic: build.mutation({
      query: (id) => ({
        url: `/academic/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["academic"],
    }),

    updateAcademic: build.mutation({
      query: ({ id, data }) => ({
        url: `/academic/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["academic"],
    }),

    getAllAcademic: build.query({
      query: () => ({
        url: "/academic",
      }),
      providesTags: ["academic"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `academic/${id}`,
      }),
      providesTags: ["academic"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateAcademicMutation,
  useDeleteAcademicMutation,
  useUpdateAcademicMutation,
  useGetAllAcademicQuery,
  useGetDataByIdQuery,
} = academicApi;
