import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProductVO } from 'src/app/model/jung/productVO';

@Injectable({
  providedIn: 'root'
})
export class UserPorductMyService {
  private URL = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  getUserProduct(USER_ID: string) {
    return this.http.get<ProductVO[]>(this.URL + "userProduct/" + USER_ID).toPromise(); 
  }

  getUserProducts() {
    return this.http.get<ProductVO[]>(this.URL + "userProducts").toPromise(); 
  }
}
