package com.e203.recruiting.response;

import com.e203.global.entity.ProjectDomain;
import com.e203.recruiting.entity.BoardRecruiting;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Optional;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RecruitingPostResponseDto {

    private Integer postId;

    private Integer authorId;

    private String authorProfileImageUrl;

    private String authorName;

    private String postTitle;

    private String postContent;

    private Integer firstDomain;

    private Integer secondDomain;

    private Integer campus;

    private Integer memberTotal;

    private Integer infraLimit;

    @Setter
    private Integer infraCurrent;

    private Integer backendLimit;

    @Setter
    private Integer backendCurrent;

    private Integer frontLimit;

    @Setter
    private Integer frontCurrent;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    private Integer status;

    @Setter
    private Integer recruitedTotal;

    @Builder
    private RecruitingPostResponseDto(Integer postId, Integer authorId, String authorProfileImageUrl, String authorName,
                                      String postTitle, String postContent, Integer firstDomain, Integer secondDomain,
                                      Integer campus, Integer memberTotal, Integer infraLimit, Integer infraCurrent,
                                      Integer backendLimit, Integer backendCurrent, Integer frontLimit,
                                      Integer frontCurrent, LocalDateTime createdDate, LocalDateTime updatedDate,
                                      Integer status, Integer recruitedTotal) {
        this.postId = postId;
        this.authorId = authorId;
        this.authorProfileImageUrl = authorProfileImageUrl;
        this.authorName = authorName;
        this.postTitle = postTitle;
        this.postContent = postContent;
        this.firstDomain = firstDomain;
        this.secondDomain = secondDomain;
        this.campus = campus;
        this.memberTotal = memberTotal;
        this.infraLimit = infraLimit;
        this.infraCurrent = infraCurrent;
        this.backendLimit = backendLimit;
        this.backendCurrent = backendCurrent;
        this.frontLimit = frontLimit;
        this.frontCurrent = frontCurrent;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        this.status = status;
        this.recruitedTotal = recruitedTotal;
    }


    RecruitingPostResponseDto(BoardRecruiting recruiting) {
        this.postId = recruiting.getRecruitingId();
        this.authorId = recruiting.getAuthor().getUserId();
        this.authorProfileImageUrl = recruiting.getAuthor().getUserProfileImage();
        this.authorName = recruiting.getAuthor().getUserName();
        this.postTitle = recruiting.getTitle();
        this.postContent = recruiting.getContent();
        this.firstDomain = Optional.ofNullable(recruiting.getFirstDomain())
                .map(ProjectDomain::getProjectDomainId)
                .orElse(null);
        this.secondDomain = Optional.ofNullable(recruiting.getSecondDomain())
                .map(ProjectDomain::getProjectDomainId)
                .orElse(null);
        this.campus = recruiting.getCampus();
        this.memberTotal = recruiting.getMemberTotal();
        this.infraLimit = recruiting.getMemberInfra();
        this.backendLimit = recruiting.getMemberBackend();
        this.frontLimit = recruiting.getMemberFrontend();
        this.createdDate = recruiting.getCreatedAt();
        this.updatedDate = recruiting.getModifiedAt();
        this.status = recruiting.getStatus();
    }

    public static RecruitingPostResponseDto fromEntity(BoardRecruiting recruiting) {
        return RecruitingPostResponseDto.builder()
                .postId(recruiting.getRecruitingId())
                .authorId(recruiting.getAuthor().getUserId())
                .authorProfileImageUrl(recruiting.getAuthor().getUserProfileImage())
                .authorName(recruiting.getAuthor().getUserName())
                .postTitle(recruiting.getTitle())
                .postContent(recruiting.getContent())
                .firstDomain(Optional.ofNullable(recruiting.getFirstDomain())
                        .map(ProjectDomain::getProjectDomainId)
                        .orElse(null))
                .secondDomain(Optional.ofNullable(recruiting.getSecondDomain())
                        .map(ProjectDomain::getProjectDomainId)
                        .orElse(null))
                .campus(recruiting.getCampus())
                .memberTotal(recruiting.getMemberTotal())
                .infraLimit(recruiting.getMemberInfra())
                .backendLimit(recruiting.getMemberBackend())
                .frontLimit(recruiting.getMemberFrontend())
                .createdDate(recruiting.getCreatedAt())
                .updatedDate(recruiting.getModifiedAt())
                .status(recruiting.getStatus())
                .build();
    }
}
