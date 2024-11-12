package com.e203.project.dto.response;

import com.e203.project.entity.Project;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
public class ProjectFindResponseDto {
    private int id;
    private String name;
    private String title;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String jiraApi;
    private String gitlabApi;
    private Integer progressFront;
    private Integer progressBack;
    private List<ProjectMemberFindResponseDto> projectMemberFindResponseDtoList;

    @Builder
    private ProjectFindResponseDto(int id, String name, String title, LocalDateTime startDate, LocalDateTime endDate,
                                   String jiraApi, String gitlabApi, List<ProjectMemberFindResponseDto> projectMembers,
                                   Integer progressFront, Integer progressBack) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.jiraApi = jiraApi;
        this.gitlabApi = gitlabApi;
        this.progressFront = progressFront;
        this.progressBack = progressBack;
        this.projectMemberFindResponseDtoList = projectMembers;
    }

    public static ProjectFindResponseDto fromEntity(Project project, Integer progressFront, Integer progressBack, List<ProjectMemberFindResponseDto> members) {
        return ProjectFindResponseDto.builder()
                .id(project.getId())
                .name(project.getName())
                .title(project.getTitle())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .jiraApi(project.getJiraApi())
                .gitlabApi(project.getGitlabApi())
                .progressFront(progressFront)
                .progressBack(progressBack)
                .projectMembers(members)
                .build();
    }
}


