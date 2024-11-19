package com.e203.project.dto.jiraapi;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JiraStatus {
	private String self;
	private String description;
	@JsonProperty("name")
	private String progress;
	private String id;

}