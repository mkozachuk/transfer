import {Component, Injectable, Input, OnInit} from '@angular/core';
import {FlatTreeControl, NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from "@angular/material/tree";
import {SelectionModel} from "@angular/cdk/collections";
import {BehaviorSubject} from "rxjs";
import {DataService} from "../../data.service";

/**
 * Node for to-do name
 */
export interface DummyData {
  name: string;// ='';
  level: number;//= 0;
  children: DummyData[]//; =[];
  selected?:boolean;
}

/** Flat to-do name node with expandable and level information */
export class TodonameFlatNode {
  name: string = '';
  level: number = 1;
  expandable: boolean = false;
}


/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-tree-checkbox',
  templateUrl: './tree-checkbox.component.html',
  styleUrls: ['./tree-checkbox.component.scss'],
})
export class TreeCheckboxComponent  implements OnInit{

  // @Input() data1 : DummyData[] = [{name:'start', level: 0, children:[{name:'start', level: 1, children:[]}]}];

  data1 = 'a';
fetchedData!: DummyData;

  dataChange = new BehaviorSubject<DummyData[]>([]);

  // get data(): DummyData[] { return this.dataChange.value; }






  // initialize a private variable _data, it's a BehaviorSubject
  private _data = new BehaviorSubject<DummyData[]>([{name:'start', level: 0, children:[{name:'start', level: 1, children:[]}]}]);

  // change data to use getter and setter
  @Input()
  set data(value) {
    // set the latest value for _data BehaviorSubject
    this._data.next(value);
  };

  get data() {
    // get the latest value from _data BehaviorSubject
    return this._data.getValue();
  }

  ngOnInit() {
    // now we can subscribe to it, whenever input changes,
    // we will run our grouping logic

  }









  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodonameFlatNode, DummyData>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<DummyData, TodonameFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodonameFlatNode | null = null;

  /** The new name's name */
  newnameName = '';

  treeControl: FlatTreeControl<TodonameFlatNode>;

  treeFlattener: MatTreeFlattener<DummyData, TodonameFlatNode>;

  dataSource: MatTreeFlatDataSource<DummyData, TodonameFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodonameFlatNode>(true /* multiple */);

  constructor(private service: DataService) {
    console.log("3" + JSON.stringify(this.data1));
    // console.log('4'+ JSON.stringify(this.dataSource.data));
    // this.initialize();
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodonameFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    console.log("4" + JSON.stringify(this.data1));
    console.log('5'+ JSON.stringify(this.dataSource?.data));
    // this.dataSource.data = this.data1;
    // _database.dataChange.subscribe(data => {
    //   this.dataSource.data = this.data;
    // });

    this._data
      .subscribe(x => {
        this.dataSource.data = this.data;
      });

    // this.dataChange.subscribe(data => {
    //   this.dataSource.data = data;
    //   console.log("6" + JSON.stringify(this.data1));
    //   console.log('7'+ JSON.stringify(this.dataSource?.data));
    // });
    console.log("8" + JSON.stringify(this.data1));
    console.log('9'+ JSON.stringify(this.dataSource?.data));
  }

  getLevel = (node: TodonameFlatNode) => node.level;

  isExpandable = (node: TodonameFlatNode) => node.expandable;

  getChildren = (node: DummyData): DummyData[] => node.children;

  hasChild = (_: number, _nodeData: TodonameFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodonameFlatNode) => _nodeData.name === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: DummyData, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.name === node.name
      ? existingNode
      : new TodonameFlatNode();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodonameFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodonameFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do name selection. Select/deselect all the descendants node */
  todonameSelectionToggle(node: TodonameFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);

    console.log('selection togle' + JSON.stringify(this.checklistSelection))
  }

  /** Toggle a leaf to-do name selection. Check all the parents to see if they changed */
  todoLeafnameSelectionToggle(node: TodonameFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    console.log('todoLeafnameSelectionToggle' + JSON.stringify(this.checklistSelection))
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodonameFlatNode): void {
    let parent: TodonameFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
    console.log('checkAllParentsSelection' + JSON.stringify(this.checklistSelection))
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodonameFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
    console.log('checkRootNodeSelection' + JSON.stringify(this.checklistSelection))

    console.log("descAllSelected" + descAllSelected);
  }

  /* Get the parent node of a node */
  getParentNode(node: TodonameFlatNode): TodonameFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }



}


