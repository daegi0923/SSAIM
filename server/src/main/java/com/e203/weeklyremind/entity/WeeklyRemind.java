package com.e203.weeklyremind.entity;

import com.e203.global.entity.BaseEntity;
import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "weekly_remind")
public class WeeklyRemind extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "weekly_remind_id")
    private int weeklyRemindId;

    @Lob
    @Column(columnDefinition = "TEXT", name = "weekly_remind_contents")
    private String weeklyRemindContents;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Project projectId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weekly_remind_author")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ProjectMember weeklyRemindAuthor;

    @Column(name = "weekly_remind_start_date")
    private LocalDate weeklyRemindStartDate;

    @Column(name = "weekly_remind_end_date")
    private LocalDate weeklyRemindEndDate;

    @Column(name = "weekly_remind_image")
    private String weeklyRemindImage;

    @Builder
    private WeeklyRemind(String weeklyRemindContents, Project projectId, ProjectMember weeklyRemindAuthor
    , LocalDate weeklyRemindStartDate, LocalDate weeklyRemindEndDate, String weeklyRemindImage) {
        this.weeklyRemindContents = weeklyRemindContents;
        this.projectId = projectId;
        this.weeklyRemindAuthor = weeklyRemindAuthor;
        this.weeklyRemindStartDate = weeklyRemindStartDate;
        this.weeklyRemindEndDate = weeklyRemindEndDate;
        this.weeklyRemindImage = weeklyRemindImage;
    }

    public void updateWeeklyRemind(String contents) {
        this.weeklyRemindContents = contents;
    }

    public void updateWeeklyRemindImg(String image) { this.weeklyRemindImage = image; }

}
