package com.e203.project.dto.response;

import com.e203.project.entity.ProjectMember;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProjectMemberFindResponseDto {
    private int pmId;
    private int userId;
    private String name;
    private int role;
    private String profileImage;

    @Builder
    private ProjectMemberFindResponseDto(int pmId, int userId, String name, int role, String profileImage) {
        this.pmId = pmId;
        this.userId = userId;
        this.name = name;
        this.role = role;
        this.profileImage = profileImage;
    }

    public static ProjectMemberFindResponseDto fromEntity(ProjectMember member) {
        return ProjectMemberFindResponseDto.builder()
                .pmId(member.getId())
                .userId(member.getUser().getUserId())
                .name(member.getUser().getUserName())
                .profileImage(member.getUser().getUserProfileImage())
                .role(member.getRole())
                .build();
    }
}
