package com.e203.webhook;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import static org.springframework.http.HttpStatus.*;

import java.util.Map;

import com.e203.project.dto.request.JiraIssueRequestDto;
import com.e203.project.service.JiraService;
import com.e203.webhook.service.GitlabWebhookService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class GitlabWebhookController {
	private final GitlabWebhookService gitlabWebhookService;
	private final JiraService jiraService;

	@PostMapping("api/v1/gitlab-webhook/{projectId}")
	public ResponseEntity<String> addGitlabWebhook(@PathVariable int projectId){

		boolean result = gitlabWebhookService.addGitlabWebhook(projectId);
		if(result){
			return ResponseEntity.status(OK).body("Added Gitlab Webhook");
		}
		return ResponseEntity.status(NOT_FOUND).body("Failed to add Gitlab Webhook");
	}

	@PostMapping("api/v1/notification")
	public ResponseEntity<String> gitlabWebhookNotification(@RequestBody Map<String, Object> payload){
		Map<String, Object> objectAttributes = (Map<String, Object>) payload.get("object_attributes");
		String issue = jiraService.createIssue(1, JiraIssueRequestDto.builder()
			.summary("merge 웹훅 실행")
			.description("merge 시 웹훅 실행되는거 테스트중").build());
		if (objectAttributes != null && "merged".equals(objectAttributes.get("state"))) {
			System.out.println("Merge Request was merged: " + payload);

			jiraService.createIssue(1, JiraIssueRequestDto.builder()
				.summary("mergeed")
				.description(payload.toString()).build());

			return ResponseEntity.ok("Merge event processed");

		}

		return ResponseEntity.ok("Event ignored");
	 }
}



