package com.e203.document.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.e203.document.collection.ApiDocs;

public interface ApiDocsRepository extends MongoRepository<ApiDocs, String> {
	@Query("{ 'projectId': ?0 }")
	List<ApiDocs> findTopByProjectIdOrderByCreatedAtDesc(int projectId, Sort sort);

	List<ApiDocs> findByProjectId(int projectId);
}