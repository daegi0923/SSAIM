package com.e203.project.dto.jiraapi;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class IssueContent {
	private String type;
	private List<Map<String, String>> content = new ArrayList<>(); // content를 Map으로 변경

	@Builder
	private IssueContent(String type, List<Map<String, String>> content) {
		this.type  ="paragraph";
		this.content =content;
	}

	public IssueContent(String type, String content) {
		Map<String, String> map = new HashMap<>();
		this.type = "paragraph";
		map.put("text", content);
		map.put("type", type);
		this.content.add(map);
	}
}
