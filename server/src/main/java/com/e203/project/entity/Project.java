package com.e203.project.entity;

import com.e203.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="project")
public class Project extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "project_id")
	private int id;

	@Column(name = "project_title")
	private String title;

	@Column(name = "project_name")
	private String name;

	@Setter
	@Column(name = "project_profile_image")
	private String profileImage;

	@Column(name = "project_start_date")
	private LocalDateTime startDate;

	@Column(name = "project_end_date")
	private LocalDateTime endDate;

	@Column(name = "project_gitlab_api")
	@Setter
	private String gitlabApi ;

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

	@Column(name = "project_progress_front")
	@Setter
	private Double progressFront =0.0; //이거 왜 안 먹히지 ?

	@Column(name = "project_progress_back")
	@Setter
	private Double progressBack = 0.0;

	@OneToMany(mappedBy = "project")
	private List<ProjectMember> projectMemberList = new ArrayList<>();

	@Builder
	private Project(String title, String name, String profileImage, LocalDateTime startDate, LocalDateTime endDate, String gitlabApi, String jiraApi,
		Double progressBack, Double progressFront){
		this.title = title;
		this.name= name;
		this.profileImage = profileImage;
		this.startDate =startDate;
		this.endDate = endDate;
		this.gitlabApi = gitlabApi;
		this.jiraApi = jiraApi;
		this.progressFront = progressFront;
		this.progressBack = progressBack;
	}
}
