import { IssueDTO } from '../dashboard/WeeklyDataDTO';

export interface IssueEditDTO extends Omit<IssueDTO, 'allocator' | 'progress'> {
  assignee: string;
}
