import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["profile"], // Define the tag type
  endpoints: (build) => ({
    createProfile: build.mutation({
      query: (data) => ({
        url: "/profile/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["profile"],
    }),

    deleteProfile: build.mutation({
      query: (id) => ({
        url: `/profile/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["profile"],
    }),

    updateProfile: build.mutation({
      query: ({ data, id }) => ({
        url: `/profile/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["profile"],
    }),

    getAllProfile: build.query({
      query: () => ({
        url: "/profile",
      }),
      providesTags: ["profile"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `profile/${id}`,
      }),
      providesTags: ["profile"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateProfileMutation,
  useDeleteProfileMutation,
  useUpdateProfileMutation,
  useGetAllProfileQuery,
  useGetDataByIdQuery,
} = profileApi;
