package com.e203.meeting.entity;

import com.e203.global.entity.BaseEntity;
import com.e203.project.entity.Project;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "meeting")
public class Meeting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meeting_id")
    private int meetingId;

    @Column(name = "meeting_title")
    private String meetingTitle;

    @Column(name = "meeting_voice_url")
    private String meetingVoiceUrl;

    @Lob
    @Column(columnDefinition = "LONGTEXT", name = "meeting_voice_script")
    private String meetingVoiceScript;

    @Column(name = "meeting_voice_time")
    private Integer meetingVoiceTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Project project;

    @Builder
    private Meeting(String meetingTitle, String meetingVoiceUrl, String meetingVoiceScript, Integer meetingVoiceTime, Project project) {
        this.meetingTitle = meetingTitle;
        this.meetingVoiceUrl = meetingVoiceUrl;
        this.meetingVoiceScript = meetingVoiceScript;
        this.meetingVoiceTime = meetingVoiceTime;
        this.project = project;
    }

    public void updateMeetingVoiceScript(String meetingScript) {
        this.meetingVoiceScript = meetingScript;
    }

    public void updateMeetingTitle(String meetingTitle) {
        this.meetingTitle = meetingTitle;
    }
}
