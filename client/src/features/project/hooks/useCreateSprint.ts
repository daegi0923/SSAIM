import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSprint } from '@/features/project/apis/sprint/createSprint';
import { SprintCreateDTO } from '@/features/project/types/SprintDTO';

export const useCreateSprint = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, SprintCreateDTO>({
    mutationFn: (sprintData: SprintCreateDTO) => createSprint(projectId, sprintData),
    onSuccess: () => {
      // 스프린트가 성공적으로 생성되었을 때 스프린트 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['sprintList', projectId] });
    },
    onError: (error) => {
      console.error('스프린트 생성 중 오류:', error);
    },
  });
};
