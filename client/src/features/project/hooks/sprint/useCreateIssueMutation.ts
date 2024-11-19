import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createIssue } from '../../apis/sprint/createIssue';
import { IssueCreateDTO } from '../../types/sprint/IssueCreateDTO';

export const useCreateIssueMutation = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, IssueCreateDTO>({
    mutationFn: (issueCreateData: IssueCreateDTO) => createIssue(projectId, issueCreateData),
    onSuccess: () => {
      // 스프린트가 성공적으로 생성되었을 때 스프린트 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['sprintList', projectId] });
    },
    onError: (error) => {
      console.error('스프린트 할당 중 오류:', error);
    },
  });
};
