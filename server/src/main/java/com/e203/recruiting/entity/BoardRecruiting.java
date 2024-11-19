package com.e203.recruiting.entity;

import com.e203.global.entity.BaseEntity;
import com.e203.global.entity.ProjectDomain;
import com.e203.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@Table(name = "board_recruiting")
public class BoardRecruiting extends BaseEntity {

    @Id
    @Column(name = "board_recruiting_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int recruitingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_recruiting_author", nullable = false)
    private User author;

    @Setter
    @Column(name = "board_recruiting_title")
    private String title;

    @Setter
    @Column(name = "board_recruiting_content")
    private String content;

    @Setter
    @Column(name = "board_recruiting_start_date")
    private LocalDate startDate;

    @Setter
    @Column(name = "board_recruiting_end_date")
    private LocalDate endDate;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_recruiting_first_domain")
    private ProjectDomain firstDomain;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_recruiting_second_domain")
    private ProjectDomain secondDomain;

    @Setter
    @Column(name = "board_recruiting_campus")
    private Integer campus;

    @Setter
    @Column(name = "board_recruiting_member_total")
    private Integer memberTotal;

    @Setter
    @Column(name = "board_recruiting_member_infra")
    private Integer memberInfra;

    @Setter
    @Column(name = "board_recruiting_member_backend")
    private Integer memberBackend;

    @Setter
    @Column(name = "board_recruiting_member_frontend")
    private Integer memberFrontend;

    @Setter
    @Column(name = "board_recruiting_status")
    @ColumnDefault("1")
    private Integer status = 1;

    @Setter
    @OneToMany(mappedBy = "boardRecruiting", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RecruitingMember> recruitingMembers;

    @Builder
    private BoardRecruiting(User author, String title, String content, LocalDate startDate, LocalDate endDate,
                            ProjectDomain firstDomain, ProjectDomain secondDomain, Integer campus, Integer memberTotal,
                            Integer memberInfra, Integer memberBackend, Integer memberFrontend) {
        this.author = author;
        this.title = title;
        this.content = content;
        this.startDate = startDate;
        this.endDate = endDate;
        this.firstDomain = firstDomain;
        this.secondDomain = secondDomain;
        this.campus = campus;
        this.memberTotal = memberTotal;
        this.memberInfra = memberInfra;
        this.memberBackend = memberBackend;
        this.memberFrontend = memberFrontend;
    }
}
