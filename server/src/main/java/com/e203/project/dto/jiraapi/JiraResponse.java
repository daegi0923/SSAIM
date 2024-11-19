package com.e203.project.dto.jiraapi;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class JiraResponse {
	private int maxResults;
	private int total;
	private List<JiraContent> issues;
}