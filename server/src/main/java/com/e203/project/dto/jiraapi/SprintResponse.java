package com.e203.project.dto.jiraapi;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SprintResponse {
	private int maxResults;
	private int startAt;
	private int total;
	private boolean isLast;
	private List<Sprint> values;
}
