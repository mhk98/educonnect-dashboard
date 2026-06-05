import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ConsultationApi = createApi({
  reducerPath: "ConsultationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["consultation"], // Define the tag type
  endpoints: (build) => ({
    createConsultation: build.mutation({
      query: (data) => ({
        url: "/consultation/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["consultation"],
    }),

    deleteConsultation: build.mutation({
      query: (id) => ({
        url: `/consultation/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["consultation"],
    }),

    updateConsultation: build.mutation({
      query: ({ id, data }) => ({
        url: `/consultation/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["consultation"],
    }),

    getAllConsultation: build.query({
      query: ({
        appointmentDate,
        status,
        role,
        startDate,
        endDate,
        month,
        fullName,
        location,
        type,
        phone,
        ieltsScore,
        destination,
        user_id,
        searchTerm,
        page,
        limit,
      }) => ({
        url: "/consultation",
        params: {
          appointmentDate,
          status,
          role,
          startDate,
          endDate,
          month,
          fullName,
          location,
          type,
          phone,
          ieltsScore,
          destination,
          user_id,
          searchTerm,
          page,
          limit,
        },
      }),
      providesTags: ["consultation"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `consultation/${id}`,
      }),
      providesTags: ["consultation"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getLeadInfoById: build.query({
      query: (id) => ({
        url: `consultation/lead-info/${id}`,
      }),
      providesTags: ["consultation"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateConsultationMutation,
  useGetAllConsultationQuery,
  useUpdateConsultationMutation,
  useDeleteConsultationMutation,
  useGetDataByIdQuery,
  useGetLeadInfoByIdQuery,
} = ConsultationApi;
