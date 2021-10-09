import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DummyData} from "../../shared/components/tree-checkbox/tree-checkbox.component";
import {FormControl, FormGroup} from "@angular/forms";
import {SelectionModel} from "@angular/cdk/collections";

export interface StructureType {
  name: string;
  shortName: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit {

  dummyFrobBackend: DummyData[] = [];
  treeGroup = new FormGroup({
    treeData: new FormControl(),
    structureType: new FormControl([])
  });


  structuretypes: StructureType[] = [
    {
      name: 'Inicjator',
      shortName: 'INI'
    },
    {

      name: '2Inicjator',
      shortName: '2INI'

    },
    {

      name: '3Inicjator',
      shortName: '3INI'

    },
    {

      name: '4Inicjator',
      shortName: '4INI'

    }];

  checklistSelection = new SelectionModel<StructureType>(true /* multiple */);

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.dummyFrobBackend = this.data.dummyForBackend;
  }

  onFormSubmit() {
    console.log("Form has been submitted" +
      "=> " + JSON.stringify(this.treeGroup.value));
  }

  allComplete: boolean = false;

  updateAllComplete(type: StructureType) {
    console.log('updateAllComplete');
    this.checklistSelection.toggle(type);
    this.checklistSelection.isSelected(type) ?
      this.checklistSelection.select(type) :
      this.checklistSelection.deselect(type);

    this.treeGroup.controls.structureType.setValue(this.checklistSelection.selected);

    this.allComplete = this.structuretypes.every(s => this.checklistSelection.isSelected(s));

  }

  someComplete(): boolean {
    console.log('someComplete()');
    return this.checklistSelection.selected.length > 0 && !this.allComplete;
  }

  setAll(checked: boolean) {
    console.log('setAll');
    this.allComplete = !this.allComplete;
    this.structuretypes.forEach(type => {
      checked ? this.checklistSelection.select(type) : this.checklistSelection.deselect(type);
    });
    this.allComplete = checked;
    console.log(this.allComplete);
    // this.structuretypes.forEach(s => s.checked = this.allComplete);
  }

  onSaveClick() {
    console.log('form data => ' + JSON.stringify(this.treeGroup.value));
  }
}
