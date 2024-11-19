package com.e203.recruiting.repository;

import com.e203.recruiting.entity.RecruitingMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecruitingMemberRepository extends JpaRepository<RecruitingMember, Integer> {

    @Query("SELECT r FROM RecruitingMember r " +
            "WHERE (r.user.userId = :userId) " +
            "AND (r.deletedAt IS NULL )")
    List<RecruitingMember> searchMemberByUserId(@Param("userId") Integer userId);

    RecruitingMember findByIdAndDeletedAtIsNull(int id);
}
