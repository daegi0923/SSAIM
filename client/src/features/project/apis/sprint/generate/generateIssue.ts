// src/feature/project/api/fetchWeeklyData.ts
import apiClient from '@/apis/apiClient';
import { GenarateIssueRequestDTO, GenarateIssueResponseDTO } from '@features/project/types/sprint/GenDTO';

export const generateIssue = async (
  projectId: number,
  request: GenarateIssueRequestDTO
): Promise<GenarateIssueResponseDTO[] | undefined | Error> => {
  console.log('fetch epic list');
  try {
    const response = await apiClient.post<GenarateIssueResponseDTO[]>(`/projects/${projectId}/issue/generate`, request);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating issue:', error);
    throw error; // 에러 발생 시 undefined를 반환
  }
};
