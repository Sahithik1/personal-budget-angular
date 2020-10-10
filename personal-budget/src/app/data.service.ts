import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) {}

  dataSource =  [];

  private _URL = 'http://localhost:3000/budget';


  getTestData() {

    return this.http.get(this._URL);
}

}
