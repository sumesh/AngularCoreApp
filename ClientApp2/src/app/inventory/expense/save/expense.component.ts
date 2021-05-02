import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { InvoiceModel, CustomerDetails, InvoiceNumeber, ItemModel, SaleMasterData, Employee } from '../../../_model/index';
import { AlertService, InventoryService, LocalDataService } from '../../../_services/index';

import {map, startWith} from 'rxjs/operators';
// const password = new FormControl('', Validators.required);
// const confirmPassword = new FormControl('', CustomValidators.equalTo(password));


export const ExpenseData: any = {
  invoicenumber: '',
  invoiceseries: 'R',
  invdate: new Date(),
  paymode: 'CASH',
  salesmanid: '',
  customer: <CustomerDetails>
    {     
      name: 'Customer 0',
      phone: '',
      address: '',
      email: '',
      postalcode: '',
      gst: '',
      cusstate: 'KL',
      custid:'0'

    },
  items: [],
  totalvalue: 0,
  sgstAmt: 0,
  cgstAmt: 0,
  netamount: 0,
  roundoff: 0,
  grandtotal: 0
};

@Component({
  selector: 'app-expemse',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {

  public salesform: FormGroup;
  public theBoundCallback: Function;
  userAccess: any = {};
  defaultformData: any;
  itemdatachange = 0;
  filteredItem: any;
  trans_filteredItem: any;

  lstvouchertype = [];
  //store account group
  lsttransactiontype = [];
  lstaccountheadcode = [];
  lsttransaccount = [];
  salesmanlist = [];
  //store invoice series
  lstseries = [];


  constructor(
    private fb: FormBuilder,
    private invservice: InventoryService,
    public sessiondata: LocalDataService,
    private message: AlertService) { }


  ngOnInit() {
    this.defaultformData = ExpenseData;
    this.userAccess = this.sessiondata.getUserAccess("EXPENSE");
    this.createForm();
    this.ngOnChange();
    this.loadData();
    this.theBoundCallback = this.theCallback.bind(this);
    this.sessiondata.globalOnchanges.subscribe(data => {
      //  console.log(data);
    });
  }

  public theCallback() {
    // console.log("Callback Parent", this);
    //this.theBoundCallback();
  }

  loadData() {
    let sobj = this.sessiondata.getSessionData();
    this.invservice.InvoiceDataService('api/accounts/master/', {
      PageType: "EXPENSE",
      CompanyID: sobj.CompanyID,
      BranchID: sobj.BranchID,
      FinYearID: sobj.FinYearID,
      UserID: sobj.UserID
    })
      .subscribe((data: any) => {
        if (data) {
          this.salesmanlist = data.SaleMan;
          this.lstvouchertype = data.VoucherType;
          this.lsttransactiontype = data.TransactionType;
          this.lstaccountheadcode = data.AccountGroupCode;
          this.lsttransaccount = data.Accounts;
          this.lstseries=data.InvNumber;
          this.defaultformData.salesmanid = this.sessiondata.getSessionData().EmpID.toString();
         this.defaultformData.customer.name = 'Customer ';
          this.salesform.patchValue({
            salesmanid: this.defaultformData.salesmanid,
            vouchertype:this.lstvouchertype[0],
           customer: this.defaultformData.customer,
           transactiontype:this.lsttransactiontype[0].TranID
            //InvSeries: data.InvNo.InvSeries,
            // invoicenumber: data.InvNo.InvNo
          });

        }
        else {
          this.salesform.patchValue({
            invoicenumber: ''
          });
        }

      },
        err => {
          // this.alertService.error(err);
          //this.loading = false;
          this.sessiondata.handleError(err);
        });
  }



  ///
  displayFn(value: any): string {
    return value && typeof value === 'object' ? value.AcntGrpName : value;
  }

  ///
  filterItem(val: string) {
    
    var tmpacntlist: any;
    tmpacntlist = this.lstaccountheadcode;

    if (tmpacntlist) {
      const filterValue = val.toLowerCase();
      return tmpacntlist.filter(item =>
        item.TranID == this.salesform.get('transactiontype').value &&
        item.AcntGrpName.toLowerCase().startsWith(filterValue));
    }

    return tmpacntlist;
  }

  ///
  trans_displayFn(value: any): string {
    return value && typeof value === 'object' ? value.AcntName : value;
  }

  ///
  trans_filterItem(val: string) {
    
    var tmpacntlist: any;
    tmpacntlist = this.lsttransaccount;

    if (tmpacntlist) {
      const filterValue = val.toLowerCase();
      return tmpacntlist.filter(item =>
      //item.TranID == this.salesform.get('vouchertype').value.VTID &&
        item.AcntName.toLowerCase().startsWith(filterValue));
    }

    return tmpacntlist;
  }

  ngOnChange() {
    //Auto complete
    this.filteredItem = this.salesform.get("accountheadcode").valueChanges.pipe(
      // .startWith(null)
      map(val => this.displayFn(val))
      ,map(name => this.filterItem(name))
    );
    //Item select
    this.salesform.get("accountheadcode").valueChanges.subscribe(val => {

      if (val && typeof val === 'object') {
        this.itemdatachange = 1;
        this.salesform.patchValue(
          {
            accountid: val.AcntGrpID
          });
        this.itemdatachange = 0;
      }

      else
      {
        this.salesform.patchValue(
          {
            accountid: ''
          });
      }
    });

    //Auto complete
    this.trans_filteredItem = this.salesform.get("transactionaccount").valueChanges.pipe(
      // .startWith(null)
      map(val => this.trans_displayFn(val))
      ,map(name => this.trans_filterItem(name))
    );

    //Item select
    this.salesform.get("transactionaccount").valueChanges.subscribe(val => {

      if (val && typeof val === 'object') {
        this.itemdatachange = 1;
        this.salesform.patchValue(
          {
             tranaccountid: val.AcntID
          });
        this.itemdatachange = 0;

      }
      else
      {
        this.salesform.patchValue(
          {
            tranaccountid: ''
          });
      }
    });

    this.salesform.get("invseries").valueChanges.subscribe(item => {
      var tmplstseries: any; 
      tmplstseries = this.lstseries; 
      tmplstseries=tmplstseries.filter(f =>f.InvSeries==item);
      if(tmplstseries && tmplstseries.length>0)
      {
        this.salesform.patchValue({
          invoicenumber:tmplstseries[0].InvNo         
        });
      }
    });
    


    this.salesform.get("transactiontype").valueChanges.subscribe(item => {
      // this.defaultformData.customer.custid = item.BranchID;
      // this.defaultformData.customer.name = item.BranchName;
      // this.defaultformData.customer.address = item.Br_Adrs;
      // this.defaultformData.customer.phone = item.Br_Ph;
      
      if (item != 'BANK') {
        this.salesform.get("chequeno").clearValidators();
        this.salesform.get("chequedate").clearValidators();
      }
      else {
        this.salesform.get("chequeno").setValidators([Validators.required]);
        this.salesform.get("chequedate").setValidators([Validators.required, CustomValidators.date]);
      }

      this.salesform.get("chequeno").updateValueAndValidity();
      this.salesform.get("chequedate").updateValueAndValidity();

      this.salesform.patchValue({
        accountheadcode: '',
        accountid: ''
      });
    });


    this.salesform.get("vouchertype").valueChanges.subscribe(item => {
      if (item && typeof item === 'object') {

        this.salesform.patchValue({
          invseries: item.InvSeries
        });

        // this.salesform.patchValue({
        //   transactionaccount: '',
        //   tranaccountid: ''
        // });
      }

    });
  }

  createForm() {

    this.salesform = this.fb.group({
      vouchertype: [{ value: '', disabled: false }, Validators.required],
      invseries: [{ value: '', disabled: true }, Validators.required],
      invoicenumber: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      invdate: [{ value: '', disabled: !this.userAccess.datechange }, Validators.compose([Validators.required, CustomValidators.date])],
      customer: this.fb.group({
        custid: [null],
        name: [null, Validators.compose([Validators.minLength(3), Validators.maxLength(200)])],
        phone: [null, Validators.compose([Validators.minLength(10), Validators.maxLength(25)])],
        address: [null]
      }),
      transactiontype: ['', Validators.required],
      accountid: ['', Validators.required],
      transactionaccount: ['', Validators.required],
      tranaccountid: ['', Validators.required],
      accountheadcode: ['', Validators.required],
      amount: [0, Validators.compose([Validators.required,,Validators.min(.1) ])],
      salesmanid: [null, Validators.required],
      narration: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(200)])],
      chequeno: [null],
      chequedate: [{ value: '', disabled: false }, Validators.compose([Validators.required, CustomValidators.date])],
    });


    //console.log(this.defaultformData.customer);
    this.salesform.patchValue({
      // paymode: this.defaultformData.paymode,
      customer: this.defaultformData.customer,
      InvSeries: this.defaultformData.invoiceseries,
      invoicenumber: this.defaultformData.invoicenumber,
      invdate: this.defaultformData.invdate,
      salesmanid: this.defaultformData.salesmanid
    })
  }



  save(isValid: boolean, isPrint: boolean): void {
    debugger;
    if (isValid && confirm("Please confirm.")) {
      let saveobj = this.salesform.getRawValue();
      saveobj.invdate = new Date().toLocaleString();//saveobj.invdate.toLocaleString(); 
      saveobj.vouchertype =saveobj.vouchertype.VTID;
        this.userAccess.Save = false;
        this.invservice.InvoiceDataService('api/accounts/save/', saveobj)
          .subscribe(
            data => {
              this.userAccess.Save = true;
              if (data) {
                if (data['IsSuccess']) {
                  this.message.success("Saved successfully"); 
                    this.reset();
                  } 
                else {
                  this.message.error(data['Message'] + " Please try again");
                }
              }
              else {
                this.message.error("Error while communicating with server. Please try again");
              }
            },
            err => {
              this.userAccess.Save = true;
              this.message.error("Error while communicating with server. Please try again");
              this.sessiondata.handleError(err);
            });
      }
      else {
        this.message.error("Invalid input data. Please check again");
      } 
  }

  reset(): void {
    this.itemdatachange = 1;

    this.defaultformData.customer.custid = 0;
    this.defaultformData.customer.name = "";
    this.defaultformData.customer.address = "";
    this.defaultformData.customer.phone = "";

    this.salesform.patchValue({
      vouchertype: "P",
      invseries: this.defaultformData.invoiceseries,
      invoicenumber: this.defaultformData.invoicenumber,
      invdate: this.defaultformData.invdate,
      salesmanid: this.defaultformData.salesmanid,
      customer: this.defaultformData.customer,
      transactiontype: '',
      accountid: '0',
      accountheadcode: '',
      transactionaccount:'',
      tranaccountid:'0',
      amount:0,
      narration: '',
      chequeno: '',
      chequedate: '',

    });

    this.salesform.updateValueAndValidity();
    this.loadData();

    this.itemdatachange = 0;
  }


}



