import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatFormFieldAppearance} from "@angular/material/form-field";

/**
 * Reusable component with Yes/No dropdown selection
 * Can be used anywhere (tables, popups etc.)
 *
 * @param appearance defines mat-form-field appearance (legacy / standard / fill / outline)
 * @param labelText defines mat-label content
 *
 * @param selectedValue emit event with selected value (true/false)
 *
 * Usage example:
 *  <app-yes-no class="myClass mat-form-field" [labelText]="'lable'" [appearance]="'outline'" (selectedValue)="doSomething($event, row)"></app-yes-no>
 *
 * @Style
 * To customize element style create in parent scss/css dedicated class (myClass in this example) and add mat-form-field in element class declaration as in example
 *
 */

@Component({
  selector: 'app-yes-no',
  templateUrl: './yes-no.component.html',
  styleUrls: ['./yes-no.component.scss']
})
export class YesNoComponent implements OnInit {
  blockedList = [true, false];
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() labelText: string | undefined;

  @Output() selectedValue = new EventEmitter;

  constructor() { }

  ngOnInit(): void {
  }

}
