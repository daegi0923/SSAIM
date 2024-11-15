package com.e203.project.dto.jiraapi;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JiraSprintFindIssue {
	private int maxResults;
	private int total;
	private List<JiraSprintFindIssueRequest> issues;
}
