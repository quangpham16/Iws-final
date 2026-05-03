package com.finance.tracker.repository;

import com.finance.tracker.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByUserId(Long userId);
    boolean existsByUserIdAndColorHex(Long userId, String colorHex);
    boolean existsByUserIdAndColorHexAndIdNot(Long userId, String colorHex, Long id);
}
