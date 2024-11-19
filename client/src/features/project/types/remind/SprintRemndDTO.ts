export interface SprintRemindRequestDTO {
    projectMemberId: number;
    startDate: string; 
    endDate: string; 
}

export interface SprintRemindGetDTO {
    username: string;
    content: string;
    projectMemberId: number;
    projectId: number;
    weeklyRemindId: number;
    userId: number;
    startDate: string; // ISO 형식의 날짜 문자열 (예: "2024-11-04")
    endDate: string; // ISO 형식의 날짜 문자열 (예: "2024-11-04")
    userImage: string; // 사용자 이미지 (빈 문자열일 수 있음)
}

