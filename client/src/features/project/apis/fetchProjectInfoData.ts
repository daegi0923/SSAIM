// src/feature/project/api/fetchWeeklyData.ts
import apiClient from '@/apis/apiClient'

export const fetchProjectInfoData = async (projectId: number) => {
  console.log('fetch project info data')
  try {
    const response = await apiClient.get(`/projects/${projectId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
