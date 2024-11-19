package com.e203.project.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.e203.project.entity.ProjectMember;
import com.e203.project.repository.ProjectMemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectMemberService {

	private final ProjectMemberRepository projectMemberRepository;

	public List<ProjectMember> findEntityList(Integer projectId) {
		return projectMemberRepository.findByProjectId(projectId);
	}


	public ProjectMember save(ProjectMember entity) {
		return projectMemberRepository.save(entity);
	}
}
