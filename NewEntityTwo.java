package com.mkozachuk.stockwatcher.playground.second;

import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Entity(name = "newtwos")
@Data
public class NewEntityTwo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long twoId;

    String name;

    @OneToMany(mappedBy = "newtwo", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Set<OneTwoTree> oneTwoTrees;
}
