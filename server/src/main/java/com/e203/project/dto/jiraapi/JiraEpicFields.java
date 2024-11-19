package com.e203.project.dto.jiraapi;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.e203.project.dto.request.JiraIssueRequestDto;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class JiraEpicFields {
	@JsonProperty("fields")
	private JiraEpicRequest jiraEpicRequest;

	private JiraEpicFields(JiraEpicRequest jiraEpicRequest){
		this.jiraEpicRequest = jiraEpicRequest;
	}

	public static JiraEpicFields createJiraEpic(JiraIssueRequestDto epicDto){
		Map<String, String> content = new HashMap<String, String>();
		content.put("text", epicDto.getDescription());
		content.put("type", "text");
		IssueContent epicContent = IssueContent.builder()
			.content(List.of(content))
			.build();
		IssueDescription epicDescription = IssueDescription.builder()
			.content(List.of(epicContent))
			.build();

		JiraEpicRequest epic = JiraEpicRequest.builder()
			.summary(epicDto.getSummary())
			.description(epicDescription)
			.build();

		return new JiraEpicFields(epic);
	}
}
