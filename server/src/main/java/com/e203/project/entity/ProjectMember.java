package com.e203.project.entity;

import com.e203.global.entity.BaseEntity;
import com.e203.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Table(name = "project_member")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectMember extends BaseEntity {
    @Id
    @Column(name = "project_member_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Setter
    @Column(name = "project_member_role", nullable = false)
    private int role = 0;

    @Builder
    private ProjectMember(Project project, User user, int role) {
        this.project = project;
        this.user = user;
        this.role = role;
    }

}
