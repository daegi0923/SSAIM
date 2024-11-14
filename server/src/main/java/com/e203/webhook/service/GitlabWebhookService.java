package com.e203.webhook.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.e203.project.dto.gitlabapi.GitlabWebhook;
import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import com.e203.project.repository.ProjectMemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GitlabWebhookService {
	private final ProjectMemberRepository projectMemberRepository;
	private final RestClient restClient;

	public boolean addGitlabWebhook(int projectId) {
		String gitlabUrl = "https://lab.ssafy.com/api/v4/projects/";

		ProjectMember projectLeader = getProjectLeader(projectId);
		if(projectLeader == null) {
			return false;
		}

		String gitlabApi = projectLeader.getProject().getGitlabApi();
		String gitlabProjectId = projectLeader.getProject().getGitlabProjectId();
		GitlabWebhook gitlabWebhook = GitlabWebhook.create();

		ResponseEntity<Map> result = restClient.post()
			.uri(gitlabUrl + gitlabProjectId + "/hooks")
			.header("PRIVATE-TOKEN", gitlabApi)
			.body(gitlabWebhook)
			.contentType(MediaType.APPLICATION_JSON)
			.retrieve()
			.toEntity(Map.class);

		if(result.getStatusCode().is2xxSuccessful()) {
			return true;
		}
		return false;
	}

	private ProjectMember getProjectLeader(int projectId) {
		List<ProjectMember> leader = projectMemberRepository.findByProjectIdAndRole(projectId, 1);
		if (leader.size() != 1) {
			return null;
		}
		return leader.get(0);
	}
}
