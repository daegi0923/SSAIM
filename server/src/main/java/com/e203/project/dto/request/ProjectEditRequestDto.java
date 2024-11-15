package com.e203.project.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectEditRequestDto {

    private String title;

    private String name;

    private LocalDate startDate;

    private LocalDate endDate;

    private String gitlabUrl;

    private String jiraUrl;

    private String figmaUrl;

    private String sheetUrl;

    private List<ProjectMemberEditRequestDto> projectMembers;
}
