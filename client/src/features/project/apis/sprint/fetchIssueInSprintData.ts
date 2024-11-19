// src/feature/project/api/fetchWeeklyData.ts
import apiClient from '@/apis/apiClient';
import { IssueDTO } from '../../types/dashboard/WeeklyDataDTO';

export const fetchIssueInSprintData = async (projectId: number, sprintId: number): Promise<IssueDTO[] | null> => {
  console.log(`fetch sprint issue data : 스프린트 ${sprintId}번 의 이슈 목록`);
  try {
    const response = await apiClient.get<IssueDTO[]>(`/projects/${projectId}/sprint/${sprintId}/issue`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return null; // 에러 발생 시 undefined를 반환
  }
};
