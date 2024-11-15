package com.e203.project.entity;

import com.e203.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "project")
public class Project extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    @Setter
    private int id;

    @Column(name = "project_title")
    @Setter
    private String title;

    @Column(name = "project_name")
    @Setter
    private String name;

    @Column(name = "project_profile_image")
    @Setter
    private String profileImage;

    @Column(name = "project_start_date")
    @Setter
    private LocalDate startDate;

    @Column(name = "project_end_date")
    @Setter
    private LocalDate endDate;

    @Column(name = "project_gitlab_api")
    @Setter
    private String gitlabApi;

    @Column(name = "project_gitlab_id")
    @Setter
    private String gitlabProjectId;

    @Column(name = "project_jira_api")
    @Setter
    private String jiraApi;

    @Column(name = "project_jira_id")
    @Setter
    private String jiraProjectId;

    @Column(name = "project_jira_board_id")
    @Setter
    private String jiraBoardId;

    @Column(name = "project_gitlab_url")
    @Setter
    private String gitlabUrl;

    @Column(name = "project_jira_url")
    @Setter
    private String jiraUrl;

    @Column(name = "project_figma_url")
    @Setter
    private String figmaUrl;

    @Column(name = "project_sheet_url")
    @Setter
    private String sheetUrl;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProjectMember> projectMembers;

    @Builder
    private Project(String title, String name, String profileImage, LocalDate startDate, LocalDate endDate, String gitlabApi, String jiraApi,
                    Double progressBack, Double progressFront) {
        this.title = title;
        this.name = name;
        this.profileImage = profileImage;
        this.startDate = startDate;
        this.endDate = endDate;
        this.gitlabApi = gitlabApi;
        this.jiraApi = jiraApi;
    }
}
