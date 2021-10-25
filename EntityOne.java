package com.mkozachuk.stockwatcher.playground;

import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Entity(name = "ones")
@Data
public class EntityOne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long oneId;

    String name;

    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(
            name = "one_two",
            joinColumns = @JoinColumn(name = "one_id"),
            inverseJoinColumns = @JoinColumn(name = "two_id")
    )
    Set<EntityTwo> twos;

    @ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(
            name = "one_tree",
            joinColumns = @JoinColumn(name = "one_id"),
            inverseJoinColumns = @JoinColumn(name = "tree_id")
    )
    Set<EntityTree> trees;

    public void addTwos(EntityTwo two) {
        this.twos.add(two);
        two.getOnes().add(this);
    }

    public void removeTwos(EntityTwo two) {
        this.twos.remove(two);
        two.getOnes().remove(this);
    }

    public void addTrees(EntityTree tree) {
        this.trees.add(tree);
        tree.getOnes().add(this);
    }

    public void removeTrees(EntityTree tree) {
        this.trees.remove(tree);
        tree.getOnes().remove(this);
    }

}
