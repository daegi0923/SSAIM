package com.e203.project.controller;

import static org.springframework.http.HttpStatus.*;

import java.util.List;
import java.util.Map;

import com.e203.project.dto.jiraapi.GenerateJiraRequest;
import com.e203.project.dto.request.*;
import com.e203.project.dto.response.GenerateJiraIssueResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.e203.project.dto.response.JiraIssueResponseDto;
import com.e203.project.dto.response.JiraSprintIssueResponseDto;
import com.e203.project.dto.response.ProjectJiraEpicResponseDto;
import com.e203.project.dto.response.SprintResponseDto;
import com.e203.project.service.JiraService;
import com.fasterxml.jackson.core.JsonProcessingException;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class JiraController {

	private final JiraService jiraService;

	@PatchMapping("/api/v1/projects/{projectId}/jira-api")
	public ResponseEntity<String> connectJiraApi(@PathVariable("projectId") int projectId,
		@RequestBody ProjectJiraConnectDto projectJiraConnectDto) {

		boolean result = jiraService.setJiraApi(projectJiraConnectDto, projectId);

		if (result) {
			return ResponseEntity.status(OK).body("jira api 연결 성공");
		}
		return ResponseEntity.status(BAD_REQUEST).body("jira api 연결 실패");
	}

	@GetMapping("/api/v1/projects/{projectId}/issue")
	public ResponseEntity<List<JiraIssueResponseDto>> findAllJiraIssue(@PathVariable("projectId") int projectId,
		@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate) {
		List<JiraIssueResponseDto> allJiraIssues = jiraService.findAllJiraIssues(startDate, endDate, projectId);
		if (allJiraIssues == null) {
			return ResponseEntity.status(NOT_FOUND).body(null);
		}
		if (allJiraIssues.isEmpty()) {
			return ResponseEntity.status(OK).body(allJiraIssues);
		}
		return ResponseEntity.status(OK).body(allJiraIssues);
	}

	@GetMapping("/api/v1/projects/{projectId}/sprint/{sprintId}/issue")
	public ResponseEntity<List<JiraSprintIssueResponseDto>> findSprintIssues(@PathVariable Integer projectId,
		@PathVariable Integer sprintId) {
		List<JiraSprintIssueResponseDto> sprintIssue = jiraService.findSprintIssue(projectId, sprintId);
		if (sprintIssue == null) {
			return ResponseEntity.status(NOT_FOUND).body(null);
		}
		return ResponseEntity.status(OK).body(sprintIssue);
	}

	@GetMapping("/api/v1/projects/{projectId}/epics")
	public ResponseEntity<List<ProjectJiraEpicResponseDto>> findAllEpic(@PathVariable("projectId") int projectId) {
		List<ProjectJiraEpicResponseDto> epics = jiraService.findAllEpics(projectId);
		if (epics == null) {
			return ResponseEntity.status(NOT_FOUND).body(null);
		}
		return ResponseEntity.status(OK).body(epics);
	}

	@PostMapping("/api/v1/projects/{projectId}/issue")
	public ResponseEntity<String> createIssue(@PathVariable("projectId") int projectId,
		@RequestBody JiraIssueRequestDto dto) {
		String result = jiraService.createIssue(projectId, dto);

		if (result.equals("create fail")) {
			return ResponseEntity.status(NOT_FOUND).body("이슈 생성에 실패했습니다.");
		}
		return ResponseEntity.status(OK).body(result);
	}

	@PutMapping("/api/v1/projects/{projectId}/epics")
	public ResponseEntity<String> modifyEpic(@PathVariable("projectId") int projectId, @RequestBody
	JiraIssueRequestDto epicUpdateRequestDto) {

		ResponseEntity<Map> mapResponseEntity = jiraService.modifyEpic(projectId, epicUpdateRequestDto);

		if (mapResponseEntity.getStatusCode() == NO_CONTENT) {
			return ResponseEntity.status(OK).body("에픽 수정 성공했습니다.");
		}
		return ResponseEntity.status(NOT_FOUND).body("에픽 수정 실패했습니다.");
	}

	@PutMapping("/api/v1/projects/{projectId}/issue")
	public ResponseEntity<String> modifyIssue(@PathVariable("projectId") int projectId,
		@RequestBody IssuePutRequest dto) {
		ResponseEntity<Map> result = jiraService.modifyIssue(projectId, dto);

		if (result.getStatusCode() == NO_CONTENT) {
			return ResponseEntity.status(OK).body("이슈 수정에 성공했습니다.");
		}
		return ResponseEntity.status(NOT_FOUND).body("이슈 수정에 실패했습니다.");
	}

	@GetMapping("/api/v1/projects/{projectId}/sprint")
	public ResponseEntity<List<SprintResponseDto>> findAllSprints(@PathVariable("projectId") int projectId) {
		List<SprintResponseDto> sprints = jiraService.findAllSprints(projectId);
		if (sprints == null) {
			ResponseEntity.status(NOT_FOUND).body(null);
		}
		return ResponseEntity.status(OK).body(sprints);
	}

	@PostMapping("/api/v1/projects/{projectId}/sprint")
	public ResponseEntity<String> createSprint(@PathVariable("projectId") int projectId,
		@RequestBody JiraSprintCreateRequestDto dto) {
		String sprint = jiraService.createSprint(dto, projectId);

		if (sprint.equals("Not Found")) {
			return ResponseEntity.status(NOT_FOUND).body("스프린트 생성을 실패했습니다.");
		}
		return ResponseEntity.status(OK).body(sprint);
	}

	@GetMapping("/api/v1/projects/{projectId}/sprint/{sprintId}")
	public ResponseEntity<SprintResponseDto> findSprint(@PathVariable("projectId") Integer projectId,
		@PathVariable("sprintId") Integer sprintId) {
		if (projectId == null || sprintId == null) {
			return ResponseEntity.status(NOT_FOUND).body(null);
		}
		SprintResponseDto result = jiraService.findSprint(projectId, sprintId);
		if (result == null) {
			return ResponseEntity.status(NOT_FOUND).body(null);
		}
		return ResponseEntity.status(OK).body(result);
	}

	@PutMapping("/api/v1/projects/{projectId}/sprint/{sprintId}")
	public ResponseEntity<String> uploadIssuesOnSprint(@PathVariable("projectId") Integer projectId,
		@PathVariable("sprintId") Integer sprintId, @RequestBody
	JiraSprintIssuesRequestDto dto) {
		if (projectId == null || sprintId == null) {
			return ResponseEntity.status(NOT_FOUND).body(null);
		}

		boolean result = jiraService.uploadIssuesOnSprint(projectId, sprintId, dto);

		if (result) {
			return ResponseEntity.status(OK).body("스프린트에 이슈 배치를 성공했습니다.");
		}
		return ResponseEntity.status(OK).body("스프린트에 이슈 배치를 실패했습니다.");
	}

	@PostMapping("/api/v1/projects/{projectId}/issue/{issueKey}")
	public ResponseEntity<String> transitionIssue(@PathVariable("projectId") Integer projectId,
		@PathVariable("issueKey") String issueKey, @RequestParam String status) {
		if (projectId == null || issueKey == null) {
			return ResponseEntity.status(NOT_FOUND).body(null);
		}
		boolean result = jiraService.transitionIssue(projectId, issueKey, status);
		if (result) {
			return ResponseEntity.status(OK).body("이슈 상태 전환을 성공했습니다.");
		}
		return ResponseEntity.status(NOT_FOUND).body("이슈 상태 전환을 실패했습니다.");

	}

	@PostMapping("api/v1/projects/{projectId}/issue/generate")
	public ResponseEntity<List<GenerateJiraIssueResponse>> generateIssues(@PathVariable("projectId") Integer projectId,
		@RequestBody GenerateJiraRequest generateJiraRequest) {

		List<GenerateJiraIssueResponse> generateJiraIssueResponse = jiraService.generateIssues(projectId,
			generateJiraRequest);

		if (generateJiraIssueResponse == null) {
			return ResponseEntity.status(NOT_FOUND).body(null);
		}
		return ResponseEntity.status(OK).body(generateJiraIssueResponse);
	}

	@PostMapping("/api/v1/projects/{projectId}/sprint/{sprintId}")
	public ResponseEntity<String> uploadGenerateIssuesOnSprint(@PathVariable("projectId") int projectId,
		@PathVariable("sprintId") int sprintId,
		@RequestBody List<GenerateJiraIssueRequestDto> requestDto) {

		boolean result = jiraService.inputIssuesOnSprint(projectId, requestDto, sprintId);

		if (result) {
			return ResponseEntity.status(OK).body("이슈 등록을 완료하였습니다.");
		}

		return ResponseEntity.status(NOT_FOUND).body("프로젝트를 찾을 수 없습니다.");
	}

}
