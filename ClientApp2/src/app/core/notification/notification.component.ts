import { Component, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalDataService, AlertService, InventoryService } from '../../_services/index'
//import { window } from 'rxjs/operator/window';
//import { isNumber } from 'util';
//import {isNumeric} from "rxjs/util/isNumeric"

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html'
})
export class NotificationComponent {
  //public masterselect: FormGroup;
  Release:any={};
  today: number = Date.now();
  branchdtl = [];
  company = [];
  finYeardtl = [];
  branchID;
  finYearID;
  companyID;
  masterdtls: any = null;
  options = {
    collapsed: false,
    compact: false,
    boxed: false,
    dark: true,
    dir: 'ltr'
  };

  lstInvoiceType: any = [
    { "TypeD": "SALE", "InvoiceType": "Sale", URL: "sale/sales/view" },
  { "TypeD": "SALEORDER", "InvoiceType": "Sale Order", URL: "sale/salesorder/view" },
  { "TypeD": "SALERETURN", "InvoiceType": "Sale Return", URL: "sale/salesreturn/view" },
  { "TypeD": "PURCHASE", "InvoiceType": "Purchase", URL: "purchase/purchase/view" },
  { "TypeD": "PURCHASERETURN", "InvoiceType": "Purchase Return", URL: "purchase/purchasereturn/view" },
  { "TypeD": "JOBCARD", "InvoiceType": "Job Card", URL: "service/jobcard/view" },
  { "TypeD": "SERVICE", "InvoiceType": "Service", URL: "service/service/view" },
  { "TypeD": "DELIVERYIN", "InvoiceType": "Delivery In", URL: "delivery/deliveryin/view" },
  { "TypeD": "DELIVERYOUT", "InvoiceType": "Delivery Out", URL: "delivery/deliveryout/view" }];
  lstInvSeries_main: any = [
    { "TypeD": "SALE", "InvSeries": "PR" },
  { "TypeD": "SALE", "InvSeries": "KR" },
  { "TypeD": "SALE", "InvSeries": "MR" },
  { "TypeD": "SALE", "InvSeries": "NW" },
  { "TypeD": "SALEORDER", "InvSeries": "AV" },
  { "TypeD": "SALEORDER", "InvSeries": "AR" },
  { "TypeD": "SALERETURN", "InvSeries": "PR" },
  { "TypeD": "SALERETURN", "InvSeries": "KR" }, 
  { "TypeD": "SALERETURN", "InvSeries": "MR" },
  { "TypeD": "SALERETURN", "InvSeries": "NW" },
  { "TypeD": "PURCHASE", "InvSeries": "PR" },
  { "TypeD": "PURCHASE", "InvSeries": "KR" },
  { "TypeD": "PURCHASE", "InvSeries": "MR" },
  { "TypeD": "PURCHASE", "InvSeries": "NW" },
  { "TypeD": "PURCHASERETURN", "InvSeries": "PR" },
  { "TypeD": "PURCHASERETURN", "InvSeries": "KR" },
  { "TypeD": "PURCHASERETURN", "InvSeries": "MR" },
  { "TypeD": "PURCHASERETURN", "InvSeries": "NW" },
  { "TypeD": "JOBCARD", "InvSeries": "JC" },
  { "TypeD": "SERVICE", "InvSeries": "S" },
  { "TypeD": "SERVICE", "InvSeries": "F" },
  { "TypeD": "DELIVERYIN", "InvSeries": "DI" },
  { "TypeD": "DELIVERYIN", "InvSeries": "RFI" },
  { "TypeD": "DELIVERYOUT", "InvSeries": "DO" },
  { "TypeD": "DELIVERYOUT", "InvSeries": "RFO" }];
  lstInvSeries: any = [];
  InvoiceType = 'SALE';
  InvSeries = 'PR';
  InvURL: '';
  InvoiceNumber:string='';

  @Output() messageEvent = new EventEmitter<Object>();

  constructor(private router: Router
    , private route: ActivatedRoute
    , private sessiondata: LocalDataService
    , private invservice: InventoryService
    , private message: AlertService) {
      this.fetchreleasenotes((data) => { this.Release = data; });
     }


  ngOnInit() {

    this.masterdtls = this.sessiondata.getSessionData()
    this.branchID = this.masterdtls.BranchID;
    this.branchdtl = this.masterdtls.Branch.map(x => Object.assign({}, x));
    let branchobj = this.masterdtls.Branch.filter((f) => f.BranchID == this.branchID)[0];
    this.masterdtls['BranchName'] = branchobj.BranchName;
    //console.log('ngOnInit', this.branchID); 
    this.finYearDataBind();
    this.InvoiceType = 'SALE';
    this.ddlInvoiceTypeChange() ;
    this.sessiondata.emitGlobalOnchanges("HeaderReload");
  }

  finYearDataBind() {
    //debugger;
   // console.log('finYearDataBind', this.branchID, this.masterdtls.FinYearID);
    this.finYeardtl = this.masterdtls.FinYear.filter((f) => f.BranchID == this.branchID).map(x => Object.assign({}, x)); 
    this.masterdtls.FinYearID = this.finYeardtl[0].FinYearID;
    this.finYearID = this.masterdtls.FinYearID;
    this.sessiondata.setSessionData(this.masterdtls);
   // console.log('finYearDataBind', this.branchID, this.masterdtls.FinYearID);
  }

  ddlChangeEvenet() {
  // console.log('Branch Change');
    this.masterdtls = this.sessiondata.getSessionData();
    this.masterdtls.BranchID = this.branchID;
    let branchobj = this.masterdtls.Branch.filter((f) => f.BranchID == this.branchID)[0];
    this.masterdtls.CompanyID = branchobj.CompanyID;
    this.masterdtls['BranchName'] = branchobj.BranchName;
    this.finYearDataBind()
    // masterdtls.CompanyID = this.companyID;
    // masterdtls.FinYearID = this.finYearID;
    this.sessiondata.setSessionData(this.masterdtls);
    // localStorage.setItem("currentUser", JSON.stringify(masterdtls));
    this.sessiondata.emitGlobalOnchanges("Reload");
   // this.router.navigate(['/']);//this.router.url]
    this.sessiondata.redirect('invoice/search/', { page:'DASHBOARD', print: false, id: 0 });
  }

  ddlFinYearChange() {
   // console.log('year Change');
    this.masterdtls = this.sessiondata.getSessionData();
    this.masterdtls.FinYearID = this.finYearID;
    this.sessiondata.setSessionData(this.masterdtls);
    this.sessiondata.emitGlobalOnchanges("Reload");
    //this.router.navigate(['/']);//this.router.url]/
    this.sessiondata.redirect('invoice/search/', { page:'DASHBOARD', print: false, id: 0 });
  }

  sendOptions() {
  //  console.log(this.options);
    if (this.options.collapsed === true) {
      this.options.compact = false;
    }
    if (this.options.compact === true) {
      this.options.collapsed = false;
    }
    this.messageEvent.emit(this.options);
  }

  ddlInvoiceTypeChange() {
 //   console.log(this.InvoiceType, this.InvSeries,this.InvoiceNumber);
    var invtype = this.lstInvoiceType.filter(i => i.TypeD == this.InvoiceType);
    this.InvURL = invtype[0].URL;
    this.lstInvSeries = this.lstInvSeries_main.filter(item =>
      item.TypeD == this.InvoiceType)

      this.InvSeries=this.lstInvSeries[0].InvSeries;
  }

  searchinvoice() {
   // debugger;
   // console.log(this.InvoiceType, this.InvSeries,this.InvoiceNumber);
    if(this.InvoiceNumber)
    {
    this.invservice.InvoiceDataService('api/invoice/search/', { PageType: this.InvoiceType, InvSeries: this.InvSeries, InvoiceNumber: this.InvoiceNumber })
      .subscribe(data => {
        if (data) {
          if (data['IsSuccess'] && data["RetID"]>0) {            
            this.sessiondata.redirect('invoice/search/', { page:this.InvoiceType, print: false, id: data["RetID"] });
            this.sessiondata.emitGlobalOnchanges("HeaderReload");
          }
          else{
            this.message.error("Can't find the Invoice. Please try again");
          }
        }
      },
        err => {
          this.message.error("Error while communicating with server. Please try again");
          this.sessiondata.handleError(err);
        });
      }
      else 
      {
        this.message.error("Invalid Data. Please try again");
      }
  }

  // project table
  fetchreleasenotes(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/releasedetails.json`);
    req.onload = () => {
      cb(JSON.parse(req.response));
    };
    req.send();
  }

}
