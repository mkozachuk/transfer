import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataForGridType} from "../../keying-table.component";

export interface FormParams {
  keyingTool: string,
  cypherType: string,
  posKey: string

}

export enum Mode {
  ADD, EDIT, READ_ONLY,SEARCH

}

@Component({
  selector: 'app-keying-filter',
  templateUrl: './keying-filter.component.html',
  styleUrls: ['./keying-filter.component.scss']
})
export class KeyingFilterComponent implements OnInit{

 ModeType = Mode;

 @Input() editingRow: DataForGridType | null = null;

  @Output() searchClick: EventEmitter<FormParams> = new EventEmitter<FormParams>();
  @Output() saveClick: EventEmitter<FormParams> = new EventEmitter<FormParams>();

  @Input() addMode: Mode = Mode.SEARCH;
  constructor() { }

  ngOnInit(): void {
  }

  searchOrAddForm = new FormGroup({
    keyingTool: new FormControl(''),
    cypherType: new FormControl(''),
    posKey: new FormControl('')
  });

  addNewClick() {
    this.addMode = Mode.ADD;
    this.searchOrAddForm.reset();
    console.log('On Add new Clicked = change search form to add form')
  }

  onSearchClick() {
    this.searchClick.emit(this.searchOrAddForm.value);
    console.log('On Search click: sending request to backend, fetching new data and grid below')
  }

  saveNewClick() {
    this.saveClick.emit(this.searchOrAddForm.value);
    console.log('Save new click: send request to backend, fire up Toast and returning to search mode')
    this.addMode = Mode.SEARCH;
  }

  cancelOnSaveNew() {
    this.searchOrAddForm.reset();
    this.addMode = Mode.SEARCH;
    console.log('Reset form and back to search mode')
  }
}
