import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {DataForGridType} from "../keying-table.component";
import {FormParams} from "../partials/keying-filter/keying-filter.component";
import {Params} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class KeyingServiceService {

  constructor(private http: HttpClient) {
  }

  fetchDataForGrid(): Observable<DataForGridType> | string {
    // return this.http.get<DataForGridType>('/some/url');
    console.log('fetching data from backend .............');
    return 'dummy';
  }

  saveDataFromForm(dto: FormParams): Observable<FormParams> | string {

// return this.http.post<FormParams>('/some/url', dto);
    console.log('posting data to backend .............');
    return 'savedDummy';
  }

  getFilteredData(searchParams: FormParams){
    // const params = searchParams;
    // return this.http.get('some/url', params);
    console.log('get filtering data from backend .............');
    return 'fetchFilteredData';
  }
}
