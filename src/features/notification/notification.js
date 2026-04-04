import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const NotificationApi = createApi({
  reducerPath: "NotificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://backend.eaconsultancy.org/api/v1/",
  }),

  tagTypes: ["notification"], // Define the tag type
  endpoints: (build) => ({
    createNotification: build.mutation({
      query: (data) => ({
        url: "/notification/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["notification"],
    }),

    updateNotification: build.mutation({
      query: ({ id, userId }) => ({
        url: `/notification/${id}/read`,
        method: "PUT",
        body: { userId },
      }),
      invalidatesTags: ["notification"],
    }),

    getDataById: build.query({
      query: ({ branch, userId, page, limit }) => ({
        url: `notification/${branch}/${userId}`,
        params: {
          page,
          limit,
        },
      }),
      providesTags: ["notification"],
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
  useGetDataByIdQuery,
} = NotificationApi;
