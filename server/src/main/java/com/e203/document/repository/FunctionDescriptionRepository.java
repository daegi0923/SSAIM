package com.e203.document.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.e203.document.collection.FunctionDescription;

public interface FunctionDescriptionRepository extends MongoRepository<FunctionDescription, Integer> {
	@Query("{ 'projectId': ?0 }")
	List<FunctionDescription> findTopByProjectIdOrderByCreatedAtDesc(int projectId, Sort sort);
}
