package com.e203.project.repository;

import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import com.e203.user.entity.User;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Integer> {

	ProjectMember findByUser(User user);

    @EntityGraph(attributePaths = {"project", "user"})
    List<ProjectMember> findByProjectId(Integer projectId);

	@Query("SELECT pm.project FROM ProjectMember pm WHERE pm.user.userId = :userId")
	List<Project> findProjectsByUserId(@Param("userId") Integer userId);

	@EntityGraph(attributePaths = {"project", "user"})
	List<ProjectMember> findByProjectIdAndRole(int projectId, int role);

}
