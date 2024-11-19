// src/feature/project/api/fetchWeeklyData.ts
import apiClient from '@/apis/apiClient'

export const fetchProjectListData = async (userId: number|null) => {
  console.log('fetch project list data')
  try {
    console.log(userId)
    const response = await apiClient.get(`/user/${userId}/projects`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
