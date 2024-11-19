package com.e203.meeting.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
public class Params {
    private final String service;
    private final String domain;
    private final String lang;
    private final String completion;
    private final Diarization diarization;
    private final Sed sed;
    private final List<Object> boostings;
    private final String forbiddens;
    private final boolean wordAlignment;
    private final boolean fullText;
    private final boolean noiseFiltering;
    private final boolean resultToObs;
    private final int priority;
    private final Map<String, Object> userdata;

    // @JsonCreator를 사용한 생성자 Jackson 라이브러리에서 JSON을 Java 객체로 역직렬화할 때 사용할 생성자를 지정하는 역할을 합니다.
    @JsonCreator
    protected Params(
            @JsonProperty("service") String service,
            @JsonProperty("domain") String domain,
            @JsonProperty("lang") String lang,
            @JsonProperty("completion") String completion,
            @JsonProperty("diarization") Diarization diarization,
            @JsonProperty("sed") Sed sed,
            @JsonProperty("boostings") List<Object> boostings,
            @JsonProperty("forbiddens") String forbiddens,
            @JsonProperty("wordAlignment") boolean wordAlignment,
            @JsonProperty("fullText") boolean fullText,
            @JsonProperty("noiseFiltering") boolean noiseFiltering,
            @JsonProperty("resultToObs") boolean resultToObs,
            @JsonProperty("priority") int priority,
            @JsonProperty("userdata") Map<String, Object> userdata
    ) {
        this.service = service;
        this.domain = domain;
        this.lang = lang;
        this.completion = completion;
        this.diarization = diarization;
        this.sed = sed;
        this.boostings = boostings;
        this.forbiddens = forbiddens;
        this.wordAlignment = wordAlignment;
        this.fullText = fullText;
        this.noiseFiltering = noiseFiltering;
        this.resultToObs = resultToObs;
        this.priority = priority;
        this.userdata = userdata;
    }
}
