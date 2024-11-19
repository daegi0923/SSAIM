package com.e203.project.dto.jiraapi;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class JiraTransitionsResponse {
	private String expand;
	private List<Transition> transitions;
}

