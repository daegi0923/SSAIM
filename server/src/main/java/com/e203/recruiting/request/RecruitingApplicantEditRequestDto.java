package com.e203.recruiting.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecruitingApplicantEditRequestDto {

    private Integer status;

    private String message;

    private Integer position;

}
