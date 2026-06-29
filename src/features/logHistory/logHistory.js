import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const logHistoryApi = createApi({
  reducerPath: "logHistoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.alnawrasplus.com/api/v1/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["LogHistory"],
  endpoints: (build) => ({
    getAllLogHistory: build.query({
      query: ({ branch } = {}) => ({
        url: "/logHistory",
        params: { branch },
      }),
      providesTags: ["LogHistory"],
    }),
  }),
});

export const { useGetAllLogHistoryQuery } = logHistoryApi;
