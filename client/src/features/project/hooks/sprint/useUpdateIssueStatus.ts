import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateIssueStatus } from '../../apis/sprint/updateIssueStatus';

export const useUpdateIssueStatus = (projectId: number, issueKey: string) => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, 'todo' | 'inProgress' | 'done'>({
    mutationFn: (status: 'todo' | 'inProgress' | 'done') => updateIssueStatus(projectId, issueKey, status),
    onSuccess: () => {
      // 'sprintIssues' 쿼리를 무효화하여 데이터 최신화
      queryClient.invalidateQueries({ queryKey: ['sprintIssues', projectId] });
    },
    onError: (error) => {
      console.error('이슈 상태 변경 오류:', error); // 에러 처리
    },
  });
};
