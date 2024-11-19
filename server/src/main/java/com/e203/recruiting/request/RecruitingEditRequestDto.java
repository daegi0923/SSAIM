package com.e203.recruiting.request;


import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecruitingEditRequestDto {

    private String title;

    private String content;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer firstDomain;

    private Integer secondDomain;

    private Integer campus;

    private Integer memberTotal;

    private Integer memberInfra;

    private Integer memberBackend;

    private Integer memberFrontend;

    private List<RecruitingMemberEditRequestDto> recruitingMembers;

}
