package com.e203.project.dto.jiraapi;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JiraContent {
	private String id;
	private String self;
	private String key;
	private JiraFields fields;

}