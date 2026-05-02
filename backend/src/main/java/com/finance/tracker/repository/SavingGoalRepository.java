package com.finance.tracker.repository;

import com.finance.tracker.model.SavingGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SavingGoalRepository extends JpaRepository<SavingGoal, Long> {
    List<SavingGoal> findByUserId(Long userId);
}
