import apiClient from '@/apis/apiClient';
import { IssueCreateDTO } from '../../types/sprint/IssueCreateDTO';
export const createIssue = (projectId: number, issueCreateData: IssueCreateDTO): Promise<string> => {
  return apiClient.post(`/projects/${projectId}/issue`, issueCreateData)
    .then(response => {
      console.log(response.data);
      return response.data;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
};
