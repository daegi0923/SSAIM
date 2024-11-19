import { useQuery } from '@tanstack/react-query';
import { fetchProjectInfoData } from '../apis/fetchProjectInfoData';
import { ProjectDTO } from '../types/ProjectDTO';

export const useProjectInfo = (projectId: number | null | undefined) => {
  return useQuery<ProjectDTO, Error>({
    queryKey: ['projectInfo', projectId],
    queryFn: async () => {
      console.log(projectId, 'queryFn');
      return await fetchProjectInfoData(projectId!);
    },
    enabled: projectId !== null, // projectId가 null인 경우 쿼리를 실행하지 않음
  });
};
