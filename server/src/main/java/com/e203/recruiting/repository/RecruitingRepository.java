package com.e203.recruiting.repository;

import com.e203.recruiting.entity.BoardRecruiting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RecruitingRepository extends JpaRepository<BoardRecruiting, Integer> {

    BoardRecruiting findByRecruitingIdAndDeletedAtIsNull(int recruitingId);

    @Query("SELECT r FROM BoardRecruiting r " +
            "WHERE (r.deletedAt IS NULL)" +
            "AND (:title IS NULL OR r.title LIKE CONCAT('%', :title, '%')) " +
            "AND (:position IS NULL OR (" +
            "   (:position = 1 AND r.memberFrontend > 0) OR " +
            "   (:position = 2 AND r.memberBackend > 0) OR " +
            "   (:position = 3 AND r.memberInfra > 0)) " +
            ") " +
            "AND (:campus IS NULL OR r.campus = :campus) " +
            "AND (:domain IS NULL OR r.firstDomain.projectDomainId = :domain OR r.secondDomain.projectDomainId = :domain) " +
            "AND (:status IS NULL OR r.status = :status) " +
            "AND (:author IS NULL OR r.author.userId = :author)")
    Page<BoardRecruiting> searchPosts(
            @Param("title") String title,
            @Param("position") Integer position,
            @Param("campus") Integer campus,
            @Param("domain") Integer domain,
            @Param("status") Integer status,
            @Param("author") Integer author,
            Pageable pageable);

}
