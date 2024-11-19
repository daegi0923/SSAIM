package com.e203.dailyremind.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class DailyRemindRequestDto {

    private int projectMemberId;
    private String dailyRemindContents;
    private int dailyRemindId;
    private LocalDate dailyRemindDate;

    @Builder
    private DailyRemindRequestDto(int projectMemberId, String dailyRemindContents, int dailyRemindId
    , LocalDate dailyRemindDate) {
        this.projectMemberId = projectMemberId;
        this.dailyRemindContents = dailyRemindContents;
        this.dailyRemindId = dailyRemindId;
        this.dailyRemindDate = dailyRemindDate;
    }
}
