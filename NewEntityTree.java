package com.mkozachuk.stockwatcher.playground.second;

import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Entity(name = "newtrees")
@Data
public class NewEntityTree {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long treeId;

    String name;

    @OneToMany(mappedBy = "newtree", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Set<OneTwoTree> oneTwoTrees;

}
