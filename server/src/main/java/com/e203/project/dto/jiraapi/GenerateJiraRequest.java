package com.e203.project.dto.jiraapi;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GenerateJiraRequest {

    private String message;
    private String assignee;
    private String startDate;
    private String endDate;

    @Builder
    private GenerateJiraRequest(String message, String assignee, String startDate, String endDate) {

        this.message = message;
        this.assignee = assignee;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
