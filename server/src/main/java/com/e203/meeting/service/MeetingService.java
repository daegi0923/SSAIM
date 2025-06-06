package com.e203.meeting.service;

import com.e203.global.utils.FileUploader;
import com.e203.meeting.entity.Meeting;
import com.e203.meeting.repository.MeetingRepository;
import com.e203.meeting.request.FixSpeakerNameRequestDto;
import com.e203.meeting.request.MeetingRequestDto;
import com.e203.meeting.response.*;
import com.e203.project.entity.Project;
import com.e203.project.repository.ProjectRepository;

import com.e203.global.utils.ChatAiService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MeetingService {

    private final NaverCloudClient naverCloudClient;
    private final MeetingRepository meetingRepository;
    private final ProjectRepository projectRepository;

    private final FileUploader fileUploader;
    private final ChatAiService chatAiService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<MeetingResponseDto> getMeetings(int projectId) {
        try {
            Project project = projectRepository.findById(projectId).orElse(null);

            if (project == null) {
                // Project가 없는 경우 빈 리스트 반환
                return new ArrayList<>();
            }

            List<Meeting> meetingList = meetingRepository.findByproject(project);
            List<MeetingResponseDto> meetingResponseDtoList = new ArrayList<>();

            for (Meeting meeting : meetingList) {
                try {
                    // JSON 문자열을 객체로 변환
                    SttResponseDto sttResponseDto = objectMapper.readValue(meeting.getMeetingVoiceScript(), SttResponseDto.class);

                    // 첫 번째 Segment의 text 값 가져오기
                    String firstText = sttResponseDto.getSegments().get(0).getText();

                    meetingResponseDtoList.add(MeetingResponseDto.builder()
                            .meetingId(meeting.getMeetingId())
                            .meetingTitle(meeting.getMeetingTitle())
                            .meetingFirstVoiceText(firstText)
                            .projectId(meeting.getProject().getId())
                            .meetingCreateTime(meeting.getCreatedAt())
                            .meetingVoiceTime(meeting.getMeetingVoiceTime())
                            .build());
                } catch (Exception e) {
                    // 특정 Meeting에서 오류가 발생한 경우 기본값으로 추가
                    meetingResponseDtoList.add(MeetingResponseDto.builder()
                            .meetingId(meeting.getMeetingId())
                            .meetingTitle(meeting.getMeetingTitle())
                            .meetingFirstVoiceText("오류로 인해 음성 텍스트를 불러올 수 없습니다.")
                            .projectId(meeting.getProject().getId())
                            .meetingCreateTime(meeting.getCreatedAt())
                            .meetingVoiceTime(meeting.getMeetingVoiceTime())
                            .build());
                }
            }

            return meetingResponseDtoList;
        } catch (Exception e) {
            // 전역 오류가 발생한 경우 빈 리스트 반환
            return new ArrayList<>();
        }
    }

    public OneMeetingResponseDto getMeeting(int meetingId) {
        try {
            Meeting meeting = meetingRepository.findById(meetingId).orElse(null);
            if (meeting == null) {
                return OneMeetingResponseDto.builder()
                        .meetingTitle("회의 정보를 찾을 수 없습니다.")
                        .build();  // meeting이 없을 경우 기본 메시지 반환
            }

            SttResponseDto sttResponseDto = objectMapper.readValue(meeting.getMeetingVoiceScript(), SttResponseDto.class);

            return OneMeetingResponseDto.builder()
                    .meetingCreateTime(meeting.getCreatedAt())
                    .projectId(meeting.getProject().getId())
                    .meetingId(meeting.getMeetingId())
                    .meetingTitle(meeting.getMeetingTitle())
                    .meetingVoiceUrl(meeting.getMeetingVoiceUrl())
                    .sttResponseDto(sttResponseDto)
                    .meetingVoiceTime(meeting.getMeetingVoiceTime()).build();
        } catch (Exception e) {
            // 예외가 발생했을 경우 기본값 반환
            return OneMeetingResponseDto.builder()
                    .meetingTitle("오류가 발생하여 회의 정보를 불러올 수 없습니다.")
                    .build();
        }
    }
    public MeetingIdResponseDto createMeeting(MeetingRequestDto meetingRequestDto, MultipartFile audiofile) throws Exception {

        Project project = projectRepository.findById(meetingRequestDto.getProjectId()).orElse(null);
        if (project == null) {
            return null;
        }

        String audioLink = fileUploader.upload(audiofile);

        // 클로버 AI 쓰는 부분
        NaverCloudClient.NestRequestEntity requestEntity = new NaverCloudClient.NestRequestEntity();
        //AI 결과물을 String으로 저장
        String upload = naverCloudClient.upload(audiofile, requestEntity);

        Meeting meeting = Meeting.builder()
                .meetingTitle(meetingRequestDto.getMeetingTitle())
                .meetingVoiceScript(upload)
                .meetingVoiceUrl(audioLink)
                .project(project)
                .meetingVoiceTime(getLastEndValue(upload)).build();

        Meeting save = meetingRepository.save(meeting);

        MeetingIdResponseDto meetingIdResponseDto = MeetingIdResponseDto.builder().meetingId(save.getMeetingId()).build();

        return meetingIdResponseDto;

    }

    @Transactional
    public boolean editMeetingSpeaker(List<FixSpeakerNameRequestDto> fixSpeakerNameRequestDtos, int meetingId) {

        Meeting meeting = meetingRepository.findById(meetingId).orElse(null);

        if (meeting == null) {
            return false;
        }

        String meetingScript = meeting.getMeetingVoiceScript();

        for(FixSpeakerNameRequestDto fixSpeakerNameRequestDto : fixSpeakerNameRequestDtos) {

            String meetingScript2 = meetingScript;
            meetingScript = updateSpeakerInJsonString(meetingScript2, fixSpeakerNameRequestDto);
        }
        meeting.updateMeetingVoiceScript(meetingScript);
        return true;
    }

    public MeetingSummaryResponseDto createMeetingSummary(int meetingId) throws Exception {
        Meeting meeting = meetingRepository.findById(meetingId).orElse(null);
        if (meeting == null) {
            return null;
        }

        JsonNode rootNode = objectMapper.readTree(meeting.getMeetingVoiceScript());
        TextNode textsNode = (TextNode) rootNode.path("text");

        String message = textsNode.asText();

        MeetingSummaryResponseDto meetingSummaryResponseDto = MeetingSummaryResponseDto.builder()
                .meetingSummary(chatAiService.generateMeetingSummary(message))
                .meetingId(meetingId).build();

        return meetingSummaryResponseDto;
    }

    @Transactional
    public boolean editMeetingTitle(int meetingId, String meetingTitle) {
        Meeting meeting = meetingRepository.findById(meetingId).orElse(null);
        if(meeting == null) {
            return false;
        }

        meeting.updateMeetingTitle(meetingTitle);
        return true;
    }

    @Transactional
    public boolean editMeetingScript(int meetingId, MeetingRequestDto requestDto) {
        Meeting meeting = meetingRepository.findById(meetingId).orElse(null);

        if (meeting == null) {
            return false;
        }

        String meetingScript = meeting.getMeetingVoiceScript();

        String result = updateScriptInJsonString(meetingScript, requestDto);
        meeting.updateMeetingVoiceScript(result);

        return true;
    }

    public boolean deleteMeeting(int meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId).orElse(null);
        if (meeting == null) {
            return false;
        }

        meetingRepository.delete(meeting);

        return true;
    }

    // 음성 길이 반환(초 단위)
    private int getLastEndValue(String jsonString) {
        try {
            // JSON 문자열을 JsonNode로 파싱
            JsonNode rootNode = objectMapper.readTree(jsonString);

            // segments 배열 접근
            JsonNode segmentsNode = rootNode.path("segments");
            if (segmentsNode.isArray() && segmentsNode.size() > 0) {
                // 마지막 segment의 end 값 가져오기
                return segmentsNode.get(segmentsNode.size() - 1).path("end").asInt() / 1000;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // segments가 없거나 오류 발생 시 -1 반환
        return -1;
    }

    private String updateSpeakerInJsonString(String jsonString, FixSpeakerNameRequestDto fixSpeakerNameRequestDto) {
        try {
            // JSON 문자열을 JsonNode로 파싱
            JsonNode rootNode = objectMapper.readTree(jsonString);

            // speakers 배열 접근
            ArrayNode speakersNode = (ArrayNode) rootNode.path("speakers");
            ArrayNode segmentsNode = (ArrayNode) rootNode.path("segments");

            // label에 맞는 speaker의 name을 변경하고 edited를 true로 설정
            for (JsonNode speakerNode : speakersNode) {
                if (speakerNode.path("label").asText().equals(fixSpeakerNameRequestDto.getLabel())) {
                    ((ObjectNode) speakerNode).put("name", fixSpeakerNameRequestDto.getName());
                    ((ObjectNode) speakerNode).put("edited", true);
                }
            }

            for (JsonNode segmentNode : segmentsNode) {
                JsonNode speakerNode = segmentNode.path("speaker");

                // speaker가 존재하고, label이 일치하는 경우 name과 edited를 수정
                if (speakerNode.isObject() && speakerNode.path("label").asText().equals(fixSpeakerNameRequestDto.getLabel())) {
                    ((ObjectNode) speakerNode).put("name", fixSpeakerNameRequestDto.getName());
                    ((ObjectNode) speakerNode).put("edited", true);
                }
            }

            // 수정된 JsonNode를 다시 JSON 문자열로 변환
            return objectMapper.writeValueAsString(rootNode);

        } catch (Exception e) {
            e.printStackTrace();
            return jsonString;  // 오류 발생 시 원래 문자열 반환
        }
    }

    private String updateScriptInJsonString(String jsonString, MeetingRequestDto requestDto) {
        try {
            // JSON 문자열을 JsonNode로 파싱
            JsonNode rootNode = objectMapper.readTree(jsonString);

            // segments 배열 접근
            ArrayNode segmentsNode = (ArrayNode) rootNode.path("segments");

            for (JsonNode segmentNode : segmentsNode) {
                if(segmentNode.path("start").asText().equals(requestDto.getStart())) {
                    ((ObjectNode) segmentNode).put("text", requestDto.getScript());
                }
            }

            // 수정된 JsonNode를 다시 JSON 문자열로 변환
            return objectMapper.writeValueAsString(rootNode);

        } catch (Exception e) {
            e.printStackTrace();
            return jsonString;  // 오류 발생 시 원래 문자열 반환
        }
    }


}
