package com.e203.project.dto.jiraapi;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class JiraIssuePutField {
	private String summary;
	@JsonProperty("customfield_10031")
	private int storyPoint;
	private IssueDescription description;
}
