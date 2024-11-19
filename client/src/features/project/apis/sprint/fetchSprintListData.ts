// src/feature/project/api/fetchWeeklyData.ts
import apiClient from '@/apis/apiClient';

export const fetchSprintListData = async (projectId: number) => {
  console.log('fetch sprint list data');
  try {
    const response = await apiClient.get(`/projects/${projectId}/sprint`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
