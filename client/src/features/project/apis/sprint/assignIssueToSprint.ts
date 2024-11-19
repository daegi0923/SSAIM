import apiClient from '@/apis/apiClient';

export const assignIssueToSprint = (projectId: number, sprintId: number, issueKeyList: string[]): Promise<string> => {
  return apiClient
    .put(`/projects/${projectId}/sprint/${sprintId}`, issueKeyList)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
