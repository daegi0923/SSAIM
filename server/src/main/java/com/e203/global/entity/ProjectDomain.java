package com.e203.global.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "project_domain")
public class ProjectDomain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_domain_id", nullable = false)
    private Integer projectDomainId;

    @Column(name = "project_domain_name")
    private String projectDomainName;

    @Column(name = "project_domain_category")
    private Integer projectDomainCategory;

    @Builder
    private ProjectDomain(String projectDomainName, int projectDomainCategory) {
        this.projectDomainName = projectDomainName;
        this.projectDomainCategory = projectDomainCategory;
    }

    public ProjectDomain(int projectDomainId) {
        this.projectDomainId = projectDomainId;
    }
}