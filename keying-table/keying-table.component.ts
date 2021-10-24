import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {KeyingServiceService} from "./service/keying-service.service";
import {FormParams, Mode} from "./partials/keying-filter/keying-filter.component";

export interface DataForGridType {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: DataForGridType[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-keying-table',
  templateUrl: './keying-table.component.html',
  styleUrls: ['./keying-table.component.scss']
})
export class KeyingTableComponent implements OnInit, AfterViewInit {


  editingRow: DataForGridType | null = null;
  addMode: Mode = Mode.SEARCH;
  ngOnInit(): void {
  }

  displayedColumns: string[] = [ 'name', 'weight', 'symbol','edit'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private service: KeyingServiceService) {}

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }


  onFormSave(data: FormParams) {
    console.log('calling service to save');
    this.service.saveDataFromForm(data);
  }

  onSearchClick(data: FormParams) {
    console.log('calling service form search');
    this.service.getFilteredData(data);
  }

  onEditRowClick(element: any) {
    this.addMode = Mode.EDIT;
    console.log('Edit mode for row => ' + JSON.stringify(element));
  }

  onDeleteElementClick(element: any) {
    console.log('fire up dialog?');
  }
}
