import { Injectable } from '@angular/core';
import { CommonData } from '../_model/index';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class LocalDataService {
  private _commondata: CommonData = null;
  private _eventvariable = new Subject<any>();
  public globalOnchanges = this._eventvariable.asObservable();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  public emitGlobalOnchanges(value: any = null) {
    this._eventvariable.next(value);
  }

  getSessionData() {
    if (!this._commondata) {
      this._commondata = JSON.parse(localStorage.getItem("currentUser"));
    }

    return this._commondata;
  }

  setSessionData(data) {
    this._commondata = data;
    localStorage.setItem("currentUser", JSON.stringify(this._commondata));
  }

  getBranch() {
    this.getSessionData();
    return this._commondata.Branch.filter((f) => f.BranchID == this._commondata.BranchID)[0];
  }

  getUserAccess(page) {
    this.getSessionData();
    let ret: any = {};
    if (this._commondata.UserRole == "ADMIN") {
      ret = { Save: true, Edit: false, Print: true, Cancel: true, datechange: false,IsAdmin:true }
    }
    else {
      ret = { Save: true, Edit: false, Print: false, Cancel: false, datechange: false,IsAdmin:false }
    }

    if (this.router.url.indexOf('/list') == -1 && this.router.url.indexOf('/view') == -1) {
      this.clearLocalListStorage();
    }

    if (page != 'CUSTOMERSEARCH') {
      this.clearLocalItemListStorage();
    }

    return ret;
  }

  redirect(url, param?) {
    console.log(url, param);
    if (param)
      this.router.navigate([url], { queryParams: param });
    else
      this.router.navigate([url]);
  }

  getQueryStringValue(val?: any[]) {
    let ret = {};
    if (val) {
      val.forEach(item => {
        ret[item] = this.route.snapshot.queryParams[item];
      });
    }
    return ret;
  }

  handleError(err) {  //: HttpErrorResponse | any
    console.log(err);
    if (err.status === 401) {
      // redirect to the login route
      // or show a modal
      //this.message.error("Error while communicating with server. Please try again");
      localStorage.removeItem('currentUser')
      this.redirect("session/signin")
    }


    //   if (err.error instanceof ErrorEvent) {
    //    // client-side error
    //  console.log(err);
    //  } else {
    //    // server-side error
    //    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    //  }

    //   return throwError(errorMessage);

    // return Observable.throw(err.message);
  }

  clearLocalItemListStorage() {
    localStorage.removeItem('deliveryinitemlist');
    localStorage.removeItem('deliveryoutitemlist');
    localStorage.removeItem('jobcarditemlist');
    localStorage.removeItem('purchaseitemlist');
    localStorage.removeItem('salesitemlist');
    localStorage.removeItem('saleorderitemlist');
    localStorage.removeItem('salereturnitemlist');
    localStorage.removeItem('serviceitemlist');
    localStorage.removeItem('purchasereturnitemlist');
  }

  clearLocalListStorage() {
    localStorage.removeItem('deliverylist');
    localStorage.removeItem('deliveryoutlist');
    localStorage.removeItem('jobcardlist');
    localStorage.removeItem('purchaselist');
    localStorage.removeItem('saleslist');
    localStorage.removeItem('salesorderlist');
    localStorage.removeItem('salesreturnlist');
    localStorage.removeItem('servicelist');
    localStorage.removeItem('purchasereturnlist');
                             
  }

  roundToTwo(num: number) {
    return parseFloat((num + .00001).toFixed(2)); //+(Math.round(num + "e+2") + "e-2");
  }

  getCommonPrintCss() {
    return ` @media print { 
        div[size="A5"] {
          background: white;
          width: 21cm;
          height: 12.80cm;
          /*29.7cm;*/
          display: block;
          margin: 0 auto;
          margin-bottom: 0.5cm;    
          font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; 
        }
        .item-list {
          border-collapse: collapse;
          width: 100%;
          font-size: 12px;
        }
        .item-list tr.items th,
        .item-list tr.items td {
          border: 1px solid #424040;
          border-bottom: none;
          border-top: none;
          font-size: 11px;
          padding-top: 3px;
        }
        .item-list tr.items th {
          font-weight: 500;
          height: 15px;
          background-color: #eee;
          vertical-align: middle;
          border: 1px solid #424040;
        }
        .item-list tr.items:last td {
          border-bottom: 1px solid #424040;
        }
        .item-list tr.items td {
          height: 16px;
        }
        .item-list tfoot tr td {
          height: 16px;
        }
        .inv-width-3 {
          width: 3%;
        }
        .inv-width-4 {
          width: 4%;
        }
        .inv-width-5 {
          width: 6%;
        }
        .inv-width-6 {
          width: 6%;
        }
        .inv-width-7 {
          width: 7%;
        }
        .inv-width-9 {
          width: 9%;
        }
        .inv-width-10 {
          width: 10%;
        }
        .inv-width-15 {
          width: 15%;
        }
        .inv-width-25 {
          width: 25%;
        }
        .inv-width-30 {
          width: 31%
        }
        .inv-center {
          text-align: center;
          vertical-align: middle;
        }
        .inv-left {
          text-align: left;
          vertical-align: middle;
        }
        .inv-right {
          text-align: right;
          vertical-align: middle;
          padding-right: 2px;
        }
        .item-header .fl {
          float: left;
          border-right: 1px solid #424040;
        }
        .item-header .fr {
          float: left;
          border-right: 1px solid #424040;
        }
        .item-header .header-company {
          text-align: left;
          width: 58%;
        }
        .item-header .header-details {
          text-align: right;
          width: 40%;
        }
        .item-header {
          width: 100%;
          font-size: 12px;
          clear: both;
          border-collapse: collapse;
        }
        .item-header h1 {
          margin: 0;
          padding: 0;
        }
        .item-header h3 {
          margin: 0;
          padding: 0;
        }
        .head-width-60 {
          width: 62.2%;
        }
        .br-1-b0 {
          border: 1px solid #424040;
          border-bottom: none;
        }
        .br-b1 {
          border-bottom: 1px solid #424040;
        }
        .br-r1 {
          border-right: 1px solid #424040;
        }
        html,
        body {
          width: 21cm;
          /* height: 14.85cm;
          29.7cm;*/
        }
        body {
          margin: 0;
          padding: 0;
          background-color: transparent;
          box-shadow: 0;
          font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        }
        body 
        {
          margin: 0 !important; 
          padding: 0 !important; 
          box-shadow: 0;
        }
        @page { 
          size: A5 landscape
          margin: 0;
          padding:0;
        } 
        .page-break{page-break-before:always;clear:both}
        .footer {break-after: always;}
        thead { display: table-header-group }
        tfoot { display: table-row-group }
        tr { page-break-inside: avoid }
        .invbold{font-weight: bold;text-transform: capitalize}
      } `;
  }
}