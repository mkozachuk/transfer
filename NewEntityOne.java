package com.mkozachuk.stockwatcher.playground.second;

import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Entity(name = "newones")
@Data
public class NewEntityOne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long oneId;

    String name;

    @OneToMany(mappedBy = "newone", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Set<OneTwoTree> oneTwoTrees;

}
