import { useQuery } from '@tanstack/react-query';
import { fetchSprintData } from '../../apis/sprint/fetchSprintData';
import { SprintDTO } from '@features/project/types/SprintDTO';

export const useSprintQuery = (projectId: number, sprintId: number) => {
  return useQuery<SprintDTO|null, Error>({
    queryKey: ['sprint', projectId, sprintId],
    queryFn: async () => {
      if (!projectId || !sprintId) return null;
      const data = await fetchSprintData(projectId, sprintId);
      return data || null;
    },
  });
};
