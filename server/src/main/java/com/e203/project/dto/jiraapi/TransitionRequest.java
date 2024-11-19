package com.e203.project.dto.jiraapi;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TransitionRequest {
	private Map<String, String> transition;

	public TransitionRequest(String id) {
		transition = new HashMap<String, String>();
		transition.put("id", id);
	}
}
