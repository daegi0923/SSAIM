import { useQuery } from '@tanstack/react-query';
import { fetchProjectListData } from '../apis/fetchProjectListData';
import useProjectStore from '@features/project/stores/useProjectStore';
import { ProjectDTO } from '../types/ProjectDTO';

export const useProjectListData = (userId: number | null) => {
  const setProjectList = useProjectStore((state) => state.setProjectList);

  return useQuery<ProjectDTO[], Error>({
    queryKey: ['projectListData', userId], // queryKey는 배열로 설정
    queryFn: async () => {
      if (userId === null) return []; // userId가 null인 경우 빈 배열 반환
      const data = await fetchProjectListData(userId);
      setProjectList(data);
      return data;
    },
  });
};
