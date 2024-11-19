package com.e203.recruiting.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecruitingMemberEditRequestDto {

    private Integer userId;

    private Integer position;

    private boolean delete;

}
