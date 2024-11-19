package com.e203.user.repository;

import com.e203.user.entity.User;
import com.e203.user.response.UserInfoResponseDto;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Boolean existsByUserEmail(String userEmail);

    User findByUserEmail(String userEmail);

    User findByUserId(int userId);

    @Query("SELECT u FROM User u WHERE (:userName IS NULL OR u.userName LIKE %:userName%) " +
            "AND (:userEmail IS NULL OR u.userEmail LIKE %:userEmail%) " +
            "AND (:userClass IS NULL OR u.userClass = :userClass) " +
            "AND (:userCampus IS NULL OR u.userCampus = :userCampus) " +
            "AND (:userGeneration IS NULL OR u.userGeneration = :userGeneration) " +
            "AND (:userNickname IS NULL OR u.userNickname LIKE %:userNickname%) " +
            "AND (:userRole IS NULL OR u.userRole = :userRole) " +
            "AND (:userBirth IS NULL OR u.userBirth = :userBirth) " +
            "AND (:userGender IS NULL OR u.userGender = :userGender)")
    List<User> searchUsers(
            @Param("userName") String userName,
            @Param("userEmail") String userEmail,
            @Param("userClass") Integer userClass,
            @Param("userCampus") Integer userCampus,
            @Param("userGeneration") Integer userGeneration,
            @Param("userNickname") String userNickname,
            @Param("userRole") Integer userRole,
            @Param("userBirth") LocalDate userBirth,
            @Param("userGender") Integer userGender);
}
