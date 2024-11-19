import { useQuery } from '@tanstack/react-query';
import { fetchSprintIssueData } from '../apis/sprint/fetchSprintIssueData';
import { IssueDTO } from '../types/dashboard/WeeklyDataDTO';

export const useSprintIssueQuery = (projectId: number, startDate: string | null, endDate: string | null) => {
  return useQuery<IssueDTO[], Error>({
    queryKey: ['sprintIssues', projectId, startDate, endDate],
    queryFn: async () => {
      if (!projectId || !startDate || !endDate) return [];
      return await fetchSprintIssueData(projectId, startDate, endDate);
    },
  });
};
