package com.e203.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.e203.project.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
}
