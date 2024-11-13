package com.e203.document.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.e203.document.entity.Erd;

public interface ErdRepository extends JpaRepository<Erd, Integer> {
}
