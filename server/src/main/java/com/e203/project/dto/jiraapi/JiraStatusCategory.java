package com.e203.project.dto.jiraapi;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class JiraStatusCategory {
	private String self;
	private int id;
	private String key;
	private String colorName;
	private String name;
}