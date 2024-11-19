package com.e203.global.entity;

import java.time.LocalDateTime;

import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;

@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseEntity {

	@Column(name = "created_at", updatable = false)
	@CreatedDate
	private LocalDateTime createdAt;

	@Column(name = "modified_at")
	@LastModifiedDate
	private LocalDateTime modifiedAt;

	@Column(name = "deleted_at")
	@Setter
	private LocalDateTime deletedAt;

}

