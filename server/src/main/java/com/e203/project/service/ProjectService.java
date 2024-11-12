package com.e203.project.service;

import com.e203.document.dto.response.ApiDocsResponseDto;
import com.e203.document.service.ApiDocsService;
import com.e203.document.service.FunctionDescriptionService;
import com.e203.document.service.ProposalService;
import com.e203.global.utils.FileUploader;
import com.e203.project.dto.request.ProjectCreateRequestDto;
import com.e203.project.dto.request.ProjectMemberCreateRequestDto;
import com.e203.project.dto.response.ProjectFindResponseDto;
import com.e203.project.dto.response.ProjectMemberFindResponseDto;
import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import com.e203.project.repository.ProjectMemberRepository;
import com.e203.project.repository.ProjectRepository;
import com.e203.user.entity.User;
import com.e203.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    private final ProjectMemberService projectMemberService;

    private final ApiDocsService apiDocsService;

    private final FunctionDescriptionService functionDescriptionService;

    private final ProposalService proposalService;

    private final UserRepository userRepository;

    private final ProjectMemberRepository projectMemberRepository;

    private final FileUploader fileUploader;

    @Transactional
    public boolean createProject(MultipartFile image, ProjectCreateRequestDto projectCreateRequestDto) {

        Project entity = projectCreateRequestDto.toEntity();

        if (image != null) {
            String imageUrl = fileUploader.upload(image);
            entity.setProfileImage(imageUrl);
        }

        Project project = projectRepository.save(entity);

        projectCreateRequestDto.getTeamMembers().stream()
                .map(member -> createProjectMember(project, member))
                .forEach(projectMemberService::save);

        apiDocsService.saveApiDocs(project.getId());
        functionDescriptionService.saveFuncDesc(project.getId());
        proposalService.saveProposal(project.getId());

        //if project, projectMember가 잘 저장되었다면
        return true;
    }

    @Transactional
    public List<ProjectFindResponseDto> findAllProjects(int userId) {
        return findAll(userId).stream()
                .map(this::getProjectFindResponseDto)
                .toList();
    }

    @Transactional
    public ProjectFindResponseDto findProjectInfo(Integer projectId) {
        Project project = findEntity(projectId);
        return getProjectFindResponseDto(project);
    }

    public Project findEntity(Integer projectId) {
        Optional<Project> project = projectRepository.findById(projectId);
        return project.orElse(null);
    }

    public List<Project> findAll(int userId) {
        return projectMemberRepository.findProjectsByUserId(userId);
    }

    private ProjectFindResponseDto getProjectFindResponseDto(Project project) {
        ApiDocsResponseDto dto = apiDocsService.parseStringToObject(project.getId());
        return ProjectFindResponseDto.fromEntity(project, getProgress(dto.getFrontState()), getProgress(dto.getBackState()), createProjectMemberFindResponseDtos(project));
    }

    private List<ProjectMemberFindResponseDto> createProjectMemberFindResponseDtos(Project project) {
        return project.getProjectMembers().stream()
                .map(ProjectMemberFindResponseDto::fromEntity)
                .toList();
    }

    private ProjectMember createProjectMember(Project project, ProjectMemberCreateRequestDto member) {
        User user = userRepository.findById(member.getId()).orElse(null);
        return ProjectMember.builder()
                .user(user)
                .project(project)
                .role(member.getRole())
                .build();
    }


    public int getProgress(List<Integer> states) {
        return states.isEmpty() ? 0 : 100 * Collections.frequency(states, 2) / states.size();
    }

}

