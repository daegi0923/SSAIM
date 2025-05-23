package com.e203.project.service;

import static org.springframework.http.HttpStatus.*;

import java.util.ArrayList;
import java.util.Base64;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import com.e203.document.service.ApiDocsService;
import com.e203.global.utils.ChatAiService;
import com.e203.project.dto.jiraapi.*;
import com.e203.project.dto.request.*;
import com.e203.project.dto.response.*;
import com.e203.user.entity.User;
import com.e203.user.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import com.e203.project.dto.jiraapi.JiraContent;
import com.e203.project.dto.jiraapi.JiraEpicFields;
import com.e203.project.dto.jiraapi.JiraIssueFields;
import com.e203.project.dto.jiraapi.JiraTransitionsResponse;
import com.e203.project.dto.jiraapi.Sprint;
import com.e203.project.dto.jiraapi.SprintResponse;
import com.e203.project.dto.jiraapi.Transition;
import com.e203.project.dto.jiraapi.TransitionRequest;
import com.e203.project.dto.response.JiraInfo;
import com.e203.project.dto.response.JiraIssueResponseDto;
import com.e203.project.dto.jiraapi.JiraResponse;
import com.e203.project.dto.response.ProjectJiraEpicResponseDto;
import com.e203.project.dto.response.SprintResponseDto;
import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import com.e203.project.repository.ProjectMemberRepository;
import com.e203.project.repository.ProjectRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JiraService {
	private static final Logger log = LoggerFactory.getLogger(JiraService.class);
	// jira api key를 db에 저장하기
	private final ProjectRepository projectRepository;
	private final ProjectMemberRepository projectMemberRepository;
	private final RestClient restClient;
	private final ObjectMapper objectMapper;
	private final String JIRA_URL = "https://ssafy.atlassian.net/rest";
	private final ChatAiService chatAiService;
	private final ApiDocsService apiDocsService;
	private final UserRepository userRepository;

	@Transactional
	public Boolean setJiraApi(ProjectJiraConnectDto jiraConnectDto, int projectId) {
		Project project = projectRepository.findById(projectId).orElse(null);
		if (project == null) {
			return false;
		}
		project.setJiraApi(jiraConnectDto.getJiraApi());
		project.setJiraProjectId(jiraConnectDto.getJiraProjectId());
		project.setJiraBoardId(jiraConnectDto.getJiraBoardId());
		return true;
	}

	public JiraInfo getInfo(int projectId) {
		ProjectMember leader = getProjectLeader(projectId);
		if (leader == null) {
			return null;
		}
		JiraInfo jiraInfo = JiraInfo.create(leader);

		return jiraInfo;
	}

	public List<JiraIssueResponseDto> findAllJiraIssues(String startDate, String endDate, int projectId) {
		JiraInfo info = getInfo(projectId);
		if (info == null) {
			return null;
		}
		String jql = "/api/2/search?jql=" +
			"project=\"" + info.getJiraProjectId() + "\" AND created >= \"" + startDate + "\" AND created <= \""
			+ endDate + "\"" + " AND issuetype!=Epic ORDER BY created ASC";
		String fields = "&fields= summary,status,assignee,customfield_10014,customfield_10031, issuetype, description, ";

		List<JiraContent> issues = retrieve(jql, fields, info.getEncodedCredentials(), JiraContent.class);
		return issues.stream().map(JiraIssueResponseDto::transferDto).collect(Collectors.toList());
	}

	public List<JiraSprintIssueResponseDto> findSprintIssue(int projectId, int sprintId) {
		JiraInfo info = getInfo(projectId);
		if (info == null) {
			return null;
		}
		String jql = "/agile/1.0/sprint/" + sprintId + "/issue";
		String fields = "?fields=summary,status,assignee,customfield_10014,customfield_10031, issuetype,description&jql=issuetype != Epic ORDER BY created ASC ";

		List<JiraSprintFindIssueRequest> issues = retrieve(jql, fields, info.getEncodedCredentials(),
			JiraSprintFindIssueRequest.class);

		return issues.stream().map(JiraSprintIssueResponseDto::transferDto).collect(Collectors.toList());

	}

	public List<ProjectJiraEpicResponseDto> findAllEpics(int projectId) {

		JiraInfo info = getInfo(projectId);
		if (info == null) {
			return null;
		}

		String jql = "/api/3/search?jql=" + "project=\"" + info.getJiraProjectId() + "\" AND issuetype=Epic";
		String fields = "&fields=key,summary";
		List<JiraContent> epics = retrieve(jql, fields, info.getEncodedCredentials(), JiraContent.class);
		return epics.stream().map(ProjectJiraEpicResponseDto::transferDto).collect(Collectors.toList());
	}

	public String findJiraAccountId(String userEmail, String jiraApi) {
		String encodedCredentials = Base64.getEncoder().encodeToString((userEmail + ":" + jiraApi).getBytes());
		String jiraUri = JIRA_URL + "/api/3/myself";
		ResponseEntity<Map> authorization = restClient.get()
			.uri(jiraUri)
			.header("Authorization", "Basic " + encodedCredentials)
			.retrieve()
			.toEntity(Map.class);
		return authorization.getBody().get("accountId").toString();
	}

	public String createIssue(int projectId, JiraIssueRequestDto dto) {
		JiraInfo info = getInfo(projectId);
		String jiraUri = JIRA_URL + "/api/3/issue";

		JiraIssueFields jiraIssueFields = JiraIssueFields.transferJsonObject(dto, info.getJiraProjectId());

		ResponseEntity<Map> result = createIssueAndEpic(jiraUri, info, jiraIssueFields);
		if (result.getStatusCode() == CREATED) {
			return result.getBody().get("key").toString();
		}
		return "create fail";
	}

	public ResponseEntity<Map> createEpic(int projectId, JiraIssueRequestDto dto) {
		JiraInfo info = getInfo(projectId);
		String jiraUri = JIRA_URL + "/api/3/issue";

		JiraIssueFields jiraIssueFields = JiraIssueFields.createEpicJsonObject(dto, info.getJiraProjectId());

		ResponseEntity<Map> response = createIssueAndEpic(jiraUri, info, jiraIssueFields);
		return response;
	}

	private ResponseEntity<Map> createIssueAndEpic(String jiraUri, JiraInfo info, JiraIssueFields jiraIssueFields) {
		ResponseEntity<Map> response = restClient.post()
			.uri(jiraUri)
			.contentType(MediaType.APPLICATION_JSON)
			.header("Authorization", "Basic " + info.getEncodedCredentials())
			.body(jiraIssueFields)
			.retrieve()
			.toEntity(Map.class);
		return response;
	}

	public ResponseEntity<Map> modifyIssue(int projectId, IssuePutRequest dto) {
		JiraInfo info = getInfo(projectId);
		if (info == null) {
			return null;
		}

		String jiraUri = JIRA_URL + "/api/3/issue/" + dto.getIssueKey();
		JiraIssuePut jiraIssuePut = JiraIssuePut.createPutRequest(dto);

		ResponseEntity<Map> response = putJiraApi(jiraUri, info, jiraIssuePut);

		return response;
	}

	public ResponseEntity<Map> modifyEpic(int projectId, JiraIssueRequestDto dto) {
		JiraInfo info = getInfo(projectId);
		if (info == null) {
			return null;
		}
		String jiraUri = JIRA_URL + "/api/3/issue/" + dto.getIssueKey();

		JiraEpicFields epicFields = JiraEpicFields.createJiraEpic(dto);

		ResponseEntity<Map> response = putJiraApi(jiraUri, info, epicFields);

		return response;
	}

	private <T> ResponseEntity<Map> putJiraApi(String jiraUri, JiraInfo info, T jiraFields) {
		ResponseEntity<Map> response = restClient.put()
			.uri(jiraUri)
			.contentType(MediaType.APPLICATION_JSON)
			.header("Authorization", "Basic " + info.getEncodedCredentials())
			.body(jiraFields)
			.retrieve()
			.toEntity(Map.class);
		return response;
	}

	public List<SprintResponseDto> findAllSprints(int projectId) {

		JiraInfo info = getInfo(projectId);

		String jiraUri = JIRA_URL + "/agile/1.0/board/" + info.getJiraProjectBoardId() + "/sprint?jql=";

		int startAt = 0;
		int maxResults = 100;
		boolean hasMore = true;
		List<Sprint> sprints = new ArrayList<>();
		while (hasMore) {
			String uri = jiraUri + "startAt=" + startAt + "&maxResults=" + maxResults;
			try {
				String responseBody = getRequestString(jiraUri, info.getEncodedCredentials());
				SprintResponse sprintResponse = objectMapper.readValue(responseBody, SprintResponse.class);

				sprints.addAll(sprintResponse.getValues());
				startAt += sprintResponse.getValues().size();
				hasMore = startAt < sprintResponse.getTotal();
			} catch (Exception e) {
				handleException("Error occurred while calling Jira API", e);
			}
		}

		return sprints.stream().map(SprintResponseDto::transferDto).collect(Collectors.toList());
	}

	private <T> List<T> retrieve(String jql, String fields, String encodedCredentials, Class<T> reqType) {
		List<T> issues = new ArrayList<>();
		int startAt = 0;
		int maxResults = 100;
		boolean hasMore = true;

		while (hasMore) {
			String jiraUri = JIRA_URL + jql + fields + "&startAt=" + startAt + "&maxResults=" + maxResults;

			try {
				String responseBody = getRequestString(jiraUri, encodedCredentials);

				if (reqType.equals(JiraContent.class)) {
					JiraResponse response = objectMapper.readValue(responseBody, JiraResponse.class);
					issues.addAll((Collection<? extends T>)response.getIssues()); //	private List<JiraContent> issues;
					startAt += response.getIssues().size();
					hasMore = startAt < response.getTotal();

				} else if (reqType.equals(JiraSprintFindIssueRequest.class)) {
					JiraSprintFindIssue sprintFindIssue = objectMapper.readValue(responseBody,
						JiraSprintFindIssue.class);
					issues.addAll(
						(Collection<? extends T>)sprintFindIssue.getIssues()); // List<JiraSprintFindIssueRequest> issues;
					startAt += sprintFindIssue.getIssues().size();
					hasMore = startAt < sprintFindIssue.getTotal();
				}

			} catch (Exception e) {
				handleException("Error occurred while calling Jira API", e);
				break;
			}
		}
		return issues;
	}

	private String getRequestString(String jiraUri, String encodedCredentials) {
		return restClient.get()
			.uri(jiraUri)
			.header("Authorization", "Basic " + encodedCredentials)
			.header("Content-Type", "application/json")
			.retrieve()
			.body(String.class);
	}

	private ProjectMember getProjectLeader(int projectId) {
		List<ProjectMember> leader = projectMemberRepository.findByProjectIdAndRole(projectId, 1);
		if (leader.size() != 1) {
			return null;
		}
		return leader.get(0);
	}

	public String createSprint(JiraSprintCreateRequestDto dto, int projectId) {
		JiraInfo info = getInfo(projectId);
		if (info == null) {
			return "Not Found";
		}
		dto.setBoardId(info.getJiraProjectBoardId());
		String jiraUri = JIRA_URL + "/agile/1.0/sprint";
		ResponseEntity<Map> response = restClient.post()
			.uri(jiraUri)
			.contentType(MediaType.APPLICATION_JSON)
			.header("Authorization", "Basic " + info.getEncodedCredentials())
			.body(dto)
			.retrieve()
			.toEntity(Map.class);

		return response.getBody().get("id").toString();
	}

	private void handleException(String message, Exception e) {
		log.error(message, e);
	}

	public SprintResponseDto findSprint(int projectId, int sprintId) {
		JiraInfo info = getInfo(projectId);
		if (info == null) {
			return null;
		}
		String jiraUri = JIRA_URL + "/agile/1.0/sprint/" + sprintId;

		try {
			ResponseEntity<SprintResponseDto> result = restClient.get()
				.uri(jiraUri)
				.header("Authorization", "Basic " + info.getEncodedCredentials())
				.retrieve()
				.toEntity(SprintResponseDto.class);

			if (result.getStatusCode().is2xxSuccessful()) {
				return result.getBody();
			}
		} catch (HttpClientErrorException e) {
			log.error(e.getResponseBodyAsString());
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		return null;
	}

	public boolean uploadIssuesOnSprint(int projectId, int sprintId, JiraSprintIssuesRequestDto dto) {
		JiraInfo info = getInfo(projectId);
		if (info == null) {
			return false;
		}
		String jiraUri = JIRA_URL + "/agile/1.0/sprint/" + sprintId + "/issue";
		try {
			ResponseEntity<Map> result = restClient.post()
				.uri(jiraUri)
				.contentType(MediaType.APPLICATION_JSON)
				.header("Authorization", "Basic " + info.getEncodedCredentials())
				.body(dto)
				.retrieve()
				.toEntity(Map.class);

			return result.getStatusCode().is2xxSuccessful();

		} catch (HttpClientErrorException e) {
			log.error(e.getResponseBodyAsString());
		} catch (Exception e) {
			log.error(e.getMessage());
		}
		return false;
	}

	public boolean transitionIssue(int projectId, String issueKey, String status) {
		JiraInfo info = getInfo(projectId);
		if (info == null) {
			return false;
		}
		String transitionId = getTransitionId(info.getEncodedCredentials(), issueKey, status);
		String jiraUri = JIRA_URL + "/api/3/issue/" + issueKey + "/transitions";
		TransitionRequest transitionRequest = new TransitionRequest(transitionId);

		try {
			ResponseEntity<Map> result = restClient.post()
				.uri(jiraUri)
				.contentType(MediaType.APPLICATION_JSON)
				.header("Authorization", "Basic " + info.getEncodedCredentials())
				.body(transitionRequest)
				.retrieve()
				.toEntity(Map.class);

			return true;
		} catch (HttpClientErrorException e) {
			log.error(e.getResponseBodyAsString());
		} catch (Exception e) {
			log.error(e.getMessage());
		}
		return false;
	}

	public String getTransitionId(String credential, String issueKey, String status) {
		String jiraUri = JIRA_URL + "/api/3/issue/" + issueKey + "/transitions";
		try {
			ResponseEntity<JiraTransitionsResponse> result = restClient.get()
				.uri(jiraUri)
				.header("Authorization", "Basic " + credential)
				.retrieve()
				.toEntity(JiraTransitionsResponse.class);

			return result.getBody().getTransitions().stream()
				.filter(transition -> transition.getName().equals(parseTransitionName(status)))
				.map(Transition::getId)
				.findFirst()
				.orElse(null);
		} catch (HttpClientErrorException e) {
			log.error(e.getResponseBodyAsString());
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		return null;
	}

	public String parseTransitionName(String origin) {
		if (origin.equals("todo")) {
			return "해야 할 일";
		}
		if (origin.equals("inProgress")) {
			return "진행 중";
		}
		if (origin.equals("done")) {
			return "완료";
		}
		return "fail";
	}

	public List<GenerateJiraIssueResponse> generateIssues(int projectId, GenerateJiraRequest generateJiraRequest) {

		try {
			Project project = projectRepository.findById(projectId).orElse(null);

			if (project == null) {
				return new ArrayList<>();
			}

			String issues = chatAiService.generateJira(generateJiraRequest.getMessage(),
				apiDocsService.getApiDocsContent(projectId)
				, generateJiraRequest.getAssignee(), generateJiraRequest.getStartDate(),
				generateJiraRequest.getEndDate());

			return objectMapper.readValue(issues, new TypeReference<List<GenerateJiraIssueResponse>>() {
			});
		} catch (Exception e) {
			return null;
		}
	}

	public boolean inputIssuesOnSprint(int projectId, List<GenerateJiraIssueRequestDto> issueDto, int sprintId,
		int userId) {

		Project project = projectRepository.findById(projectId).orElse(null);
		if (project == null) {
			return false;
		}
		List<JiraIssueRequestDto> jiraIssueRequestDtos = new ArrayList<>();

		for (GenerateJiraIssueRequestDto dto : issueDto) {
			List<JiraIssueRequestDto> tasks = dto.getTasks().stream()
				.map(task -> JiraIssueRequestDto.builder()
					.summary(task.getSummary())
					.description(
						task.getDescription() == null || task.getDescription().isBlank() ? " " : task.getDescription())
					.assignee(getAccountId(userId, projectId))
					.issueType(
						task.getIssueType() == null || task.getIssueType().isBlank() ? "Story" : task.getIssueType())
					.storyPoint(task.getStoryPoint() != null ? task.getStoryPoint() : 0)
					.epicName(task.getEpic() == null || task.getEpic().isBlank() ? null : task.getEpic())
					.build())
				.collect(Collectors.toList());

			jiraIssueRequestDtos.addAll(tasks);
		}

		List<String> issueKeys = new ArrayList<>();

		for (JiraIssueRequestDto jiraIssueRequestDto : jiraIssueRequestDtos) {
			String issueType = jiraIssueRequestDto.getIssueType();
			String issueName = jiraIssueRequestDto.getSummary();
			jiraIssueRequestDto.setSummary(jiraIssueRequestDto.getEpicName());
			jiraIssueRequestDto.setSummary(issueName);
			if (jiraIssueRequestDto.getEpicName() != null) {
				String epicKey = createEpic(projectId, jiraIssueRequestDto).getBody().get("key").toString();
				jiraIssueRequestDto.setEpicKey(epicKey);
			}
			jiraIssueRequestDto.setIssueType(issueType);
			jiraIssueRequestDto.setAssignee(jiraIssueRequestDto.getAssignee());
			issueKeys.add(createIssue(projectId, jiraIssueRequestDto));
		}

		JiraSprintIssuesRequestDto jiraSprintIssuesRequestDto = new JiraSprintIssuesRequestDto();
		jiraSprintIssuesRequestDto.setIssues(issueKeys);

		uploadIssuesOnSprint(projectId, sprintId, jiraSprintIssuesRequestDto);

		return true;
	}

	public String getAccountId(Integer userId, Integer projectId) {
		//https://ssafy.atlassian.net/rest/api/3/user/assignable/search?project=S11P31E203

		JiraInfo info = getInfo(projectId);
		if (info == null) {
			return "Not Found";
		}
		String jiraUri = JIRA_URL + "/api/3/user/assignable/search?project=" + info.getJiraProjectId();
		try {
			ResponseEntity<List<JiraAccount>> result = restClient.get()
				.uri(jiraUri)
				.header("Authorization", "Basic " + info.getEncodedCredentials())
				.retrieve()
				.toEntity(new ParameterizedTypeReference<List<JiraAccount>>() {
				}); // 리스트로 처리

			if (!result.getStatusCode().is2xxSuccessful()) {
				return null;
			}
			User user = userRepository.findById(userId).orElse(null);
			if (user == null) {
				return null;
			}

			for (JiraAccount accounts : Objects.requireNonNull(result.getBody())) {
				if (accounts.getDisplayName().equals(user.getUserName())) {
					return accounts.getAccountId();
				}
			}

		} catch (HttpClientErrorException e) {
			log.error(e.getResponseBodyAsString());
		} catch (Exception e) {
			log.error(e.getMessage());
		}

		return null;
	}

}