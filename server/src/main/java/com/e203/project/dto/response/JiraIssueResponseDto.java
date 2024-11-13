package com.e203.project.dto.response;

import com.e203.project.dto.jiraapi.JiraContent;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class JiraIssueResponseDto {
	private String summary;
	private String epicCode;
	private String progress;
	private String description;
	private double storyPoint;
	private String allocator;
	private String issueKey;
	private String issueType;

	@Builder
	private JiraIssueResponseDto(String issueKey, String summary, String epicCode, String progress, double storyPoint,
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

	public static JiraIssueResponseDto transferDto(JiraContent jiraContent) {
		return JiraIssueResponseDto.builder()
			.summary(jiraContent.getFields().getSummary())
			.epicCode(jiraContent.getFields().getEpicCode())
			.progress(jiraContent.getFields().getStatus().getProgress())
			.storyPoint(jiraContent.getFields().getStoryPoint() == null ? 0 : jiraContent.getFields().getStoryPoint())
			.allocator(
				jiraContent.getFields().getAssignee() == null ? "할당되지 않음" :
					jiraContent.getFields().getAssignee().getDisplayName())
			.issueKey(jiraContent.getKey())
			.issueType(jiraContent.getFields().getIssuetype().get("name"))
			.description(jiraContent.getFields().getDescription().getContent().get(0).getContent().get(0).get("text"))
			.build();

	}
}
