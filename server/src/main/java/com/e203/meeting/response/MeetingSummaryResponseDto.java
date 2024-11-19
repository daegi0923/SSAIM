package com.e203.meeting.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class MeetingSummaryResponseDto {

    private Integer meetingId;
    private String meetingSummary;

    @Builder
    private MeetingSummaryResponseDto(Integer meetingId, String meetingSummary) {
        this.meetingId = meetingId;
        this.meetingSummary = meetingSummary;
    }
}
