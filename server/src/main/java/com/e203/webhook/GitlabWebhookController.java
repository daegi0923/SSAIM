package com.e203.webhook;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import static org.springframework.http.HttpStatus.*;

import com.e203.webhook.service.GitlabWebhookService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class GitlabWebhookController {
	private final GitlabWebhookService gitlabWebhookService;

	@PostMapping("api/v1/gitlab-webhook/{projectId}")
	public ResponseEntity<String> addGitlabWebhook(@PathVariable int projectId){

		boolean result = gitlabWebhookService.addGitlabWebhook(projectId);
		if(result){
			return ResponseEntity.status(OK).body("Added Gitlab Webhook");
		}
		return ResponseEntity.status(NOT_FOUND).body("Failed to add Gitlab Webhook");
	}



}
