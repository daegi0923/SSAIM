package com.e203.project.dto.jiraapi;

import java.util.List;

import com.e203.project.dto.request.IssuePutRequest;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JiraIssuePut {

	@JsonProperty("fields")
	private JiraIssuePutField fields;

	static public JiraIssuePut createPutRequest(IssuePutRequest request) {
		;
		JiraIssuePutField fields = new JiraIssuePutField();

		IssueContent issueContent = new IssueContent("text", request.getDescription());
		IssueDescription issueDescription = new IssueDescription();
		issueDescription.setContent(List.of(issueContent));

		fields.setSummary(request.getSummary());
		fields.setStoryPoint(request.getStoryPoint());
		fields.setDescription(issueDescription);


		return JiraIssuePut.builder().fields(fields).build();
	}

	@Builder
	private JiraIssuePut(JiraIssuePutField fields) {
		this.fields = fields;
	}
}
