import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignIssueToSprint } from '../../apis/sprint/assignIssueToSprint';
export const useCreateIssueMutation = (projectId: number, sprintId:number) => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, string[]>({
    mutationFn: (issueKeyList:string[]) => assignIssueToSprint(projectId,sprintId, issueKeyList),
    onSuccess: () => {
      // 스프린트가 성공적으로 생성되었을 때 스프린트 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['sprintList', projectId] });
    },
    onError: (error) => {
      console.error('스프린트 생성 중 오류:', error);
    },
  });
};
