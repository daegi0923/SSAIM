package com.e203.project.dto.response;

import com.e203.project.entity.Project;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor
public class ProjectFindResponseDto {
    private int id;
    private String name;
    private String title;
    private String projectImage;
    private LocalDate startDate;
    private LocalDate endDate;
    private String jiraApi;
    private String jiraId;
    private String jiraBoardId;
    private String gitlabApi;
    private String gitlabId;
    private Integer progressFront;
    private Integer progressBack;
    private List<ProjectMemberFindResponseDto> projectMembers;

    @Builder
    private ProjectFindResponseDto(int id, String name, String title, String projectImage, LocalDate startDate,
                                   LocalDate endDate, String jiraApi, String jiraId, String jiraBoardId,
                                   String gitlabApi, String gitlabId, Integer progressFront, Integer progressBack,
                                   List<ProjectMemberFindResponseDto> projectMembers) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.projectImage = projectImage;
        this.startDate = startDate;
        this.endDate = endDate;
        this.jiraApi = jiraApi;
        this.jiraId = jiraId;
        this.jiraBoardId = jiraBoardId;
        this.gitlabApi = gitlabApi;
        this.gitlabId = gitlabId;
        this.progressFront = progressFront;
        this.progressBack = progressBack;
        this.projectMembers = projectMembers;
    }

    public static ProjectFindResponseDto fromEntity(Project project, Integer progressFront, Integer progressBack, List<ProjectMemberFindResponseDto> members) {
        return ProjectFindResponseDto.builder()
                .id(project.getId())
                .name(project.getName())
                .title(project.getTitle())
                .projectImage(project.getProfileImage())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .jiraApi(project.getJiraApi())
                .jiraId(project.getJiraProjectId())
                .jiraBoardId(project.getJiraBoardId())
                .gitlabApi(project.getGitlabApi())
                .gitlabId(project.getGitlabProjectId())
                .progressFront(progressFront)
                .progressBack(progressBack)
                .projectMembers(members)
                .build();
    }
}


