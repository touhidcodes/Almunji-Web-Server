import { tagTypes } from "../tags";
import { baseServerApi } from "./baseApi";

export const paraApi = baseServerApi.injectEndpoints({
  endpoints: (build) => ({
    // --------------------
    // QUERIES
    // --------------------

    // Get all paras (public)
    getAllParas: build.query({
      query: () => ({
        url: "/para/all",
        method: "GET",
      }),
      providesTags: [tagTypes.para],
    }),

    // Get all paras (admin)
    getAllParasByAdmin: build.query({
      query: () => ({
        url: "/para/admin/all",
        method: "GET",
      }),
      providesTags: [tagTypes.para],
    }),

    // Get single para by ID
    getParaById: build.query({
      query: (paraId: string) => ({
        url: `/para/${paraId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.para],
    }),

    // Create para
    createPara: build.mutation({
      query: (payload) => ({
        url: "/para",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [tagTypes.para],
    }),

    // Update para
    updatePara: build.mutation({
      query: ({ paraId, payload }) => ({
        url: `/para/${paraId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { paraId }) => [
        { type: tagTypes.para, id: paraId },
      ],
    }),

    // Delete para (admin only)
    deletePara: build.mutation({
      query: (paraId: string) => ({
        url: `/para/admin/${paraId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.para],
    }),
  }),
});

export const {
  useGetAllParasQuery,
  useGetAllParasByAdminQuery,
  useGetParaByIdQuery,
  useCreateParaMutation,
  useUpdateParaMutation,
  useDeleteParaMutation,
} = paraApi;
