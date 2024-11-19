package com.e203.project.dto.jiraapi;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class IssueDescription {
	private String type = "doc";
	private int version = 1;
	private List<IssueContent> content;

	@Builder
	public IssueDescription(String type, int version, List<IssueContent> content) {
		this.type = "doc";
		this.version = 1 ;
		this.content = content;
	}
}
