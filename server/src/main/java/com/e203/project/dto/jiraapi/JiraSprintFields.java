package com.e203.project.dto.jiraapi;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class JiraSprintFields {
	private String summary;
	@JsonProperty("customfield_10031")
	private Double storyPoint;
	private JiraAssignee assignee = new JiraAssignee();
	@JsonProperty("customfield_10014")
	private String epicCode;
	private JiraStatus status;
	private Map<String, String> issuetype;
	private String description;
}
