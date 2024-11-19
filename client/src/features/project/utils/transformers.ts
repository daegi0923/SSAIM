// feature/project/utils/transformers.ts

import { TeamMemberDTO } from '../types/TeamMemberDTO';
import { ProjectMemberDTO } from '../types/ProjectDTO';

export function transformToProjectMember(teamMember: TeamMemberDTO): ProjectMemberDTO {
  return {
    id: teamMember.userId,
    role: 0, // 필요에 따라 설정
    profileImage: teamMember.userProfileImage || null,
  };
}
