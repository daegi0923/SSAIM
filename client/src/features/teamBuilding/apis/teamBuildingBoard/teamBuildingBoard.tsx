import apiClient from '../../../../apis/apiClient';

export const getTeamBuildingList = async (params = {}) => {
    try {
        const response = await apiClient.get('/recruiting/posts', { params });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getApplications = async (userId: number) => {
    try {
        const response = await apiClient.get(`/users/${userId}/applications`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};