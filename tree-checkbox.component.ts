import {Component, Injectable, Input, OnInit} from '@angular/core';
import {FlatTreeControl, NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource} from "@angular/material/tree";
import {SelectionModel} from "@angular/cdk/collections";
import {BehaviorSubject} from "rxjs";
import {DataService} from "../../data.service";
import {FormControl, FormControlDirective, FormGroup, FormGroupDirective} from "@angular/forms";

/**
 * Probably works with OnPush strategy
 *
 * In parent component HTML
 *
 *   <mat-expansion-panel >
 <mat-expansion-panel-header>
 <p>Company Structure</p>
 </mat-expansion-panel-header>
 <div class="myClass">
 <app-tree-checkbox [data]="dummyFrobBackend" [mainControlName]="'structure'"></app-tree-checkbox>
 </div>
 </mat-expansion-panel>
 *
 * In parent component scss
 * .myClass{
  max-height: 200px;
  overflow: scroll;
}
 *
 * In parent component TS add FormControl and fetch data from service
 *   dummyFrobBackend: DummyData[] = [];
 *
 * add to  onInit()
 *      this.service.getStructure().subscribe(t => {
      this.dummyFrobBackend = [t];
    });
 *
 *
 */




/**
 * Node type for incoming data
 */
export interface DummyData {
  id: number;
  name: string;
  level: number;
  children: DummyData[]
}

/** Flat name node with expandable and level information */
export class DummyFlatNode {
  id: number = 0;
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
export class TreeCheckboxComponent implements OnInit {


  @Input() mainControlName!: string;

  rootFormControl!: FormControl;
  localFormControl = new FormControl();

  private _data = new BehaviorSubject<DummyData[]>([{
    id: 0,
    name: 'start',
    level: 0,
    children: [{id: 0, name: 'start', level: 1, children: []}]
  }]);

  // change data to use getter and setter
  @Input()
  set data(value) {
    this._data.next(value);
  };

  get data() {
    return this._data.getValue();
  }

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<DummyFlatNode, DummyData>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<DummyData, DummyFlatNode>();

  treeControl!: FlatTreeControl<DummyFlatNode>;

  treeFlattener!: MatTreeFlattener<DummyData, DummyFlatNode>;

  dataSource!: MatTreeFlatDataSource<DummyData, DummyFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<DummyFlatNode>(true /* multiple */);

  form!: FormGroup;

  constructor(public rootForm: FormGroupDirective) {
  }

  ngOnInit() {

    this.form = this.rootForm.control;
    this.rootFormControl = this.form.get(this.mainControlName) as FormControl;

    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<DummyFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this._data
      .subscribe(x => {
        this.dataSource.data = this.data;
      });
  }

  getLevel = (node: DummyFlatNode) => node.level;

  isExpandable = (node: DummyFlatNode) => node.expandable;

  getChildren = (node: DummyData): DummyData[] => node.children;

  hasChild = (_: number, _nodeData: DummyFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: DummyFlatNode) => _nodeData.name === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: DummyData, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.name === node.name
      ? existingNode
      : new DummyFlatNode();
    flatNode.id = node.id;
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Checking if all nodes are selected */
  descendantsAllSelected(node: DummyFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    return descAllSelected;
  }

  /** Checking if any node is selected  */
  descendantsPartiallySelected(node: DummyFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do name selection. Select/deselect all the descendants node */
  dummyFlatNodeSelectionToggle(node: DummyFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);

    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach((child) => {
      this.checklistSelection.isSelected(child);
    });

    this.checkAllParentsSelection(node);

    this.rootFormControl.setValue(this.checklistSelection.selected); //form transfer

  }

  /** Toggle a leaf selection. Check all the parents to see if they changed */
  dummyFlatNodeLeafSelectionToggle(node: DummyFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);

    this.rootFormControl.setValue(this.checklistSelection.selected); //form transfer
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: DummyFlatNode): void {
    let parent: DummyFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }

  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: DummyFlatNode): void {
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
  getParentNode(node: DummyFlatNode): DummyFlatNode | null {
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


