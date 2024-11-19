package com.e203.meeting.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
public class Segment {
    private final int start;
    private final int end;
    private final String text;
    private final double confidence;
    private final Diarization diarization;
    private final Speaker speaker;
    private final List<List<Object>> words;
    private final String textEdited;

    // @JsonCreator를 사용한 생성자 Jackson 라이브러리에서 JSON을 Java 객체로 역직렬화할 때 사용할 생성자를 지정하는 역할을 합니다.
    @JsonCreator
    protected Segment(
            @JsonProperty("start") int start,
            @JsonProperty("end") int end,
            @JsonProperty("text") String text,
            @JsonProperty("confidence") double confidence,
            @JsonProperty("diarization") Diarization diarization,
            @JsonProperty("speaker") Speaker speaker,
            @JsonProperty("words") List<List<Object>> words,
            @JsonProperty("textEdited") String textEdited
    ) {
        this.start = start;
        this.end = end;
        this.text = text;
        this.confidence = confidence;
        this.diarization = diarization;
        this.speaker = speaker;
        this.words = words;
        this.textEdited = textEdited;
    }
}
