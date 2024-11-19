package com.e203.recruiting.request;


import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RecruitingApplyRequestDto {

    private Integer userId;

    private Integer position;

    private String message;

}
