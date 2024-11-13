package com.e203.meeting.request;

import com.e203.project.entity.Project;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MeetingRequestDto {

    private String meetingTitle;
    private Integer projectId;
    private String start;
    private String script;

    @Builder
    private MeetingRequestDto(String meetingTitle, Integer projectId, String start, String script) {
        this.meetingTitle = meetingTitle;
        this.projectId = projectId;
        this.start = start;
        this.script = script;
    }
}
