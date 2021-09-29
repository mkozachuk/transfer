import {Component, Injectable, Input, OnInit} from '@angular/core';
import {FlatTreeControl, NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from "@angular/material/tree";
import {SelectionModel} from "@angular/cdk/collections";
import {BehaviorSubject} from "rxjs";

/**
 * Node for to-do name
 */
export class DummyData {
  name: string ='';
  level: number= 0;
  children: DummyData[] =[];
}

/** Flat to-do name node with expandable and level information */
export class TodonameFlatNode {
  name: string = '';
  level: number = 1;
  expandable: boolean = false;
}


/**
 * The Json object for to-do list data.
 */
// const TREE_DATA =
  // {
  // Groceries: {
  //   'Almond Meal flour': null,
  //   'Organic eggs': null,
  //   'Protein Powder': null,
  //   Fruits: {
  //     Apple: null,
  //     Berries: ['Blueberry', 'Raspberry'],
  //     Orange: null
  //   }
  // },
  // Reminders: [
  //   'Cook dinner',
  //   'Read the Material Design spec',
  //   'Upgrade Application to Angular'
  // ]
// };

// /**
//  * Checklist database, it can build a tree structured Json object.
//  * Each node in Json object represents a to-do name or a category.
//  * If a node is a category, it has children names and new names can be added under the category.
//  */
// @Injectable()
// export class ChecklistDatabase {
//   dataChange = new BehaviorSubject<DummyData[]>([]);
//
//   get data(): DummyData[] { return this.dataChange.value; }
//
//   constructor() {
//     this.initialize();
//   }
//
//   dummyObj : DummyData[] = [];
//
//   initialize() {
//     // Build the tree nodes from Json object. The result is a list of `TodonameNode` with nested
//     //     file node as children.
//     const data = this.dummyObj;
//
//     // Notify the change.
//     this.dataChange.next(data);
//   }
//
//   /**
//    * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
//    * The return value is the list of `TodonameNode`.
//    */
//   buildFileTree(obj: {[key: string]: any}, level: number): DummyData[] {
//     return Object.keys(obj).reduce<DummyData[]>((accumulator, key) => {
//       const value = obj[key];
//       const node = new DummyData();
//       node.name = key;
//
//       if (value != null) {
//         if (typeof value === 'object') {
//           node.children = this.buildFileTree(value, level + 1);
//         } else {
//           node.name = value;
//         }
//       }
//
//       return accumulator.concat(node);
//     }, []);
//   }
//
//   // /** Add an name to to-do list */
//   // insertname(parent: DummyData, name: string) {
//   //   if (parent.children) {
//   //     parent.children.push({name: name} as DummyData);
//   //     this.dataChange.next(this.data);
//   //   }
//   // }
//   //
//   // updatename(node: DummyData, name: string) {
//   //   node.name = name;
//   //   this.dataChange.next(this.data);
//   // }
// }

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-tree-checkbox',
  templateUrl: './tree-checkbox.component.html',
  styleUrls: ['./tree-checkbox.component.scss'],
})
export class TreeCheckboxComponent {

  @Input() data! : DummyData[];


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

  constructor() {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodonameFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.dataSource.data = this.data;
    // _database.dataChange.subscribe(data => {
    //   this.dataSource.data = this.data;
    // });
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
  }

  /** Toggle a leaf to-do name selection. Check all the parents to see if they changed */
  todoLeafnameSelectionToggle(node: TodonameFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodonameFlatNode): void {
    let parent: TodonameFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
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

  /** Select the category so we can insert the new name. */
  // addNewItem(node: TodonameFlatNode) {
  //   const parentNode = this.flatNodeMap.get(node);
  //   this._database.insertname(parentNode!, '');
  //   this.treeControl.expand(node);
  // }
  //
  // /** Save the node to database */
  // saveNode(node: TodonameFlatNode, nameValue: string) {
  //   const nestedNode = this.flatNodeMap.get(node);
  //   this._database.updatename(nestedNode!, nameValue);
  // }

  ngOnInit(): void {
  }

}


