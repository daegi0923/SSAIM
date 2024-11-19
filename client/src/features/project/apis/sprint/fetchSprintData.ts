// src/feature/project/api/fetchWeeklyData.ts
import apiClient from '@/apis/apiClient';
import { SprintDTO } from '@features/project/types/SprintDTO';

export const fetchSprintData = async (projectId: number, sprintId:number): Promise<SprintDTO | null> => {
  console.log('fetch sprint data');
  try {
    const response = await apiClient.get<SprintDTO>(`/projects/${projectId}/sprint/${sprintId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return null; // 에러 발생 시 undefined를 반환
  }
};
