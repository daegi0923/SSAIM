package com.e203.user.controller;

import com.e203.jwt.JWTUtil;
import com.e203.user.request.UserEditInfoDto;
import com.e203.user.request.UserSignUpRequestDto;
import com.e203.user.response.UserInfoResponseDto;
import com.e203.user.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
public class UserController {

    private final UserService userService;

    private final JWTUtil jwtUtil;

    @PostMapping("/api/v1/users")
    public ResponseEntity<String> signUp(@RequestPart("userInfo") UserSignUpRequestDto userSignUpRequestDto,
                                         @RequestPart(value = "userProfileImage", required = false) MultipartFile profileImage) {
        boolean isSucceed = userService.createUser(userSignUpRequestDto, profileImage);
        if (isSucceed) {
            return ResponseEntity.status(200).body("회원가입이 완료되었습니다.");
        } else {
            return ResponseEntity.status(200).body("이미 가입한 이메일입니다.");
        }
    }

    @PatchMapping("/api/v1/users/{userId}")
    public ResponseEntity<String> editInfo(@PathVariable int userId, @RequestPart("userInfo") UserEditInfoDto dto,
                                           @RequestPart(value = "userProfileImage", required = false) MultipartFile profileImage,
                                           @RequestHeader("Authorization") String authToken) {
        if (!jwtUtil.isPermitted(userId, authToken)) {
            return ResponseEntity.status(403).body("권한이 없습니다.");
        }

        userService.modifyInfo(userId, dto, profileImage);
        return ResponseEntity.status(200).body("회원 정보 수정이 완료되었습니다.");
    }

    @GetMapping("/api/v1/users/{userId}")
    public ResponseEntity<UserInfoResponseDto> lookUp(@PathVariable int userId) {
        UserInfoResponseDto dto = userService.getUserInfo(userId);
        if (dto == null) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.status(200).body(dto);
    }

    @GetMapping("/api/v1/users")
    public ResponseEntity<List<UserInfoResponseDto>> searchUsers(
            @RequestParam(required = false) String userName,
            @RequestParam(required = false) String userEmail,
            @RequestParam(required = false) Integer userClass,
            @RequestParam(required = false) Integer userCampus,
            @RequestParam(required = false) Integer userGeneration,
            @RequestParam(required = false) String userNickname,
            @RequestParam(required = false) Integer userRole,
            @RequestParam(required = false) LocalDate userBirth,
            @RequestParam(required = false) Integer userGender) {

        List<UserInfoResponseDto> dtos = userService.searchUsers(userName, userEmail, userClass, userCampus,
                userGeneration, userNickname, userRole, userBirth, userGender);

        return ResponseEntity.status(200).body(dtos);
    }

    @GetMapping("/api/v1/users/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        return ResponseEntity.status(OK).body(userService.checkEmail(email));
    }

}
