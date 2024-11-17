package com.e203.project.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
public class IssuePutRequest {
	private String issueKey;
	@Setter
	private String summary;
	private String description;
	private int storyPoint;

	@Builder
	private IssuePutRequest(String issueKey, String summary, String description, int storyPoint) {
		this.issueKey = issueKey;
		this.summary = summary;
		this.description = description;
		this.storyPoint = storyPoint;
	}
}
