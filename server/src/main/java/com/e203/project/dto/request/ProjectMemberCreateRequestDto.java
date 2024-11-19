package com.e203.project.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProjectMemberCreateRequestDto {
	private int id;
	private int role;

	@Builder
	private ProjectMemberCreateRequestDto(int id, int role) {
		this.id = id;
		this.role = role;
	}

}
