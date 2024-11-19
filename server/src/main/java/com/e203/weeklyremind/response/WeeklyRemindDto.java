package com.e203.weeklyremind.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WeeklyRemindDto {

    private Integer weeklyRemindId;
    private String content;
    private LocalDate startDate;
    private LocalDate endDate;
    private String imageUrl;

    @Builder
    private WeeklyRemindDto(Integer weeklyRemindId, String content
            , LocalDate startDate, LocalDate endDate, String imageUrl) {

        this.weeklyRemindId = weeklyRemindId;
        this.content = content;
        this.startDate = startDate;
        this.endDate = endDate;
        this.imageUrl = imageUrl;
    }
}
