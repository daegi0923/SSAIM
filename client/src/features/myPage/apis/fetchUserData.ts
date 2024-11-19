// src/feature/project/api/fetchWeeklyData.ts
import apiClient from '@/apis/apiClient'
import config from '../../../config/config';

export const fetchUserData = async (userId: number) => {
  console.log('fetch user info data')
  try {
    const response = await apiClient.get(`${config.BASE_URL}/users/${userId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
