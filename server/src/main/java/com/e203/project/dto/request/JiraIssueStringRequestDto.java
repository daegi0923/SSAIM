package com.e203.project.dto.request;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class JiraIssueStringRequestDto {

    private String issueString;

    @Builder
    private JiraIssueStringRequestDto(String issueString) {
        this.issueString = issueString;
    }
}
