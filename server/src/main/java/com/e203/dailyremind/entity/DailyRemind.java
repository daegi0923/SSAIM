package com.e203.dailyremind.entity;

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
@Table(name = "daily_remind")
public class DailyRemind extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "daily_remind_id")
    private int dailyRemindId;

    @Lob
    @Column(columnDefinition = "TEXT", name = "daily_remind_contents")
    private String dailyRemindContents;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "daily_remind_author")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ProjectMember dailyRemindAuthor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Project projectId;

    @Column(name = "daily_remind_date")
    private LocalDate dailyRemindDate;

    @Builder
    private DailyRemind(Project project, ProjectMember dailyRemindAuthor, String dailyRemindContents
    , LocalDate dailyRemindDate) {
        this.dailyRemindAuthor = dailyRemindAuthor;
        this.projectId = project;
        this.dailyRemindContents = dailyRemindContents;
        this.dailyRemindDate = dailyRemindDate;
    }

    public void updateDailyRemind(String dailyRemindContents) {
        this.dailyRemindContents = dailyRemindContents;
    }
}
