package com.e203.project.dto.request;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TaskRequestDto {

    private String assignee;
    private String summary;
    private String description;
    private String epic;
    private String issueType;
    private Integer storyPoint;

    @Builder
    private TaskRequestDto(String assignee, String summary, String description, String epic, String issueType, Integer storyPoint) {
        this.assignee = assignee;
        this.summary = summary;
        this.description = description;
        this.epic = epic;
        this.issueType = issueType;
        this.storyPoint = storyPoint;
    }
}
