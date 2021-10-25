package com.mkozachuk.stockwatcher.playground;

import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Entity(name = "twos")
@Data
public class EntityTwo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long twoId;

    String name;

    @ManyToMany(mappedBy = "twos")
    Set<EntityOne> ones;
}
