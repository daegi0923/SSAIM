import { IssueCreateDTO } from "./IssueCreateDTO";


export interface GenarateIssueRequestDTO {
  message: string;
  assignee: string;
  startDate: string;
  endDate: string;
}

export interface GenarateIssueResponseDTO {
  day : string;
  tasks: IssueCreateDTO[];
}

export interface GenerateIssueOnSprintRequestDTO {
  day : string;
  tasks : IssueCreateDTO[];
}
