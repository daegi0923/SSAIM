package com.e203.project.dto.jiraapi;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class JiraAccount {
	private String self;
	private String accountId;
	private String accountType;
	private String emailAddress;
	private Map<String, String> avatarUrls;
	private String displayName;
	private boolean active;
	private String timeZone;
	private String locale;
}