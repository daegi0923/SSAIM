package com.e203.user.response;

import com.e203.user.entity.User;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class UserInfoResponseDto {

    private int userId;

    private String userName;

    private String userEmail;

    private int userClass;

    private int userCampus;

    private int userGeneration;

    private String userNickname;

    private String userProfileMessage;

    private String userSkills;

    private int userRole;

    private LocalDate userBirth;

    private int userGender;

    private String userPhone;

    private String userProfileImage;

    @Builder
    private UserInfoResponseDto(int userId, String userName, String userEmail, int userClass, int userCampus, int userGeneration, String userNickname, String userProfileMessage, String userSkills, int userRole, LocalDate userBirth, int userGender, String userPhone, String userProfileImage) {
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.userClass = userClass;
        this.userCampus = userCampus;
        this.userGeneration = userGeneration;
        this.userNickname = userNickname;
        this.userProfileMessage = userProfileMessage;
        this.userSkills = userSkills;
        this.userRole = userRole;
        this.userBirth = userBirth;
        this.userGender = userGender;
        this.userPhone = userPhone;
        this.userProfileImage = userProfileImage;
    }

    public static UserInfoResponseDto fromEntity(User user) {
        return UserInfoResponseDto.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .userEmail(user.getUserEmail())
                .userClass(user.getUserClass())
                .userCampus(user.getUserCampus())
                .userGeneration(user.getUserGeneration())
                .userNickname(user.getUserNickname())
                .userProfileMessage(user.getUserProfileMessage())
                .userSkills(user.getUserSkills())
                .userRole(user.getUserRole())
                .userBirth(user.getUserBirth())
                .userGender(user.getUserGender())
                .userPhone(user.getUserPhone())
                .userProfileImage(user.getUserProfileImage())
                .build();
    }
}
