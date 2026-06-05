import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ContractApi = createApi({
  reducerPath: "ContractApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1/",
  }),

  tagTypes: ["contract"], // Define the tag type
  endpoints: (build) => ({
    createContract: build.mutation({
      query: (data) => ({
        url: "/contract/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["contract"],
    }),

    deleteContract: build.mutation({
      query: (id) => ({
        url: `/contract/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contract"],
    }),

    updateContract: build.mutation({
      query: ({ id, data }) => ({
        url: `/contract/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["contract"],
    }),

    getAllContract: build.query({
      query: () => ({
        url: "/contract",
      }),
      providesTags: ["contract"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),

    getDataById: build.query({
      query: (id) => ({
        url: `contract/${id}`,
      }),
      providesTags: ["contract"],

      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }),
  }),
});

export const {
  useCreateContractMutation,
  useGetAllContractQuery,
  useUpdateContractMutation,
  useDeleteContractMutation,
  useGetDataByIdQuery,
} = ContractApi;
