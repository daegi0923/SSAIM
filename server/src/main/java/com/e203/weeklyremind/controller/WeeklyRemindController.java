package com.e203.weeklyremind.controller;

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

    @PostMapping("/api/v1/projects/{projectId}/weekly-remind")
    public ResponseEntity<String> createWeeklyRemind(@RequestBody WeeklyRemindRequestDto message, @PathVariable int projectId) {

        boolean isSucceed = weeklyRemindService.saveWeeklyRemind(message, projectId);

        if(isSucceed) {
            return ResponseEntity.status(OK).body("주간 회고가 생성되었습니다.");
        }
        else {
            return ResponseEntity.status(OK).body("주간 회고가 생성되지 않았습니다.");
        }
    }

    @GetMapping("/api/v1/projects/{projectId}/weekly-remind")
    public ResponseEntity<List<WeeklyRemindResponseDto>> getWeeklyRemind(
            @PathVariable int projectId,
            @RequestParam(required = false) Integer projectMemberId,
            @RequestParam(required = false) LocalDate checkDate,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate){

        List<WeeklyRemindResponseDto> weeklyRemindList = weeklyRemindService.searchWeeklyRemind(projectId, projectMemberId,
                checkDate, startDate, endDate);

        return ResponseEntity.status(OK).body(weeklyRemindList);
    }

    @GetMapping("/api/v1/projects/development-story")
    public ResponseEntity<List<DevelopmentStoryResponseDto>> getDevelopmentStory(
            @RequestParam(required = false) Integer userId) {

        List<DevelopmentStoryResponseDto>result = weeklyRemindService.searchDevelopmentStory(userId);

        if(result == null) {
            return ResponseEntity.status(FORBIDDEN).body(null);
        }

        return ResponseEntity.status(OK).body(result);
    }

    @PutMapping("/api/v1/projects/{projectId}/weekly-remind/{weeklyRemindId}")
    public ResponseEntity<String> putWeeklyRemind(@PathVariable int projectId
    , @PathVariable int weeklyRemindId, @RequestBody WeeklyRemindRequestDto message) {

        boolean result = weeklyRemindService.editWeeklyRemind(weeklyRemindId,
                projectId, message);

        if(!result) {
            return ResponseEntity.status(NOT_FOUND).body("주간회고가 존재하지 않습니다.");
        }
        else {
            return ResponseEntity.status(OK).body("주간회고가 새로 생성되었습니다.");
        }
    }

    @DeleteMapping("/api/v1/projects/{projectId}/weekly-remind/{weeklyRemindId}")
    public ResponseEntity<String> deleteWeeklyRemind(@PathVariable int weeklyRemindId) {
        boolean result = weeklyRemindService.deleteWeeklyRemind(weeklyRemindId);

        if(!result) {
            return ResponseEntity.status(NOT_FOUND).body("주간 회고를 찾지 못했습니다.");
        }

        return ResponseEntity.status(OK).body("주간 회고 삭제에 성공했습니다.");
    }

}
