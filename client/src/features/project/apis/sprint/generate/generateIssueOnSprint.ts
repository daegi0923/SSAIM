// src/feature/project/api/fetchWeeklyData.ts
import apiClient from '@/apis/apiClient';
import { GenerateIssueOnSprintRequestDTO } from '@/features/project/types/sprint/GenDTO';

export const generateIssueOnSprint = async (
  projectId: number,
  sprintId: number,
  request: GenerateIssueOnSprintRequestDTO[]
): Promise<string | undefined | Error> => {
  try {
    const response = await apiClient.post<string>(`/projects/${projectId}/sprint/${sprintId}`, request);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error assign issue on sprint:', error);
    throw error; // 에러 발생 시 undefined를 반환
  }
};
