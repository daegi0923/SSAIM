import { useQuery } from '@tanstack/react-query';
import { fetchGitlabData } from '../apis/fetchGitlabData';
import { ISOStringFormat } from 'date-fns';

export const useGitlabData = (projectId: number, startDate: ISOStringFormat|null, endDate: ISOStringFormat|null) => {
  return useQuery({
    queryKey: ['gitlabData', projectId, startDate, endDate],
    queryFn: async () => {
      if (!projectId || !startDate || !endDate) return [];
      return await fetchGitlabData(projectId, startDate, endDate);
    },
  });
};
