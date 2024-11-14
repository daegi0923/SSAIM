package com.e203.dailyremind.service;

import com.e203.dailyremind.entity.DailyRemind;
import com.e203.dailyremind.repository.DailyRemindRepository;
import com.e203.dailyremind.request.DailyRemindRequestDto;
import com.e203.dailyremind.response.DailyRemindResponseDto;
import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import com.e203.project.repository.ProjectMemberRepository;
import com.e203.project.repository.ProjectRepository;
import com.e203.user.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor(access = AccessLevel.PROTECTED)
@Slf4j
public class DailyRemindService {

    private final DailyRemindRepository dailyRemindRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public boolean saveDailyRemind(DailyRemindRequestDto requestDto, int projectId) {

        log.info("projectId: {}", projectId);

        Project project = projectRepository.findById(projectId).orElse(null);
        ProjectMember projectMember = projectMemberRepository.findById(requestDto.getProjectMemberId()).orElse(null);

        if (projectMember == null) {
            return false;
        }

        DailyRemind dailyRemind = DailyRemind.builder()
                .dailyRemindAuthor(projectMember)
                .dailyRemindContents(requestDto.getDailyRemindContents())
                .project(project)
                .dailyRemindDate(requestDto.getDailyRemindDate()).build();

        dailyRemindRepository.save(dailyRemind);

        return true;
    }

    public List<DailyRemindResponseDto> searchDailyRemind(Integer projectId, Integer projectMemberId
    , LocalDate startDate, LocalDate endDate) {


        List<DailyRemind> dailyRemindList = dailyRemindRepository.searchDailyReminds(projectMemberId
        , startDate, endDate, projectId);
        List<DailyRemindResponseDto> dailyRemindResponseDtoList = new ArrayList<>();


        for (DailyRemind dailyRemind : dailyRemindList) {
            dailyRemindResponseDtoList.add(DailyRemindResponseDto.builder()
                    .projectMemberId(dailyRemind.getDailyRemindAuthor().getId())
                    .message(dailyRemind.getDailyRemindContents())
                    .projectId(dailyRemind.getProjectId().getId())
                    .username(dailyRemind.getDailyRemindAuthor().getUser().getUserName())
                    .dailyRemindId(dailyRemind.getDailyRemindId())
                    .userId(dailyRemind.getDailyRemindAuthor().getUser().getUserId())
                    .dailyRemindDate(dailyRemind.getDailyRemindDate())
                    .userImage(dailyRemind.getDailyRemindAuthor().getUser().getUserProfileImage())
                    .build());
        }

        return dailyRemindResponseDtoList;
    }

    public List<DailyRemindResponseDto> searchTeamDailyRemind(int projectId) {

        Project project = projectRepository.findById(projectId).get();

        List<DailyRemind> dailyRemindList = dailyRemindRepository.findByProjectId(project);
        List<DailyRemindResponseDto> dailyRemindResponseDtoList = new ArrayList<>();

        for (DailyRemind dailyRemind : dailyRemindList) {
            dailyRemindResponseDtoList.add(DailyRemindResponseDto.builder()
                    .projectMemberId(dailyRemind.getDailyRemindAuthor().getId())
                    .message(dailyRemind.getDailyRemindContents())
                    .projectId(dailyRemind.getProjectId().getId())
                    .username(dailyRemind.getDailyRemindAuthor().getUser().getUserName())
                    .dailyRemindId(dailyRemind.getDailyRemindId())
                    .userId(dailyRemind.getDailyRemindAuthor().getUser().getUserId())
                    .build());
        }

        return dailyRemindResponseDtoList;
    }

    @Transactional
    public boolean putDailyRemind(DailyRemindRequestDto requestDto, int dailyRemindId) {
        DailyRemind dailyRemind = dailyRemindRepository.findById(dailyRemindId).orElse(null);

        if (dailyRemind == null) {
            return false;
        }

        dailyRemind.updateDailyRemind(requestDto.getDailyRemindContents());

        return true;
    }

    public boolean deleteDailyRemind(int dailyRemindId) {
        DailyRemind dailyRemind = dailyRemindRepository.findById(dailyRemindId).orElse(null);

        if (dailyRemind == null) {
            return false;
        }

        dailyRemindRepository.delete(dailyRemind);

        return true;
    }
}
