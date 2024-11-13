package com.e203.project.controller;

import com.e203.project.dto.request.ProjectCreateRequestDto;
import com.e203.project.dto.request.ProjectEditRequestDto;
import com.e203.project.dto.response.ProjectFindResponseDto;
import com.e203.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping("/api/v1/projects")
    public ResponseEntity<String> createProject(@RequestPart("projectInfo") ProjectCreateRequestDto dto,
                                                @RequestPart(name = "projectImage", required = false) MultipartFile image) {
        boolean result = projectService.createProject(image, dto);

        if (result) {
            return ResponseEntity.status(OK).body("프로젝트가 정상적으로 생성되었습니다.");
        } else {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body("프로젝트 생성에 실패하였습니다.");
        }
    }

    @GetMapping("/api/v1/projects/{projectId}")
    public ResponseEntity<ProjectFindResponseDto> findProjectInfo(@PathVariable Integer projectId) {
        ProjectFindResponseDto projectInfo = projectService.findProjectInfo(projectId);
        return ResponseEntity.status(OK).body(projectInfo);
    }

    @GetMapping("/api/v1/user/{userId}/projects")
    public ResponseEntity<List<ProjectFindResponseDto>> findAllProjects(@PathVariable Integer userId) {
        List<ProjectFindResponseDto> projectFindResponseDtos = projectService.findAllProjects(userId);
        return ResponseEntity.status(OK).body(projectFindResponseDtos);
    }

    @PatchMapping("/api/v1/projects/{projectId}")
    public ResponseEntity<String> editProjectInfo(@PathVariable Integer projectId,
                                                  @RequestPart(name = "projectInfo", required = false) ProjectEditRequestDto dto,
                                                  @RequestPart(name = "projectImage", required = false) MultipartFile image) {
        String result = projectService.editProjectInfo(projectId, dto, image);
        return null;
    }

}
