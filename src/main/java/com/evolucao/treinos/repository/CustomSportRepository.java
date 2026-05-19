package com.evolucao.treinos.repository;

import com.evolucao.treinos.model.CustomSport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomSportRepository extends JpaRepository<CustomSport, Long> {
    List<CustomSport> findByUserId(Long userId);
    void deleteByUserIdAndName(Long userId, String name);
}
