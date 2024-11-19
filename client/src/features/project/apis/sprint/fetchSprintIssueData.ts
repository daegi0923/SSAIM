// src/feature/project/api/fetchWeeklyData.ts
import apiClient from '@/apis/apiClient';

// 이슈데이터 날짜로 조회하는 함수
export const fetchSprintIssueData = async (projectId: number, startDate: string, endDate: string) => {
  console.log('fetch sprint issue data');
  try {
    const response = await apiClient.get(`/projects/${projectId}/issue?startDate=${startDate}&endDate=${endDate}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
