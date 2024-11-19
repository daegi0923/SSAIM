export interface WeeklyRemind {
    weeklyRemindId: number;
    content: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
  }
  
export interface DevelopStoryDTO {
    projectMemberId: number;
    projectId: number;
    username: string;
    userImage: string | null;
    userId: number;
    projectName: string;
    projectStartDate: string;
    projectEndDate: string;
    weeklyRemind: WeeklyRemind[];
  }