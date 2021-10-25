package com.mkozachuk.stockwatcher.playground;

import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Entity(name = "trees")
@Data
public class EntityTree {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long treeId;

    String name;

    @ManyToMany(mappedBy = "trees")
    Set<EntityOne> ones;

}
