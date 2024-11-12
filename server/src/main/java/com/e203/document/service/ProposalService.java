package com.e203.document.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.e203.document.dto.response.ProposalResponseDto;
import com.e203.document.collection.Proposal;
import com.e203.document.repository.ProposalRepository;
import com.e203.global.utils.ChatAiService;
import com.e203.project.entity.Project;
import com.e203.project.repository.ProjectRepository;
import com.mongodb.client.result.UpdateResult;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexDefinition;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.mongodb.core.query.Collation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.e203.document.collection.Proposal;
import com.e203.document.repository.ProposalRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.result.UpdateResult;

import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProposalService {

    private final MongoTemplate mongoTemplate;

    private final ProposalRepository proposalRepository;

    private final ProjectRepository projectRepository;

    private final ChatAiService chatAiService;

    public void createIndex() {
        // Collation 설정
        Collation collation = Collation.of("ko");

        // 인덱스 정의
        IndexDefinition indexDefinition = new Index()
                .on("createdAt", Sort.Direction.DESC)
                .collation(collation);

        // 인덱스 추가
        IndexOperations indexOps = mongoTemplate.indexOps(Proposal.class);
        indexOps.ensureIndex(indexDefinition);
    }

    public Proposal getProposal(int projectId) {
        List<Proposal> results = proposalRepository.findTopByProjectIdOrderByCreatedAtDesc(
                projectId, Sort.by(Sort.Direction.DESC, "createdAt"));
        return results.isEmpty() ? null : results.get(0); // 결과가 없으면 null 반환
    }

    public String getProposalContent(int projectId) {
        return getProposal(projectId).getContent();
    }

    public Proposal updateProposalContent(int projectId, String content) {
        Query query = new Query(Criteria.where("projectId").is(projectId));

        Update update = new Update().set("content", content)
			.set("createdAt", LocalDateTime.now());

        UpdateResult documents = mongoTemplate.updateFirst(query, update, "Proposal");

        return getProposal(projectId);
    }

	public Proposal saveProposal(int projectId) {
		String defaultForm = "{\"title\": \"\",\"description\": \"\",\"background\": \"\",\"feature\":\"\",\"effect\": \"\"}";
		Proposal proposal = Proposal.builder()
			.projectId(projectId)
			.content(defaultForm)
			.build();

		if(getProposal(projectId) == null) {
			return proposalRepository.save(proposal);
		}
		return null;
	}

    public String generateProposal(int projectId, int userId, String message) {
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isEmpty()) {
            return "Not found";
        } else if (project.get().getProjectMembers().stream()
                .noneMatch(member -> member.getUser().getUserId() == userId)) {
            return "Not authorized";
        }

        return chatAiService.generateProposal(message);
    }

	public ProposalResponseDto parseStringToObject(int projectId){
		Proposal proposal = getProposal(projectId);
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			return objectMapper.readValue(proposal.getContent(), ProposalResponseDto.class);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
