import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const logoApi = createApi({
    reducerPath: 'logoApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Logo'],
    endpoints: (builder) => ({
        // Get Logo
        getLogo: builder.query({
            query: () => ({
                url: '/companyLogo/get-logo',
                method: 'GET'
            }),
            providesTags: ['Logo'],
            transformResponse: (response) => response.data
        }),

        // Update Logo
        updateLogo: builder.mutation({
            query: (logoData) => ({
                url: '/companyLogo/update',
                method: 'PUT',
                body: logoData
            }),
            // Optimistically update the 'getLogo' cache after a successful update
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data: updateResult } = await queryFulfilled;
                    const updatedLogo = updateResult.data;
                    // Update the 'getLogo' query cache with the new data
                    dispatch(
                        logoApi.util.updateQueryData('getLogo', undefined, (draft) => {
                            Object.assign(draft, updatedLogo);
                        })
                    );
                } catch {
                    // The queryFulfilled promise will reject on an error, but we don't need to handle it here
                    // as the component's error handling will take over.
                }
            }
        }),

        // Delete Logo
        deleteLogo: builder.mutation({
            query: () => ({
                url: '/companyLogo/delete',
                method: 'DELETE'
            }),
            invalidatesTags: ['Logo']
        })
    })
});

// Export hooks for usage in components
export const {
    useGetLogoQuery,
    useUpdateLogoMutation,
    useDeleteLogoMutation
} = logoApi;

// Export api for store configuration
export default logoApi;
