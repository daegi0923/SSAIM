package com.e203.project.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProjectJiraConnectDto {

	@NotBlank
	private String jiraApi;
	@NotBlank
	private String jiraProjectId;
	@NotBlank
	private String jiraBoardId;

	@Builder
	private ProjectJiraConnectDto(String jiraApi, String jiraProjectId, String jiraBoardId) {
		this.jiraApi = jiraApi;
		this.jiraProjectId = jiraProjectId;
		this.jiraBoardId = jiraBoardId;
	}
}
