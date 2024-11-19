package com.e203.project.dto.jiraapi;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class JiraEpicRequest {
	private String summary;
	private IssueDescription description;

	@Builder
	public JiraEpicRequest(String summary, IssueDescription description) {
		this.summary = summary;
		this.description = description;
	}
}
