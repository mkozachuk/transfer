/**
 * <app-awesome-dropdown [myFormControlName]="'drop'"></app-awesome-dropdown>
 */
import {Component, Input, OnInit} from "@angular/core";
import {ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR} from "@angular/forms";
import {MatFormFieldAppearance} from "@angular/material/form-field";
import {SelectionModel} from "@angular/cdk/collections";
import {DummyFlatNode} from "../tree-checkbox/tree-checkbox.component";

export interface CheckedItem {
  value: any,
  checked: boolean
}

@Component({
  selector: 'app-awesome-dropdown',
  templateUrl: './awesome-dropdown.component.html',
  styleUrls: ['./awesome-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AwesomeDropdownComponent
    }
  ]
})
export class AwesomeDropdownComponent implements OnInit, ControlValueAccessor {

  onChange = (value: any) => {
  };

  onTouched = () => {
  };

  touched = false;

  disabled = false;

  // private rootForm: FormGroupDirective
  constructor() {
  }

  writeValue(obj: any): void {
    this.toppingList = obj;
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }


  ngOnInit(): void {
    // this.form = this.rootForm.control;
    // this.rootFormControl = this.form.get(this.myFormControlName) as FormControl;
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

  // rootFormControl!: FormControl;
  // innerFormControl = new FormControl();
  // form!: FormGroup;

  formattedList: CheckedItem[] = [];
  backFormattedList: any[] = [];
  allComplete: boolean = false;

  updateAllComplete() {
    this.onChange(this.formattedList.filter(i => i.checked));
    this.allComplete = this.formattedList != null && this.formattedList.every(t => t.checked);
  }

  someComplete(): boolean {

    if (this.formattedList == null) {
      return false;
    }
    // if (this.innerFormControl.value) {

      // this.rootFormControl.setValue(this.innerFormControl.value);
    // }

    // this.onChange(this.formattedList.filter(i => i.checked));

    return this.formattedList.filter(t => t.checked).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {

    this.allComplete = completed;
    if (this.formattedList == null) {
      return;
    }
    this.formattedList.forEach(t => t.checked = completed);
    this.onChange(this.formattedList.filter(i => i.checked));
    // this.rootFormControl.setValue(this.innerFormControl.value);
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
