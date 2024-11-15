package com.e203.dailyremind.controller;

import com.e203.dailyremind.request.DailyRemindRequestDto;
import com.e203.dailyremind.response.DailyRemindResponseDto;
import com.e203.dailyremind.service.DailyRemindService;
import com.e203.jwt.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
public class DailyRemindController {

    private final DailyRemindService dailyRemindService;

    private final JWTUtil jwtUtil;

    @PutMapping("/api/v1/projects/{projectId}/daily-remind/{dailyRemindId}")
    public ResponseEntity<String> editDailyRemind(@RequestBody DailyRemindRequestDto dailyRemindRequestDto,
                                                  @PathVariable("dailyRemindId") int dailyRemindId,
                                                  @RequestHeader("Authorization") String auth) {

        int userId = jwtUtil.getUserId(auth.substring(7));

        String result = dailyRemindService.putDailyRemind(userId, dailyRemindRequestDto, dailyRemindId);

        return switch (result) {
            case "Not found" -> ResponseEntity.status(NOT_FOUND).body("일일회고를 찾을 수 없습니다.");
            case "Not authorized" -> ResponseEntity.status(FORBIDDEN).body("권한이 없습니다.");
            default -> ResponseEntity.status(OK).body("일일회고가 수정되었습니다.");
        };
    }

    @PostMapping("/api/v1/projects/{projectId}/daily-remind")
    public ResponseEntity<String> addDailyRemind(@PathVariable("projectId") int projectId,
                                                 @RequestBody DailyRemindRequestDto requestDto,
                                                 @RequestHeader("Authorization") String auth) {

        int userId = jwtUtil.getUserId(auth.substring(7));

        String result = dailyRemindService.saveDailyRemind(userId, requestDto, projectId);

        return switch (result) {
            case "Not found" -> ResponseEntity.status(NOT_FOUND).body("프로젝트를 찾을 수 없습니다.");
            case "Not authorized" -> ResponseEntity.status(FORBIDDEN).body("권한이 없습니다.");
            default -> ResponseEntity.status(OK).body("일일회고 작성이 완료되었습니다.");
        };
    }

    @GetMapping("/api/v1/projects/{projectId}/daily-remind")
    public ResponseEntity<List<DailyRemindResponseDto>> getDailyRemind(
            @PathVariable("projectId") int projectId,
            @RequestParam(required = false) Integer projectMemberId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestHeader("Authorization") String auth) {

        int userId = jwtUtil.getUserId(auth.substring(7));

        List<DailyRemindResponseDto> results
                = dailyRemindService.searchDailyRemind(userId, projectId, projectMemberId, startDate, endDate);

        if (results == null) {
            return ResponseEntity.status(FORBIDDEN).body(null);
        }

        return ResponseEntity.status(OK).body(results);
    }

    @DeleteMapping("/api/v1/projects/{projectId}/daily-remind/{dailyRemindId}")
    public ResponseEntity<String> deleteDailyRemind(@PathVariable("dailyRemindId") int dailyRemindId,
                                                    @RequestHeader("Authorization") String auth) {

        int userId = jwtUtil.getUserId(auth.substring(7));

        String result = dailyRemindService.deleteDailyRemind(userId, dailyRemindId);

        return switch (result) {
            case "Not found" -> ResponseEntity.status(NOT_FOUND).body("일일회고를 찾을 수 없습니다.");
            case "Not authorized" -> ResponseEntity.status(FORBIDDEN).body("권한이 없습니다.");
            default -> ResponseEntity.status(OK).body("일일회고가 삭제되었습니다.");
        };
    }

}

