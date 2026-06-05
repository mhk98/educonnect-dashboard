import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const programCountryApi = createApi({
  reducerPath: "programCountryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["programCountry"], // Define the tag type
  endpoints: (build) => ({
    createProgramCountry: build.mutation({
      query: (data) => ({
        url: "/programCountry/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["programCountry"],
    }),

    deleteProgramCountry: build.mutation({
      query: (id) => ({
        url: `/programCountry/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["programCountry"],
    }),

    updateProgramCountry: build.mutation({
      query: ({ id, data }) => ({
        url: `/programCountry/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["programCountry"],
    }),

    getAllProgramCountry: build.query({
      query: () => ({
        url: "/programCountry",
      }),
      providesTags: ["programCountry"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `programCountry/${id}`,
      }),
      providesTags: ["programCountry"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateProgramCountryMutation,
  useGetAllProgramCountryQuery,
  useGetDataByIdQuery,
} = programCountryApi;
