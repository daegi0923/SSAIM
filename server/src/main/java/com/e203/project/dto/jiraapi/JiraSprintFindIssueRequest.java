package com.e203.project.dto.jiraapi;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JiraSprintFindIssueRequest {
	private String id;
	private String self;
	private String key;
	private JiraSprintFields fields;

	@Builder
	private JiraSprintFindIssueRequest(String id, String self, String key, JiraSprintFields fields) {
		this.id = id;
		this.self = self;
		this.key = key;
		this.fields = fields;
	}
}
