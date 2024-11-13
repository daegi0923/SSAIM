package com.e203.document.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.e203.document.entity.Erd;
import com.e203.document.repository.ErdRepository;
import com.e203.global.utils.FileUploader;
import com.e203.project.entity.Project;
import com.e203.project.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ErdService {

	private final ProjectRepository projectRepository;
	private final ErdRepository erdRepository;
	private final FileUploader fileUploader;

	@Transactional
	public String createErd(int projectId, int userId, MultipartFile image) {
		Optional<Project> project = projectRepository.findById(projectId);
		if (project.isEmpty()) {
			return "Not found";
		} else if (project.get()
			.getProjectMembers()
			.stream()
			.noneMatch(member -> member.getUser().getUserId() == userId)) {
			return "Not authorized";
		}

		if (image != null) {
			String imageUrl = fileUploader.upload(image);
			Erd erd = Erd.builder().project(project.get()).imageUrl(imageUrl).build();
			erdRepository.save(erd);
			return "success";
		}

		return "ERD upload fail";

	}

	@Transactional
	public String updateErd(Integer projectId, int userId, MultipartFile image) {
		Optional<Project> project = projectRepository.findById(projectId);
		if (project.isEmpty()) {
			return "Not found";
		} else if (project.get()
			.getProjectMembers()
			.stream()
			.noneMatch(member -> member.getUser().getUserId() == userId)) {
			return "Not authorized";
		}

		if (image != null) {
			Erd erd = erdRepository.findById(projectId).orElse(null);
			if (erd == null) {
				return "fail";
			}
			String imageUrl = fileUploader.upload(image);
			erd.setImageUrl(imageUrl);
			return "success";
		}

		return "fail";
	}

	public String findErd(int projectId, int userId) {
		Optional<Project> project = projectRepository.findById(projectId);
		if (project.isEmpty()) {
			return "Not found";
		} else if (project.get()
			.getProjectMembers()
			.stream()
			.noneMatch(member -> member.getUser().getUserId() == userId)) {
			return "Not authorized";
		}
		List<Erd> erd = erdRepository.findByProjectId(projectId);
		if (erd.size() == 0) {
			return "fail";
		}
		return erd.get(0).getImageUrl();
	}
}
