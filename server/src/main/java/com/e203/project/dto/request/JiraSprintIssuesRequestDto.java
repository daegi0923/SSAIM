package com.e203.project.dto.request;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class JiraSprintIssuesRequestDto {

	private List<String> issues;

	public JiraSprintIssuesRequestDto(List<String> issues) {
		this.issues = issues;
	}
}
