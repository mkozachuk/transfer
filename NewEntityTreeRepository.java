package com.mkozachuk.stockwatcher.playground.second;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewEntityTreeRepository extends JpaRepository<NewEntityTree, Long> {
}
