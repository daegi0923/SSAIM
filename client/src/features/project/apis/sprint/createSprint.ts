import apiClient from '@/apis/apiClient';
import { SprintCreateDTO } from '@features/project/types/SprintDTO';

export const createSprint = (projectId: number, sprintData: SprintCreateDTO): Promise<string> => {
  return apiClient.post(`/projects/${projectId}/sprint`, sprintData)
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
};
