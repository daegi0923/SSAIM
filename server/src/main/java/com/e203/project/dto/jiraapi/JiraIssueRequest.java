package com.e203.project.dto.jiraapi;

import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class JiraIssueRequest {
	private Map<String, String> project;
	private String summary;
	private IssueDescription description;
	@JsonProperty("issuetype")
	private Map<String, String> issueType;
	private Map<String, String> assignee;
	@JsonProperty("customfield_10014")
	private String epicKey; // 에픽
	@JsonProperty("customfield_10031")
	private int storyPoint; // 스토리 포인트

}
