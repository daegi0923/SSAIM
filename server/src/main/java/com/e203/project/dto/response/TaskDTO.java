package com.e203.project.dto.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TaskDTO {

    private String assignee;
    private String summary;
    private String description;
    private String epic;
    private String issueType;
    private Integer storyPoint;

    @JsonCreator
    protected TaskDTO(
            @JsonProperty("assignee") String assignee,
            @JsonProperty("summary") String summary,
            @JsonProperty("description") String description,
            @JsonProperty("epic") String epic,
            @JsonProperty("issueType") String issueType,
            @JsonProperty("storyPoint") Integer storyPoint

    ) {
        this.assignee = assignee;
        this.summary = summary;
        this.description = description;
        this.epic = epic;
        this.issueType = issueType;
        this.storyPoint = storyPoint;
    }
}
