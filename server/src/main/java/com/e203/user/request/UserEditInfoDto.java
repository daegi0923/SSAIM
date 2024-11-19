package com.e203.user.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserEditInfoDto {

    private String userName;

    private String userPw;

    private String userEmail;

    private Integer userClass;

    private Integer userCampus;

    private Integer userGeneration;

    private String userNickname;

    private String userProfileMessage;

    private String userSkills;

    private LocalDate userBirth;

    private Integer userGender;

    private String userPhone;


}
