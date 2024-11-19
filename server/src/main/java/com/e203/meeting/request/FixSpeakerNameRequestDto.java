package com.e203.meeting.request;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FixSpeakerNameRequestDto {

    private String label;
    private String name;

    @Builder
    private FixSpeakerNameRequestDto(String label, String name) {
        this.label = label;
        this.name = name;
    }
}
