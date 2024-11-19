package com.e203.project.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProjectGitlabConnectDto {
	String gitlabApi;
	String gitlabProjectId;

	@Builder
	private void ProjectJiraConnectDto(String gitlabApi, String gitlabProjectId) {
		this.gitlabApi = gitlabApi;
		this.gitlabProjectId = gitlabProjectId;
	}
}
