import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

DataObservable: Observable<any>;

constructor(private http: HttpClient) { }

// tslint:disable-next-line: typedef
getData(): Observable<any> {
  if (this.DataObservable) {
    return this.DataObservable;
  } else {
    this.DataObservable = this.http.get('http://localhost:3000/budget').pipe(shareReplay());
    return this.DataObservable;
  }
}
}
