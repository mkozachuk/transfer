package com.mkozachuk.stockwatcher.playground.second;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class OneTwoTree {

    @Id
    @GeneratedValue
    Long id;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "newone_id")
    private NewEntityOne newone;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "newtwo_id")
    private NewEntityTwo newtwo;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "newtree_id")
    private NewEntityTree newtree;
}
