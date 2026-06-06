import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const countryApi = createApi({
  reducerPath: "countryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://backend.eaconsultancy.org/api/v1/",
  }),

  tagTypes: ["country"],
  endpoints: (build) => ({
    createCountry: build.mutation({
      query: (data) => ({
        url: "/country/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["country"],
    }),

    deleteCountry: build.mutation({
      query: (id) => ({
        url: `/country/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["country"],
    }),

    updateCountry: build.mutation({
      query: ({ id, data }) => ({
        url: `/country/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["country"],
    }),

    getAllCountry: build.query({
      query: () => ({
        url: "/country",
      }),
      providesTags: ["country"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getCountryById: build.query({
      query: (id) => ({
        url: `/country/${id}`,
      }),
      providesTags: ["country"],
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateCountryMutation,
  useGetAllCountryQuery,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
  useGetCountryByIdQuery,
} = countryApi;
