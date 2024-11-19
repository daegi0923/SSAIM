package com.e203.user.request;

import com.e203.user.entity.User;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserSignUpRequestDto {

    private String userEmail;

    private String userName;

    private String userPw;

    private String userNickname;

    private String userPhone;

    private int userGender;

    private int userGeneration;

    private int userClass;

    private int userCampus;

    private LocalDate userBirth;

}
