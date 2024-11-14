package com.e203.recruiting.response;


import com.e203.recruiting.entity.RecruitingMember;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RecruitingApplyResponseDto {

    private Integer applicantId;

    private Integer recruitingId;

    private String recruitingTitle;

    private Integer firstDomain;

    private Integer secondDomain;

    private Integer position;

    private Integer status;

    @Builder
    private RecruitingApplyResponseDto(Integer applicantId, Integer recruitingId, String recruitingTitle,
                                       Integer firstDomain, Integer secondDomain,
                                       Integer position, Integer status) {
        this.applicantId = applicantId;
        this.recruitingId = recruitingId;
        this.recruitingTitle = recruitingTitle;
        this.firstDomain = firstDomain;
        this.secondDomain = secondDomain;
        this.position = position;
        this.status = status;
    }

    public static RecruitingApplyResponseDto fromEntity(RecruitingMember member) {
        return RecruitingApplyResponseDto.builder()
                .applicantId(member.getId())
                .recruitingId(member.getBoardRecruiting().getRecruitingId())
                .recruitingTitle(member.getBoardRecruiting().getTitle())
                .firstDomain(member.getBoardRecruiting().getFirstDomain() != null ?
                        member.getBoardRecruiting().getFirstDomain().getProjectDomainId() : null)
                .secondDomain(member.getBoardRecruiting().getSecondDomain() != null ?
                        member.getBoardRecruiting().getSecondDomain().getProjectDomainId() : null)
                .position(member.getPosition())
                .status(member.getStatus())
                .build();
    }
}
