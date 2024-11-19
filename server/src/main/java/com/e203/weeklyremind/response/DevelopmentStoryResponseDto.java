package com.e203.weeklyremind.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DevelopmentStoryResponseDto {

    private Integer projectMemberId;
    private Integer projectId;
    private String username;
    private String userImage;
    private Integer userId;
    private String projectName;
    private LocalDate projectStartDate;
    private LocalDate projectEndDate;
    private List<WeeklyRemindDto> weeklyRemind;  // List로 변경

    @Builder
    public DevelopmentStoryResponseDto(Integer projectMemberId, Integer projectId, String username,
                                       String userImage, Integer userId, List<WeeklyRemindDto> weeklyRemind,
                                       String projectName, LocalDate projectStartDate, LocalDate projectEndDate) {
        this.projectMemberId = projectMemberId;
        this.projectId = projectId;
        this.username = username;
        this.userImage = userImage;
        this.userId = userId;
        this.weeklyRemind = weeklyRemind;
        this.projectName = projectName;
        this.projectStartDate = projectStartDate;
        this.projectEndDate = projectEndDate;
    }
}
