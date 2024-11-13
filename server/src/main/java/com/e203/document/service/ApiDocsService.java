package com.e203.document.service;

import com.e203.document.collection.ApiDocs;
import com.e203.document.dto.response.ApiDocsResponseDto;
import com.e203.document.repository.ApiDocsRepository;
import com.e203.global.utils.ChatAiService;
import com.e203.project.entity.Project;
import com.e203.project.repository.ProjectRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.result.UpdateResult;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ApiDocsService {

    private final MongoTemplate mongoTemplate;

    private final ApiDocsRepository apiDocsRepository;

    private final ProjectRepository projectRepository;

    private final ChatAiService chatAiService;

    private final FunctionDescriptionService functionDescriptionService;

    public ApiDocs getApiDocs(int projectId) {
        List<ApiDocs> results = apiDocsRepository.findByProjectId(projectId);
        return results.isEmpty() ? saveApiDocs(projectId) : results.get(0); // 결과가 없으면 null 반환
    }

    public String getApiDocsContent(int projectId) {
        return getApiDocs(projectId).getContent();
    }

    public ApiDocs updateApiDocsContent(int projectId, String content) {

        Query query = new Query(Criteria.where("projectId").is(projectId));
        Update update = new Update().set("content", content)
                .set("createdAt", LocalDateTime.now());

        UpdateResult documents = mongoTemplate.updateFirst(query, update, "ApiDocs");

        return getApiDocs(projectId);
    }

    public ApiDocs saveApiDocs(int projectId) {
        String defaultForm = "{\"category\": [],\"description\": [],\"uri\": [],\"method\": [],\"functionName\": [],\"frontOwner\": [],\"backOwner\": [],\"frontState\": [],\"backState\": [],\"priority\": [],\"requestHeader\": [],\"responseHeader\": [],\"requestBody\": [],\"responseBody\": [] } ";
        ApiDocs apiDocs = ApiDocs.builder()
                .projectId(projectId)
                .content(defaultForm)
                .build();
        ApiDocs docs = getApiDocs(projectId);
        if (docs == null) {
            return apiDocsRepository.save(apiDocs);
        }
        return null;
    }

    public String generateApiDocs(int projectId, int userId, String message) {
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isEmpty()) {
            return "Not found";
        } else if (project.get().getProjectMembers().stream()
                .noneMatch(member -> member.getUser().getUserId() == userId)) {
            return "Not authorized";
        }
        return chatAiService.generateApiDocs(message, functionDescriptionService.getFuncDescContent(projectId));
    }

    public ApiDocsResponseDto parseStringToObject(int projectId) {
        ApiDocs apiDocs = getApiDocs(projectId);
        ObjectMapper objectMapper = new ObjectMapper();

        if (apiDocs == null) {
            return null;
        }
        try {
            return objectMapper.readValue(apiDocs.getContent(), ApiDocsResponseDto.class);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
