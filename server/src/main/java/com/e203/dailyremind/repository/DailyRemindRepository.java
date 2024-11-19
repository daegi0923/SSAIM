package com.e203.dailyremind.repository;

import com.e203.dailyremind.entity.DailyRemind;
import com.e203.project.entity.Project;
import com.e203.project.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

public interface DailyRemindRepository extends JpaRepository<DailyRemind, Integer> {

    List<DailyRemind> findByProjectId(Project project);

    @Query("SELECT d FROM DailyRemind d WHERE "
            + "(:projectMemberId IS NULL OR d.dailyRemindAuthor.id = :projectMemberId) AND "
            + "((:startDate IS NULL AND :endDate IS NULL) OR d.dailyRemindDate BETWEEN :startDate AND :endDate) AND "
            + "(:projectId IS NULL OR d.projectId.id = :projectId)")
    List<DailyRemind> searchDailyReminds(
            @Param("projectMemberId") Integer projectMemberId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("projectId") Integer projectId
    );
}
