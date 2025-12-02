import type {
    SearchApiResponse,
    SearchRequest
} from 'types/search.type';
import axiosInstance from './axiosInstance';

// Search API functions

// Perform dynamic search
export const dynamicSearch = async (params: SearchRequest): Promise<SearchApiResponse> => {
    console.log('🔍 Performing dynamic search:', params);
    const searchParams = new URLSearchParams();
    searchParams.append('search', params.search);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await axiosInstance.get(`/search/dynamic?${searchParams.toString()}`);
    return response.data;
};



// Export all functions
const searchApi = {
    dynamicSearch,
};

export default searchApi;
