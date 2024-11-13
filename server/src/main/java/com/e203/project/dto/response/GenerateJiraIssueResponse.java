package com.e203.project.dto.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GenerateJiraIssueResponse {

    private String day;
    private List<TaskDTO> tasks;

    @JsonCreator
    protected GenerateJiraIssueResponse(
            @JsonProperty("day") String day,
            @JsonProperty("tasks") List<TaskDTO> tasks
    ) {
        this.day = day;
        this.tasks = tasks;
    }
}
