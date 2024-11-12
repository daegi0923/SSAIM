package com.e203.document.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.e203.document.collection.FunctionDescription;
import com.e203.document.dto.response.FunctionDescriptionResponseDto;
import com.e203.document.repository.FunctionDescriptionRepository;
import com.e203.global.utils.ChatAiService;
import com.e203.project.entity.Project;
import com.e203.project.repository.ProjectRepository;
import com.mongodb.client.result.UpdateResult;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;


@Service
@RequiredArgsConstructor
public class FunctionDescriptionService {

	private final MongoTemplate mongoTemplate;

	private final FunctionDescriptionRepository functionDescriptionRepository;

	private final ProjectRepository projectRepository;

	private final ChatAiService chatAiService;

	private final ProposalService proposalService;

	public FunctionDescription getFuncDesc(int projectId) {
		List<FunctionDescription> results = functionDescriptionRepository.findTopByProjectIdOrderByCreatedAtDesc(
			projectId, Sort.by(Sort.Direction.DESC, "createdAt"));
		return results.isEmpty() ? null : results.get(0); // 결과가 없으면 null 반환
	}

	public String getFuncDescContent(int projectId) {
		FunctionDescription funcDesc = getFuncDesc(projectId);
		return funcDesc == null ? "" : funcDesc.getContent();
	}

	public FunctionDescription updateFuncDescContent(int projectId, String content) {
		Query query = new Query(Criteria.where("projectId").is(projectId));

		Update update = new Update().set("content", content)
			.set("createdAt", LocalDateTime.now());

		UpdateResult documents = mongoTemplate.updateFirst(query, update, "FunctionDescription");

		return getFuncDesc(projectId);
	}

	public FunctionDescription saveFuncDesc(int projectId) {
		String defaultForm = "{\"domain\": [],\"featureName\": [],\"description\": [],\"owner\": [],\"priority\": []}";
		FunctionDescription functionDescription = FunctionDescription.builder()
			.projectId(projectId)
			.content(defaultForm)
			.build();
		if (getFuncDesc(projectId) == null) {
			return functionDescriptionRepository.save(functionDescription);
		}
		return null;
	}

	public String generateFunctionDescription(int projectId, int userId, String message) {
		Optional<Project> project = projectRepository.findById(projectId);
		if (project.isEmpty()) {
			return "Not found";
		} else if (project.get().getProjectMembers().stream()
			.noneMatch(member -> member.getUser().getUserId() == userId)) {
			return "Not authorized";
		}
		return chatAiService.generateFunctionDescription(message, proposalService.getProposalContent(projectId));
	}

	public FunctionDescriptionResponseDto parseStringToObject(int projectId) {
		FunctionDescription functionDescription = getFuncDesc(projectId);
		ObjectMapper objectMapper = new ObjectMapper();
		FunctionDescriptionResponseDto functionDescriptionResponseDto = null;
		try {
			functionDescriptionResponseDto = objectMapper.readValue(functionDescription.getContent(),
				FunctionDescriptionResponseDto.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return functionDescriptionResponseDto;
	}

}