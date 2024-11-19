package com.e203.weeklyremind.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class WeeklyRemindRequestDto {

    private Integer projectMemberId;
    private LocalDate startDate;
    private LocalDate endDate;

    @Builder
    private WeeklyRemindRequestDto(Integer projectMemberId
            , LocalDate startDate, LocalDate endDate) {
        this.projectMemberId = projectMemberId;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
