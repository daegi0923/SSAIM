package com.e203.document.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.e203.document.collection.Proposal;

public interface ProposalRepository  extends MongoRepository<Proposal, String> {
	@Query("{ 'projectId': ?0 }")
	List<Proposal> findTopByProjectIdOrderByCreatedAtDesc(int projectId, Sort sort);
}

