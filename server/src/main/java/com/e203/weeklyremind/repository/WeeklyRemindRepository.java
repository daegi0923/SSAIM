package com.e203.weeklyremind.repository;

import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import com.e203.user.entity.User;
import com.e203.weeklyremind.entity.WeeklyRemind;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WeeklyRemindRepository extends JpaRepository<WeeklyRemind, Integer> {

    @Query("SELECT w FROM WeeklyRemind w " +
            "WHERE (:projectId IS NULL OR w.projectId.id = :projectId) " +
            "AND (:authorId IS NULL OR w.weeklyRemindAuthor.id = :authorId) " +
            "AND (:startDate IS NULL OR w.weeklyRemindStartDate <= :checkDate) " +
            "AND (:endDate IS NULL OR w.weeklyRemindEndDate >= :checkDate)")
    List<WeeklyRemind> findWeeklyReminds(
            @Param("projectId") Integer projectId,
            @Param("authorId") Integer authorId,
            @Param("checkDate") LocalDate checkDate,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT wr FROM WeeklyRemind wr " +
            "JOIN wr.weeklyRemindAuthor pm " +
            "JOIN pm.user u " +
            "WHERE u.userId = :userId")
    List<WeeklyRemind> findWeeklyRemindsByUserId(@Param("userId") int userId);


}
