export interface SprintCreateDTO {
  name: string;
  startDate: Date;
  endDate: Date;
  goals: string;
}

export interface SprintDTO extends SprintCreateDTO {
  id: number;
  state: 'active' | 'closed' | 'future';
  completeDate: Date;
  createdDate: Date;
  name: string;
  startDate: Date;
  endDate: Date;
  goal: string;
}
