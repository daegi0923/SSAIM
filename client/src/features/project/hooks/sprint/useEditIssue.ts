import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/apis/apiClient';
import config from '@/config/config';
import { IssueEditDTO } from '../../types/sprint/IssueEditDTO';

export const editIssue = async (projectId: number, requestBody: IssueEditDTO) => {
  const response = await apiClient.put(`${config.BASE_URL}/projects/${projectId}/issue`, requestBody);
  return response.data;
};

export const useEditIssue = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestBody: IssueEditDTO) => editIssue(projectId, requestBody),
    onSuccess: () => {
      // 'sprintIssues' 쿼리를 무효화하여 데이터 최신화
      queryClient.invalidateQueries({queryKey : ['sprintIssues', projectId]});
    },
  });
};
