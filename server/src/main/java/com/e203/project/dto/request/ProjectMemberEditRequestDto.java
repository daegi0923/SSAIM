package com.e203.project.dto.request;

import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import com.e203.user.entity.User;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectMemberEditRequestDto {

    private Integer projectMemberId;

    private Integer userId;

    private Integer role;

    private boolean update;

    private boolean delete;

    public static ProjectMember toEntity(Project project, User user, ProjectMemberEditRequestDto dto) {
        return ProjectMember.builder()
                .project(project)
                .user(user)
                .role(dto.getRole() != null ? dto.getRole() : 0)
                .build();
    }
}
