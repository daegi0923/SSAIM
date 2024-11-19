// src/feature/project/api/fetchWeeklyData.ts
import apiClient from '@/apis/apiClient';
import { EpicDTO } from '../../types/sprint/EpicDTO';

export const fetchEpicList = async (projectId: number): Promise<EpicDTO[] | undefined> => {
  console.log('fetch epic list');
  try {
    const response = await apiClient.get<EpicDTO[]>(`/projects/${projectId}/epics`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return undefined; // 에러 발생 시 undefined를 반환
  }
};
