import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProjectEditMutationData } from '../types/ProjectDTO';
import { editProfileInfo } from '../apis/editProfileInfo';

export const useEditProjectInfoMutation = (projectId: number, userId: number | null) => {
  const queryClient = useQueryClient();

  return useMutation<string, Error, ProjectEditMutationData>({
    mutationFn: ({ projectEditData, profileImage }) => {
      return editProfileInfo(projectId, projectEditData, profileImage);
    },
    onSuccess: () => {
      // projectInfo와 projectListData 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['projectInfo', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projectListData', userId] });
    },
    onError: (error) => {
      console.error('프로젝트 정보 수정 중 오류:', error);
    },
  });
};
