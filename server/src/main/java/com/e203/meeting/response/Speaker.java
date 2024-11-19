package com.e203.meeting.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
public class Speaker {
    private final String label;
    private final String name;
    private final boolean edited;

    // @JsonCreator를 사용한 생성자 Jackson 라이브러리에서 JSON을 Java 객체로 역직렬화할 때 사용할 생성자를 지정하는 역할을 합니다.
    @JsonCreator
    protected Speaker(
            @JsonProperty("label") String label,
            @JsonProperty("name") String name,
            @JsonProperty("edited") boolean edited
    ) {
        this.label = label;
        this.name = name;
        this.edited = edited;
    }
}
