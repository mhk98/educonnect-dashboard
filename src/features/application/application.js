import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const applicationApi = createApi({
  reducerPath: "applicationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["application"], // Define the tag type
  endpoints: (build) => ({
    createApplication: build.mutation({
      query: (data) => ({
        url: "/application/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["application"],
    }),

    deleteApplication: build.mutation({
      query: (acknowledge) => ({
        url: `/application/${acknowledge}`,
        method: "DELETE",
      }),
      invalidatesTags: ["application"],
    }),

    updateApplication: build.mutation({
      query: ({ id, data }) => ({
        url: `/application/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["application"],
    }),

    getAllApplication: build.query({
      query: ({
        searchTerm,
        FirstName,
        LastName,
        intake,
        Branch,
        user_id,
        university,
        page,
        limit,
      }) => ({
        url: "/application",
        params: {
          searchTerm,
          FirstName,
          LastName,
          intake,
          Branch,
          user_id,
          university,
          page,
          limit,
        },
      }),
      providesTags: ["application"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getStatusCounts: build.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/application//status?${queryString}`;
      },
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `application/${id}`,
      }),
      providesTags: ["application"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateApplicationMutation,
  useDeleteApplicationMutation,
  useUpdateApplicationMutation,
  useGetAllApplicationQuery,
  useGetDataByIdQuery,
  useGetStatusCountsQuery,
} = applicationApi;
