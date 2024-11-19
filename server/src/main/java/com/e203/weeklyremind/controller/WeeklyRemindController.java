package com.e203.weeklyremind.controller;

import com.e203.jwt.JWTUtil;
import com.e203.weeklyremind.response.DevelopmentStoryResponseDto;
import com.e203.weeklyremind.request.WeeklyRemindRequestDto;
import com.e203.weeklyremind.response.WeeklyRemindResponseDto;
import com.e203.weeklyremind.service.WeeklyRemindService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import static org.springframework.http.HttpStatus.*;


@RestController
@RequiredArgsConstructor
public class WeeklyRemindController {

    private final WeeklyRemindService weeklyRemindService;

    private final JWTUtil jwtUtil;

    @PostMapping("/api/v1/projects/{projectId}/weekly-remind")
    public ResponseEntity<String> createWeeklyRemind(@RequestBody WeeklyRemindRequestDto message,
                                                     @PathVariable int projectId,
                                                     @RequestHeader("Authorization") String auth) {

        int userId = jwtUtil.getUserId(auth.substring(7));

        boolean isSucceed = weeklyRemindService.saveWeeklyRemind(userId, message, projectId);

        if (isSucceed) {
            return ResponseEntity.status(OK).body("주간 회고가 생성되었습니다.");
        } else {
            return ResponseEntity.status(BAD_REQUEST).body("잘못된 요청입니다.");
        }
    }

    @GetMapping("/api/v1/projects/{projectId}/weekly-remind")
    public ResponseEntity<List<WeeklyRemindResponseDto>> getWeeklyRemind(
            @PathVariable int projectId,
            @RequestParam(required = false) Integer projectMemberId,
            @RequestParam(required = false) LocalDate checkDate,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestHeader("Authorization") String auth) {

        int userId = jwtUtil.getUserId(auth.substring(7));

        List<WeeklyRemindResponseDto> weeklyRemindList =
                weeklyRemindService.searchWeeklyRemind(userId, projectId, projectMemberId, checkDate, startDate, endDate);

        if (weeklyRemindList == null) {
            return ResponseEntity.status(BAD_REQUEST).body(null);
        }

        return ResponseEntity.status(OK).body(weeklyRemindList);
    }

    @GetMapping("/api/v1/projects/development-story")
    public ResponseEntity<List<DevelopmentStoryResponseDto>> getDevelopmentStory(@RequestParam Integer userId,
                                                                                 @RequestHeader("Authorization") String auth) {

        if (!jwtUtil.isPermitted(userId, auth)) {
            return ResponseEntity.status(FORBIDDEN).body(null);
        }
        List<DevelopmentStoryResponseDto> result = weeklyRemindService.searchDevelopmentStory(userId);

        return ResponseEntity.status(OK).body(result);
    }

    @PutMapping("/api/v1/projects/{projectId}/weekly-remind/{weeklyRemindId}")
    public ResponseEntity<String> putWeeklyRemind(@PathVariable int projectId,
                                                  @PathVariable int weeklyRemindId,
                                                  @RequestBody WeeklyRemindRequestDto message,
                                                  @RequestHeader("Authorization") String auth) {

        int userId = jwtUtil.getUserId(auth.substring(7));
        String result = weeklyRemindService.editWeeklyRemind(userId, weeklyRemindId, projectId, message);

        return switch (result) {
            case "Not found" -> ResponseEntity.status(NOT_FOUND).body("주간회고가 존재하지 않습니다.");
            case "Not authorized" -> ResponseEntity.status(FORBIDDEN).body("권한이 없습니다.");
            default -> ResponseEntity.status(OK).body("주간회고가 새로 생성되었습니다.");
        };
    }

    @DeleteMapping("/api/v1/projects/{projectId}/weekly-remind/{weeklyRemindId}")
    public ResponseEntity<String> deleteWeeklyRemind(@PathVariable int weeklyRemindId,
                                                     @RequestHeader("Authorization") String auth) {

        int userId = jwtUtil.getUserId(auth.substring(7));
        String result = weeklyRemindService.deleteWeeklyRemind(userId, weeklyRemindId);

        return switch (result) {
            case "Not found" -> ResponseEntity.status(NOT_FOUND).body("주간 회고를 찾지 못했습니다.");
            case "Not authorized" -> ResponseEntity.status(FORBIDDEN).body("권한이 없습니다.");
            default -> ResponseEntity.status(OK).body("주간 회고 삭제에 성공했습니다.");
        };

    }

}
