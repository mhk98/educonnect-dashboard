import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const programYearsApi = createApi({
  reducerPath: "programYearsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
  }),

  tagTypes: ["programYear"], // Define the tag type
  endpoints: (build) => ({
    createprogramYear: build.mutation({
      query: (data) => ({
        url: "/programYear/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["programYear"],
    }),

    deleteprogramYear: build.mutation({
      query: (id) => ({
        url: `/programYear/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["programYear"],
    }),

    updateprogramYear: build.mutation({
      query: ({ id, data }) => ({
        url: `/programYear/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["programYear"],
    }),

    getAllprogramYear: build.query({
      query: () => ({
        url: "/programYear",
      }),
      providesTags: ["programYear"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `programYear/${id}`,
      }),
      providesTags: ["programYear"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateprogramYearMutation,
  useGetAllprogramYearQuery,
  useDeleteprogramYearMutation,
  useUpdateprogramYearMutation,
  useGetDataByIdQuery,
} = programYearsApi;
