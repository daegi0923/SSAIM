package com.e203.recruiting.response;

import com.e203.recruiting.entity.RecruitingMember;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecruitingCandidateResponseDto extends RecruitingMemberResponseDto {

    private String message;

    private int status;

    private RecruitingCandidateResponseDto(RecruitingMember member, String message, int status) {
        super(member);
        this.message = message;
        this.status = status;
    }

    public static RecruitingCandidateResponseDto fromEntity(RecruitingMember member) {
        return new RecruitingCandidateResponseDto(
                member,
                member.getMessage(),
                member.getStatus()
        );

    }
}
