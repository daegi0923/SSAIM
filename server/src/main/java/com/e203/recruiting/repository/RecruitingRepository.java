package com.e203.recruiting.repository;

import com.e203.recruiting.entity.BoardRecruiting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

@Repository
public interface RecruitingRepository extends JpaRepository<BoardRecruiting, Integer> {

    BoardRecruiting findByRecruitingIdAndDeletedAtIsNull(int recruitingId);

    @Query("SELECT r FROM BoardRecruiting r " +
            "LEFT OUTER JOIN RecruitingMember m " +
            "ON r.recruitingId = m.boardRecruiting.recruitingId " +
            "AND (:position IS NULL OR m.position = :position) " +
            "WHERE (r.deletedAt IS NULL)" +
            "AND (:title IS NULL OR r.title LIKE CONCAT('%', :title, '%')) " +
            "AND (:campus IS NULL OR r.campus = :campus) " +
            "AND (:domain IS NULL OR r.firstDomain.projectDomainId = :domain OR r.secondDomain.projectDomainId = :domain) " +
            "AND (:status IS NULL OR r.status = :status) " +
            "AND (:author IS NULL OR r.author.userId = :author) " +
            "GROUP BY r.recruitingId, r.memberFrontend, r.memberBackend, r.memberInfra " +
            "HAVING (:position IS NULL OR " +
            "COUNT(m.id) < CASE :position " +
            "WHEN 1 THEN r.memberFrontend " +
            "WHEN 2 THEN r.memberBackend " +
            "WHEN 3 THEN r.memberInfra " +
            "ELSE 0 " +
            "END) " +
            "ORDER BY r.createdAt DESC "
    )
    Page<BoardRecruiting> searchPosts(
            @Param("title") String title,
            @Param("position") Integer position,
            @Param("campus") Integer campus,
            @Param("domain") Integer domain,
            @Param("status") Integer status,
            @Param("author") Integer author,
            Pageable pageable);

}
