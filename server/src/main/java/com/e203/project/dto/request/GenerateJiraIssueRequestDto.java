package com.e203.project.dto.request;

import com.e203.project.dto.response.TaskDTO;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GenerateJiraIssueRequestDto {

    private String day;
    private List<TaskRequestDto> tasks;

    @Builder
    private GenerateJiraIssueRequestDto(String day, List<TaskRequestDto> tasks) {
        this.day = day;
        this.tasks = tasks;
    }
}
