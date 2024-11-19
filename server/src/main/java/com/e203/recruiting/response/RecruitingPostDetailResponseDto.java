package com.e203.recruiting.response;

import com.e203.recruiting.entity.BoardRecruiting;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecruitingPostDetailResponseDto extends RecruitingPostResponseDto {

    private LocalDate startDate;

    private LocalDate endDate;

    @Setter
    private int candidateCount;

    private List<RecruitingMemberResponseDto> recruitingMembers;

    private List<RecruitingCandidateResponseDto> recruitingCandidates;

    private RecruitingPostDetailResponseDto(BoardRecruiting recruiting, LocalDate startDate, LocalDate endDate,
                                            List<RecruitingMemberResponseDto> recruitingMembers,
                                            List<RecruitingCandidateResponseDto> recruitingCandidates) {
        super(recruiting);
        this.startDate = startDate;
        this.endDate = endDate;
        this.recruitingMembers = recruitingMembers;
        this.recruitingCandidates = recruitingCandidates;
    }

    public static RecruitingPostDetailResponseDto fromEntity(BoardRecruiting recruiting,
                                                             List<RecruitingMemberResponseDto> recruitingMembers,
                                                             List<RecruitingCandidateResponseDto> recruitingCandidates) {
        return new RecruitingPostDetailResponseDto(
                recruiting,
                recruiting.getStartDate(),
                recruiting.getEndDate(),
                recruitingMembers,
                recruitingCandidates
        );
    }
}
