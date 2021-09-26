import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective} from "@angular/forms";
import {MatFormFieldAppearance} from "@angular/material/form-field";

/**
 * <app-awesome-dropdown [myFormControlName]="'drop'"></app-awesome-dropdown>
 */

export interface CheckedItem {
  value: any,
  checked: boolean
}

@Component({
  selector: 'app-awesome-dropdown',
  templateUrl: './awesome-dropdown.component.html',
  styleUrls: ['./awesome-dropdown.component.scss']
})
export class AwesomeDropdownComponent implements OnInit {

  constructor(private rootForm: FormGroupDirective) {
  }

  ngOnInit(): void {
    this.form = this.rootForm.control;
    this.rootFormControl = this.form.get(this.myFormControlName) as FormControl;
    this.formatter();
  }

  @Input() myFormControlName!: string;
  @Input() toppingList: any[] = [{value: 'Extra cheese', id: 1}, {value: 'Mushroom', id: 11}, {
    value: 'Onion',
    id: 111
  }, {value: 'Pepperoni', id: 1111}, {value: 'Sausage', id: 12}, {value: 'Tomato', id: 13}];
  @Input() appearance: MatFormFieldAppearance = 'standard';
  @Input() selectAllText: string = 'Select All';
  @Input() labelText: string = '';

  rootFormControl!: FormControl;
  innerFormControl = new FormControl();
  form!: FormGroup;

  formattedList: CheckedItem[] = [];
  backFormattedList: any[] = [];
  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.formattedList != null && this.formattedList.every(t => t.checked);
  }

  someComplete(): boolean {
    if (this.formattedList == null) {
      return false;
    }
    if (this.innerFormControl.value) {

      this.rootFormControl.setValue(this.innerFormControl.value);
    }
    return this.formattedList.filter(t => t.checked).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.formattedList == null) {
      return;
    }
    this.formattedList.forEach(t => t.checked = completed);
    this.rootFormControl.setValue(this.innerFormControl.value);
  }

  formatter() {
    if (this.toppingList.length > 0) {
      this.toppingList.forEach((item) => {
        this.formattedList.push({value: item, checked: false})
      });
    }
  }

  //TODO: is it needed?
  backFormatter(formValue: any[]) {
    this.backFormattedList = [];
    formValue.forEach((item) => {
      this.backFormattedList.push(item.value)
    });
    return this.backFormattedList;
  }

}
