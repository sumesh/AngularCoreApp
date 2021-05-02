import { Injectable } from '@angular/core';
// import {  MyCustomHttp } from '../_helpers'

import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from "rxjs/operators";

import { InvoiceNumeber, CommonData } from '../_model/index';
import { LocalDataService } from './localdata.service'
@Injectable()
export class InventoryService {
    constructor(private http: HttpClient,
        private sessiondata: LocalDataService) { }


    getInvoiceCommonData(url) {
        //let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        let sobj = this.sessiondata.getSessionData()
        let body: any = {
            CompanyID: sobj.CompanyID,
            BranchID: sobj.BranchID,
            FinYearID: sobj.FinYearID,
            UserID: sobj.UserID
        };
        return this.http.post(url, body).pipe(tap( // Log the result or error
        data => data,
        error => error
                //{ console.log('Service Something went wrong!', error);
               // this.sessiondata.handleError(error);}
        ));
      
      
      
      
            // .subscribe(data => { return data; },
            // // Errors will call this callback instead:
            // err => { 
            //     return err;
            // }
            // );
    }

    InvoiceDataService(url,param) { 
        let sobj = this.sessiondata.getSessionData()
        let body: any = {
            CompanyID: sobj.CompanyID,
            BranchID: sobj.BranchID,
            FinYearID: sobj.FinYearID,
            UserID: sobj.UserID
        };

      param['logininfo']=body;
        return this.http.post(url, param).pipe(tap( // Log the result or error
        data => data,
        error => error
        // err => { console.log('Service Something went wrong!', error);
        //         this.sessiondata.handleError(err);}
        ));

        // return this.http.post(url, param)
        //     .subscribe((data) => {
        //         return data;
        //     },
        //     // Errors will call this callback instead:
        //     err => {
        //         console.log('Service Something went wrong!', err);
        //         this.sessiondata.handleError(err);
        //         return null;
        //     }
        //     );
    }

}