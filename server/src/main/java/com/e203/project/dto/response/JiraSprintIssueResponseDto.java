package com.e203.project.dto.response;

import com.e203.project.dto.jiraapi.JiraSprintFields;
import com.e203.project.dto.jiraapi.JiraSprintFindIssueRequest;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class JiraSprintIssueResponseDto {
	private String summary;
	private String epicCode;
	private String progress;
	private String description;
	private double storyPoint;
	private String allocator;
	private String issueKey;
	private String issueType;

	@Builder
	private JiraSprintIssueResponseDto(String issueKey, String summary, String epicCode, String progress,
		double storyPoint,
		String allocator, String issueType, String description) {
		this.issueKey = issueKey;
		this.summary = summary;
		this.epicCode = epicCode;
		this.progress = progress;
		this.storyPoint = storyPoint;
		this.allocator = allocator;
		this.issueType = issueType;
		this.description = description;
	}

	public static JiraSprintIssueResponseDto transferDto(JiraSprintFindIssueRequest jiraContent) {
		return JiraSprintIssueResponseDto.builder()
			.summary(jiraContent.getFields().getSummary())
			.epicCode(jiraContent.getFields().getEpicCode())
			.progress(jiraContent.getFields().getStatus().getProgress())
			.storyPoint(jiraContent.getFields().getStoryPoint() == null ? 0 : jiraContent.getFields().getStoryPoint())
			.allocator("할당되지 않음")
			.issueKey(jiraContent.getKey())
			.issueType(jiraContent.getFields().getIssuetype().get("name"))
			.description(jiraContent.getFields().getDescription() == null ? null :
				jiraContent.getFields().getDescription())
			.build();

	}
}
