package com.e203.project.dto.response;

import com.e203.project.dto.jiraapi.JiraContent;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProjectJiraEpicResponseDto {
	private String key;
	private String summary;

	@Builder
	private ProjectJiraEpicResponseDto(String key, String summary) {
		this.key = key;
		this.summary = summary;
	}

	public static ProjectJiraEpicResponseDto transferDto(JiraContent jiraContent){
		return ProjectJiraEpicResponseDto.builder()
			.summary(jiraContent.getFields().getSummary() ==null ? "" : jiraContent.getFields().getSummary())
			.key(jiraContent.getKey())
			.build();
	}
}
