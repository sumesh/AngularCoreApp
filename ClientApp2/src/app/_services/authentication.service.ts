import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, catchError } from "rxjs/operators";

import { HttpClient } from '@angular/common/http';
import { Response } from '@angular/http/src/static_response';
import { LocalDataService } from './localdata.service'

@Injectable()
export class AuthenticationService {
  // private headers = new Headers({ 'content-type': 'application/json' });
  // private options = new RequestOptions({ headers: this.headers });

  constructor(private http: HttpClient,
    private sessiondata: LocalDataService) { }

  login(username: string, password: string) {

    let body: any = { "username": username, "password": password };
    let url = "api/login/";
    let response: any;
    // let headers = new Headers({ 'Content-Type': 'application/json' });
    // let options = new RequestOptions({ headers: headers });
    // const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    //, { headers: headers }

    return this.http.post(url, body).pipe(
      tap( // Log the result or error
        data => data,
        error => error)
    );
    //   ( (data:Response) => { 
    //         return data;
    //     },
    //     // Errors will call this callback instead:
    //     err => {
    //         console.log('Something went wrong!', err);
    //         return null;
    //     }
    // );        
  }
  changepassword  (currentpassword:string,password: string) {
    let sobj = this.sessiondata.getSessionData()
  let body: any = {
      CompanyID: sobj.CompanyID,
      BranchID: sobj.BranchID,
      FinYearID: sobj.FinYearID,
      UserID: sobj.UserID
  };

 
    let param: any = { "UserID": body.UserID, "currentpassword": currentpassword, "password": password };
    let url = "api/user/changepassword/";
    let response: any; 

    return this.http.post(url, param).pipe(
      tap( // Log the result or error
        data => data,
        error => error)
    ); 
  }
  

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}