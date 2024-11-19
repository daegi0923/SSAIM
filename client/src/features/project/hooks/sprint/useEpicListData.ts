import { useQuery } from '@tanstack/react-query';
import { fetchEpicList } from '@features/project/apis/sprint/fetchEpicList';
import { EpicDTO } from '../../types/sprint/EpicDTO';

export const useEpicListData = (projectId: number | null) => {
  return useQuery<EpicDTO[], Error>({
    queryKey: ['epicList', projectId],
    queryFn: async () => {
      if (projectId === null) return []; // projectId가 null인 경우 빈 배열 반환
      const data = await fetchEpicList(projectId);
      return data || []; // undefined일 경우 빈 배열을 반환
    },
    enabled: projectId !== null, // projectId가 있을 때만 쿼리 실행
  });
};
