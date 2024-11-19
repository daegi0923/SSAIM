import { useQuery } from '@tanstack/react-query';
import { fetchIssueInSprintData } from '../../apis/sprint/fetchIssueInSprintData';
import { IssueDTO } from '../../types/dashboard/WeeklyDataDTO';

export const useIssueInSprintQuery = (projectId: number, sprintId: number) => {
  return useQuery<IssueDTO[]|null, Error>({
    queryKey: ['issueInSprint', projectId, sprintId],
    queryFn: async () => {
      if (!projectId || !sprintId) return null;
      const data = await fetchIssueInSprintData(projectId, sprintId);
      return data || null;
    },
  });
};
