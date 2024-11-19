package com.e203.project.dto.jiraapi;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Sprint {
	private int id;
	private String self;
	private String state;
	private String name;
	private String startDate;
	private String endDate;
	private String completeDate;
	private String createdDate;
	private int originBoardId;
	private String goal;
}
