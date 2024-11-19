package com.e203.recruiting.request;

import com.e203.global.entity.ProjectDomain;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecruitingWriteRequestDto {

    private Integer author;

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

    private Integer position;
}
