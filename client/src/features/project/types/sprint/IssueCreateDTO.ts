export interface IssueCreateDTO {
  id? : string;
  summary: string;
  description: string;
  issueType: 'Story' | 'Task';
  storyPoint: number;
  epic?: string | null;
  assignee?: string | null;
}
