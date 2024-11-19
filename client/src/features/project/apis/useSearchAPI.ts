import apiClient from '../../../apis/apiClient';

export const userSearchAPI = async (input: string, searchBy: 'userName' | 'userEmail' | 'userNickname') => {
  try {
    console.log(`Searching by ${searchBy}: ${input}`);
    
    const response = await apiClient.get(`/users?${searchBy}=${input}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
