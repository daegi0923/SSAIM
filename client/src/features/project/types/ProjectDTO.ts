// src/features/project/types/ProjectDTO.ts

export interface ProjectMemberDTO {
  id: number;
  role: 0 | 1;
  // userName: string;
  profileImage: string | null;
}
export interface ProjectInfoMemberDTO {
  pmId: number;
  userId: number;
  name: string;
  role: 0 | 1;
  profileImage: string;
}
export interface ProjectEditMemberDTO {
  projectMemberId?: number;
  userId?: number;
  role?: 0 | 1;
  update: boolean;
  delete?: boolean;
}
// 공통 프로젝트 속성 인터페이스 정의
interface BaseProjectDTO {
  title: string;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
}
export interface ProjectEditDTO extends Partial<BaseProjectDTO> {
  projectMembers?: Partial<ProjectEditMemberDTO>[]; // 내부 필드도 선택적으로 사용
  jiraUrl: string | null;
  gitlabUrl: string | null;
  notionUrl: string | null;
  figmaUrl: string | null;
}

// ProjectCreateDTO에서 공통 속성 상속
export interface ProjectCreateDTO extends BaseProjectDTO {
  teamMembers: ProjectMemberDTO[] | null;
}

// ProjectDTO에서 공통 속성 상속 및 고유 필드 추가
export interface ProjectDTO extends BaseProjectDTO {
  id: number;
  progressFront: number;
  progressBack: number;
  projectImage: string | null;
  // teamMembers 배열이 항상 null이 아닌 경우 타입에서 | null 제거 가능
  projectMembers: ProjectInfoMemberDTO[] | [];
  jiraApi: string | null;
  gitlabApi: string | null;
  jiraBoardId: string | null;
  jiraId: string | null;
  gitlabId: string | null;
  jiraUrl: string | null;
  gitlabUrl: string | null;
  notionUrl: string | null;
  figmaUrl: string | null;

}
export interface ProjectEditMutationData {
  projectEditData: ProjectEditDTO;
  profileImage?: File; // 선택적 필드로 설정
}
