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
    private String gitlabUrl;
    private String jiraUrl;
    private String figmaUrl;
    private String notionUrl;
    private Integer progressFront;
    private Integer progressBack;
    private List<ProjectMemberFindResponseDto> projectMembers;


    @Builder
    public ProjectFindResponseDto(int id, String name, String title, String projectImage, LocalDate startDate,
                                  LocalDate endDate, String jiraApi, String jiraId, String jiraBoardId, String gitlabApi,
                                  String gitlabId, String gitlabUrl, String jiraUrl, String figmaUrl, String notionUrl,
                                  Integer progressFront, Integer progressBack,
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
        this.gitlabUrl = gitlabUrl;
        this.jiraUrl = jiraUrl;
        this.figmaUrl = figmaUrl;
        this.notionUrl = notionUrl;
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
                .gitlabUrl(project.getGitlabUrl())
                .jiraUrl(project.getJiraUrl())
                .figmaUrl(project.getFigmaUrl())
                .notionUrl(project.getNotionUrl())
                .progressFront(progressFront)
                .progressBack(progressBack)
                .projectMembers(members)
                .build();
    }
}


