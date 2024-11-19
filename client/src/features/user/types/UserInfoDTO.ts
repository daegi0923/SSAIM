export interface BaseUserDTO {
  userEmail: string;
  userName: string;
  userPw: string;
  userClass: number;
  userCampus: number;
  userGeneration: number;
  userNickname: string;
  userBirth: string;
  userGender: number;
  userPhone: string;
}

export interface UserInfoDTO extends BaseUserDTO {
  userId: number;
  userProfileMessage: string|null;
  userSkills: string|null;
  userRole: number;
  userProfileImage: string;
}

export interface UserInfoEditDTO{
  userEmail?: string;
  userName?: string;
  userNickname?: string;
  userPhone?: string;
  userGender?: number;
  userGeneration?: number;
  userClass?: number;
  userCampus?: number;
  userBirth?: string;
  userProfileMessage?: string;
  userSkills?: string;
  userRole?: number;
  userProfileImage?: string;
}
