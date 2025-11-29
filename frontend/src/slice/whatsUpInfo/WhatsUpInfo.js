<<<<<<< HEAD
// filepath: /c:/Users/Admin/Desktop/CDHCHEMICAL/git/frontend/src/redux/whatsUpInfoApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const whatsUpInfoApi = createApi({
    reducerPath: 'whatsUpInfoApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/whatsup' }),
    endpoints: (builder) => ({
        getWhatsUpInfo: builder.query({
            query: () => 'whatsupInfo',
        }),
        getWhatsUpInfoById: builder.query({
            query: (id) => `whatsupInfo/${id}`,
        }),
        createWhatsUpInfo: builder.mutation({
            query: (newInfo) => ({
                url: 'whatsupInfo',
                method: 'POST',
                body: newInfo,
            }),
        }),
        updateWhatsUpInfoById: builder.mutation({
            query: ({ id, ...updatedInfo }) => ({
                url: `whatsupInfo/${id}`,
                method: 'PUT',
                body: updatedInfo,
            }),
        }),
        deleteWhatsUpInfoById: builder.mutation({
            query: (id) => ({
                url: `whatsupInfo/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetWhatsUpInfoQuery,
    useGetWhatsUpInfoByIdQuery,
    useCreateWhatsUpInfoMutation,
    useUpdateWhatsUpInfoByIdMutation,
    useDeleteWhatsUpInfoByIdMutation,
=======
// filepath: /c:/Users/Admin/Desktop/CDHCHEMICAL/git/frontend/src/redux/whatsUpInfoApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const whatsUpInfoApi = createApi({
    reducerPath: 'whatsUpInfoApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/whatsup' }),
    endpoints: (builder) => ({
        getWhatsUpInfo: builder.query({
            query: () => 'whatsupInfo',
        }),
        getWhatsUpInfoById: builder.query({
            query: (id) => `whatsupInfo/${id}`,
        }),
        createWhatsUpInfo: builder.mutation({
            query: (newInfo) => ({
                url: 'whatsupInfo',
                method: 'POST',
                body: newInfo,
            }),
        }),
        updateWhatsUpInfoById: builder.mutation({
            query: ({ id, ...updatedInfo }) => ({
                url: `whatsupInfo/${id}`,
                method: 'PUT',
                body: updatedInfo,
            }),
        }),
        deleteWhatsUpInfoById: builder.mutation({
            query: (id) => ({
                url: `whatsupInfo/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetWhatsUpInfoQuery,
    useGetWhatsUpInfoByIdQuery,
    useCreateWhatsUpInfoMutation,
    useUpdateWhatsUpInfoByIdMutation,
    useDeleteWhatsUpInfoByIdMutation,
>>>>>>> 6eaae5458c9d9da428bbbf6655b2150ac7ea833b
} = whatsUpInfoApi;