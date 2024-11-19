export interface DailyRemindPostDTO {
    dailyRemindContents: string;
    projectMemberId: number;
    dailyRemindDate: string; // ISO 형식의 날짜 문자열 (예: "2024-11-06")
}

export interface DailyRemindGetDTO {
    username: string;
    message: string;
    projectMemberId: number;
    projectId: number;
    dailyRemindId: number;
    userId: number;
    dailyRemindDate: string; // ISO 형식의 날짜 문자열 (예: "2024-11-04")
    userImage: string; // 사용자 이미지 (빈 문자열일 수 있음)
}

export interface DailyRemindPutDTO {
    dailyRemindContents: string;
    dailyRemindAuthor: number;
    dailyRemindId: number;
}
