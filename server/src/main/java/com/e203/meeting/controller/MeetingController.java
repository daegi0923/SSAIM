package com.e203.meeting.controller;

import com.e203.meeting.request.FixSpeakerNameRequestDto;
import com.e203.meeting.request.MeetingRequestDto;
import com.e203.meeting.response.MeetingIdResponseDto;
import com.e203.meeting.response.MeetingResponseDto;
import com.e203.meeting.response.MeetingSummaryResponseDto;
import com.e203.meeting.response.OneMeetingResponseDto;
import com.e203.meeting.service.MeetingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;

    @GetMapping("/api/v1/projects/{projectId}/meetings")
    public ResponseEntity<List<MeetingResponseDto>> getMeetings(@PathVariable("projectId") int projectId) throws Exception{

        List<MeetingResponseDto> result = meetingService.getMeetings(projectId);

        if (result.isEmpty()) {
            return ResponseEntity.status(BAD_REQUEST).body(null);
        }

        return ResponseEntity.status(OK).body(result);
    }

    @GetMapping("/api/v1/projects/{projectId}/meetings/{meetingId}")
    public ResponseEntity<OneMeetingResponseDto> getMeeting(@PathVariable("meetingId") int meetingId) throws Exception {

        OneMeetingResponseDto result = meetingService.getMeeting(meetingId);
        if (result.getMeetingTitle().equals("회의 정보를 찾을 수 없습니다.")) {
            return ResponseEntity.status(NOT_FOUND).body(result);
        }
        else if(result.getMeetingTitle().equals("오류가 발생하여 회의 정보를 불러올 수 없습니다.")) {
            return ResponseEntity.status(BAD_REQUEST).body(result);
        }

        return ResponseEntity.status(OK).body(result);

    }

    @PostMapping("/api/v1/projects/{projectId}/meetings")
    public ResponseEntity<MeetingIdResponseDto> createMeeting(@RequestPart("audiofile") MultipartFile audiofile
                                                        , @RequestPart("meetingRequestDto") MeetingRequestDto meetingRequestDto) throws Exception {
        MeetingIdResponseDto result = meetingService.createMeeting(meetingRequestDto, audiofile);

        if (result == null) {
            return ResponseEntity.status(FORBIDDEN).body(result);
        }
        else {
            return ResponseEntity.status(OK).body(result);
        }
    }

    @PutMapping("/api/v1/projects/{projectId}/meetings/{meetingId}/speaker")
    public ResponseEntity<String> putMeetingSpeaker(@RequestBody List<FixSpeakerNameRequestDto> fixSpeakerNameRequestDtos
        , @PathVariable("meetingId") int meetingId) throws Exception {

        boolean result = meetingService.editMeetingSpeaker(fixSpeakerNameRequestDtos, meetingId);

        if (!result) {
            return ResponseEntity.status(NOT_FOUND).body("수정에 실패했습니다.");
        }
        else {
            return ResponseEntity.status(OK).body("수정에 성공했습니다.");
        }
    }

    @PostMapping("/api/v1/projects/{projectId}/meetings/{meetingId}")
    public ResponseEntity<MeetingSummaryResponseDto> createMeetingSummary(@PathVariable("meetingId") int meetingId) throws Exception {

        MeetingSummaryResponseDto meetingSummary = meetingService.createMeetingSummary(meetingId);

        if(meetingSummary == null) {
            return ResponseEntity.status(NOT_FOUND).body(null);
        }
        else {
            return ResponseEntity.status(OK).body(meetingSummary);
        }
    }

    @PutMapping("/api/v1/projects/{projectId}/meetings/{meetingId}")
    public ResponseEntity<String> putMeetingTitle(@PathVariable("meetingId") int meetingId
            , @RequestBody MeetingRequestDto meetingRequestDto) {

        System.out.println("제발");

        boolean result = meetingService.editMeetingTitle(meetingId, meetingRequestDto.getMeetingTitle());

        if(!result) {
            return ResponseEntity.status(NOT_FOUND).body("회의 목록을 찾을 수 없습니다.");
        }

        return ResponseEntity.status(OK).body("타이틀 수정이 완료되었습니다.");
    }

    @PutMapping("/api/v1/projects/{projectId}/meetings/{meetingId}/script")
    public ResponseEntity<String> putMeetingScript(@PathVariable("meetingId") int meetingId
            , @RequestBody MeetingRequestDto meetingRequestDto) {

        boolean result = meetingService.editMeetingScript(meetingId, meetingRequestDto);

        if(!result) {
            return ResponseEntity.status(NOT_FOUND).body("회의 목록을 찾을 수 없습니다.");
        }

        return ResponseEntity.status(OK).body("스크립트 수정이 완료되었습니다.");
    }

    @DeleteMapping("/api/v1/projects/{projectId}/meetings/{meetingId}")
    public ResponseEntity<String> deleteMeeting(@PathVariable("meetingId") int meetingId) {

        boolean result = meetingService.deleteMeeting(meetingId);
        if(!result) {
            return ResponseEntity.status(NOT_FOUND).body("회의 목록을 찾을 수 없습니다.");
        }

        return ResponseEntity.status(OK).body("삭제 되었습니다.");
    }
}