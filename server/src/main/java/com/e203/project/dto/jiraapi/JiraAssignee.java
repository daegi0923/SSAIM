package com.e203.project.dto.jiraapi;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JiraAssignee {
	private String self;
	private String accountId;
	private String displayName;
	private String emailAddress;
	private boolean active;

}