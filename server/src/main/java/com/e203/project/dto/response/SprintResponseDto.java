package com.e203.project.dto.response;

import com.e203.project.dto.jiraapi.Sprint;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SprintResponseDto {
	@JsonProperty("id")
	private int sprintId;
	private String state;
	private String name;
	private String startDate;
	private String endDate;
	private String completeDate;
	private String createdDate;
	private String goal;

	@Builder
	private SprintResponseDto(int sprintId, String state, String name, String startDate, String endDate,
		String completeDate, String createdDate, String goal) {
		this.state = state;
		this.name = name;
		this.startDate = startDate;
		this.endDate = endDate;
		this.completeDate = completeDate;
		this.createdDate = createdDate;
		this.sprintId = sprintId;
		this.goal = goal;

	}

	public static SprintResponseDto transferDto(Sprint sprint) {
		return SprintResponseDto.builder()
			.sprintId(sprint.getId())
			.state(sprint.getState())
			.name(sprint.getName())
			.startDate(sprint.getStartDate())
			.endDate(sprint.getEndDate())
			.completeDate(sprint.getCompleteDate())
			.createdDate(sprint.getCreatedDate())
			.goal(sprint.getGoal())

			.build();
	}
}
