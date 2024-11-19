package com.e203.meeting.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Diarization {
    private boolean enable;
    private int speakerCountMin;
    private int speakerCountMax;

}
