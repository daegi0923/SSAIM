package com.e203.project.dto.jiraapi;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JiraCreateIssue {
	private Fields fields;

	@Getter
	@Setter
	public static class Fields {
		private Project project;
		private String summary;
		private IssueType issuetype;
		private Assignee assignee;

		@JsonProperty("customfield_10031")
		private Integer storyPoint;
		private Parent parent;
		private String description;

	}

	@Getter
	@Setter
	@AllArgsConstructor
	public static class Project {
		private String key;
	}

	@Getter
	@Setter
	@AllArgsConstructor
	public static class IssueType {
		private String name;
	}

	@Getter
	@Setter
	@AllArgsConstructor
	public static class Assignee {
		private String id;
	}

	@Getter
	@Setter
	@AllArgsConstructor
	public static class Parent {
		private String key;
	}
}

