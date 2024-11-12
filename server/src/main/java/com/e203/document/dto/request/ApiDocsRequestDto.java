package com.e203.document.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ApiDocsRequestDto {
	private int projectId;
	private String content;

	@Builder
	private ApiDocsRequestDto(int projectId, String content) {
		this.projectId = projectId;
		this.content = content;
	}
}
