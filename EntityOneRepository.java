package com.mkozachuk.stockwatcher.playground;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntityOneRepository extends JpaRepository<EntityOne, Long> {
}
