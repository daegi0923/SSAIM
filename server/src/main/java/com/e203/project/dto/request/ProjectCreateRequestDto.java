package com.e203.project.dto.request;

import com.e203.project.entity.Project;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;

@Getter
@NoArgsConstructor
public class ProjectCreateRequestDto {
	private String title;
	private String name;
	private LocalDate startDate;
	private LocalDate endDate;
	private ArrayList<ProjectMemberCreateRequestDto> teamMembers ;

	@Builder
	private ProjectCreateRequestDto(String title, String name, LocalDate startDate, LocalDate endDate, ArrayList<ProjectMemberCreateRequestDto> teamMembers) {
		this.title = title;
		this.name = name;
		this.startDate = startDate;
		this.endDate = endDate;
		this.teamMembers = teamMembers;
	}

	public Project toEntity(){
		return Project.builder()
			.title(this.title)
			.name(this.name)
			.startDate(this.startDate)
			.endDate(this.endDate)
			.build();
	}

}
