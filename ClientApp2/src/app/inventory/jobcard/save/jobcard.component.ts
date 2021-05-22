import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { InvoiceModel, CustomerDetails, InvoiceNumeber, ItemModel, SaleMasterData, TaxCategory } from '../../../_model/index';
import { AlertService, InventoryService, LocalDataService } from '../../../_services/index';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerSearchComponent } from '../../customer/search/customersearch.component';
// const password = new FormControl('', Validators.required);
// const confirmPassword = new FormControl('', CustomValidators.equalTo(password));


export const JobCardData: any = {
  srseries: 'JC',
  srinvoicenumber: '',
  srinvoicedate: new Date(),
  invoicenumber: '',
  invoiceseries: 'PR',
  invdate: new Date(),
  EstDelivery:new Date (new Date().getTime()+(86400000*30)),
  paymode: 'CASH',
  salesmanid: '',
  iswithwarranty: false,
  guaranteecard: "",
  customer: <CustomerDetails>
    {
      name: 'Customer 0',
      phone: '',
      address: '',
      email: '',
      postalcode: '',
      gst: '',
      cusstate: 'KL',
      custid: '0'
    },
  items: [],
  totalvalue: 0,
  sgstAmt: 0,
  cgstAmt: 0,
  kfcessAmt: 0,
  netamount: 0,
  roundoff: 0,
  grandtotal: 0
};

@Component({
  selector: 'app-jobcard',
  templateUrl: './jobcard.component.html',
  styleUrls: ['./jobcard.component.scss']
})
export class JobCardComponent implements OnInit {

  public salesform: FormGroup;
  public theBoundCallback: Function;
  custdialogRef: MatDialogRef<CustomerSearchComponent> | null;
  userAccess: any = {};
  defaultformData: any;
  itemdatachange = 0;
  invSeriesData = [
    { value: 'PR', viewValue: 'PR' },
    { value: 'KR', viewValue: 'KR' },
    { value: 'MR', viewValue: 'MR' },
    { value: 'NW', viewValue: 'NW' } 
  ];

  jcSeriesData = [
    { value: 'JC', viewValue: 'JC' }
  ];
  salesmanlist = [];
  enableKFcess: boolean = true;
  refFinyearData = [];
  jcloadItems: any = [];
  taxdtls: TaxCategory;
  isDisableItemEdit: boolean = true;
  constructor(
    private fb: FormBuilder,
    private invservice: InventoryService,
    public sessiondata: LocalDataService,
    private message: AlertService,
    public dialog: MatDialog) { }


  ngOnInit() {
    this.defaultformData = JobCardData;
    this.userAccess = this.sessiondata.getUserAccess("JOBCARD");
    this.createForm();
    this.ngOnChange();
    this.loadData();
    this.loadItem();
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
    this.invservice.getInvoiceCommonData('api/jobcard/master/')
      .subscribe((data: SaleMasterData) => {
        if (data) {
          this.salesmanlist = data.SaleMan;
          this.defaultformData.salesmanid = this.sessiondata.getSessionData().EmpID.toString();
          this.defaultformData.customer.name = 'Customer ' + data.InvNo.InvNo;
          this.taxdtls = data.TaxDtls[0];

          this.refFinyearData = data.Finyear;
          if (this.refFinyearData && this.refFinyearData.length > 0) {
            this.salesform.patchValue({
              refFinyear: this.refFinyearData[0].FinYearID
            });
          }
          this.salesform.patchValue({
            salesmanid: this.defaultformData.salesmanid,
            customer: this.defaultformData.customer,
            srseries: data.InvNo.InvSeries,
            srinvoicenumber: data.InvNo.InvNo
          });

        }
        else {
          this.salesform.patchValue({
            srinvoicenumber: ''
          });
        }

      },
        err => {
          this.sessiondata.handleError(err);
          // this.alertService.error(err);
          //this.loading = false;
        });
  }

  loadItem() {
    localStorage.removeItem('jobcarditemlist');
    this.invservice.InvoiceDataService('api/getitemlist/', { PageType: "JOBCARD" })
      .subscribe(
        data => {
          if (data) {
            localStorage.setItem('jobcarditemlist', JSON.stringify(data));
          }
          else {

          }

        },
        err => {
          this.sessiondata.handleError(err);
          // this.alertService.error(err);
          //this.loading = false;
        });
  }

  ngOnChange() {
    this.salesform.get("roundoff").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.setItemData();
      }
    });

    this.salesform.get("iswithwarranty").valueChanges.subscribe(item => {
      console.log(item);
      if (item == true) {
        this.salesform.get("guaranteecard").setValidators(Validators.required);
      }
      else {
        this.salesform.get("guaranteecard").clearValidators();
      }

      this.salesform.get("guaranteecard").updateValueAndValidity();
    });

    this.salesform.get("invoicenumber").valueChanges.subscribe(item => {
      this.getInvoiceData();
    });

    // this.salesform.get("InvSeries").valueChanges.subscribe(item => {
    //   this.getInvoiceData();
    // });

    this.salesform.get("refFinyear").valueChanges.subscribe(item => {
      if (item == "0" ) {
        this.clearList_OnInvNotfound();
        //this.salesform.get('invoicenumber').setValidators([Validators.required, Validators.min(1)]);
        this.isDisableItemEdit = false; 
        this.addItems();
        this.itemlistupdated(null, "delete");
      }
      else {
        this.clearList_OnInvNotfound();
        //this.salesform.get('invoicenumber').setValidators([Validators.required, Validators.min(1)]);
        this.isDisableItemEdit = true;
      }

     // this.salesform.get('refFinyear').updateValueAndValidity(); 
      this.getInvoiceData();
    });
  }


  createForm() {

    this.salesform = this.fb.group({
      iswithwarranty: [false],

      srseries: [{ value: 'JC', disabled: false }, Validators.required],
      srinvoicenumber: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      srinvoicedate: [{ value: '', disabled: true }, Validators.compose([Validators.required, CustomValidators.date])],
      refFinyear: [''],
      InvSeries: [{ value: 'PR', disabled: false }, Validators.required],
      invoicenumber: [0, { updateOn: 'blur', validators: Validators.compose([Validators.required, Validators.min(1)]) }],//[{ value: '', disabled: false }, Validators.compose([Validators.required])],
      invdate: [null, Validators.compose([Validators.required, CustomValidators.date])],
      customer: this.fb.group({
        name: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25)])],
        phone: [null, Validators.compose([Validators.minLength(6), Validators.maxLength(25)])],
        address: [null],
        custid: ['0']
      }),
      Comments: [null],
      salesmanid: ['', Validators.required],
      guaranteecard: [''],
      guaranteedate: [null, Validators.compose([CustomValidators.date])],
      EstDelivery: [null, Validators.compose([Validators.required, CustomValidators.date])],

      items: this.fb.array([]),
      //total section
      totalvalue: [{ value: 0, disabled: true }, Validators.required],
      sgstAmt: [{ value: 0, disabled: false }, Validators.compose([Validators.required, Validators.min(0)])],
      cgstAmt: [{ value: 0, disabled: false }, Validators.compose([Validators.required, Validators.min(0)])],
      kfcessAmt: [{ value: 0, disabled: false }, Validators.compose([Validators.required, Validators.min(0)])],
      netamount: [{ value: 0, disabled: true }, Validators.required],
      roundoff: [{ value: 0, disabled: true }, Validators.required],
      grandtotal: [{ value: 0, disabled: true }, Validators.required]
    });

    // add address
    this.addItems();


    //console.log(this.defaultformData.customer);
    this.salesform.patchValue({
      // paymode: this.defaultformData.paymode,
      customer: this.defaultformData.customer,
      srseries: this.defaultformData.invoiceseries,
      srinvoicenumber: this.defaultformData.invoicenumber,
      srinvoicedate: this.defaultformData.invdate,
      InvSeries: this.defaultformData.invoiceseries,
      invoicenumber: this.defaultformData.invoicenumber,
      invdate: this.defaultformData.invdate,
      salesmanid: this.defaultformData.salesmanid,
      EstDelivery:this.defaultformData.EstDelivery
    })
  }

  initItems() {
    return this.fb.group({
      itemcode: [{ value: '', disabled: this.isDisableItemEdit }, Validators.required],
      itemid: [''],
      tid: [''],
      itemname: [{ value: '', disabled: true }, Validators.required],
      qty: [{ value: '', disabled: false }, Validators.required],
      price: [{ value: '', disabled: false }, Validators.required],
      weight: [{ value: '', disabled: false }],
      servicedesc: [{ value: 'Service', disabled: false }],
      uom: [{ value: '', disabled: true }, Validators.required],
      discountper: [''],
      discount: [''],
      total: [{ value: '', disabled: true }, Validators.required],
      gst: [{ value: '', disabled: false }, Validators.required],
      sgst: [{ value: '', disabled: false }, Validators.required],
      cgst: [{ value: '', disabled: false }, Validators.required],
      kfcess: [{ value: '', disabled: false }, Validators.required],
      kfcess_back: [''],
      grossamt: [{ value: '', disabled: true }, Validators.required],
      mrp: [{ value: '', disabled: true }, Validators.required]
    });
  }

  addItems() {
    this.jcloadItems.push({ jcitem: false });
    const control = <FormArray>this.salesform.controls['items'];
    const addrCtrl = this.initItems();

    control.push(addrCtrl);

    /* subscribe to individual address value changes */
    // addrCtrl.valueChanges.subscribe(x => {
    //   console.log(x, 'Main page 2');
    // })addrCtrl.valueChanges.subscribe(x => {
    //   console.log(x, 'Main page 2');
    // })
  }

  removeItem(i: number) {
    const control = <FormArray>this.salesform.controls['items'];
    this.jcloadItems.splice(i, 1);
    control.removeAt(i);
    this.itemlistupdated(null, "delete");
  }

  /// BInd Service Item based Job card
  clearList_OnInvNotfound() {
    this.jcloadItems = [];
    const control = <FormArray>this.salesform.controls['items'];
    let len = control.length;
    for (let i = len; i >= 0; i--)
      control.removeAt(i);

  }
  getInvoiceData() {
    //this.salesform.get('refFinyear').updateValueAndValidity(); 
   // this.salesform.get('invoicenumber').updateValueAndValidity(); 
    if (this.salesform.get("invoicenumber").valid 
    && this.salesform.get("refFinyear").value != "0" && this.itemdatachange == 0) {

      this.invservice.InvoiceDataService('api/sale/view/', {
        InvoiceNumber: this.salesform.get("invoicenumber").value,
        RefFinyear: this.salesform.get("refFinyear").value
      })
        .subscribe(
          data => {

            if (data) {
              if (data['Items'] && data['Items'].length > 0 && data['IsCancel'] == false) {
                this.jcloadItems = [];
                const control = <FormArray>this.salesform.controls['items'];
                let len = control.length;
                for (let i = len; i >= 0; i--)
                  control.removeAt(i);
                data['Items'].forEach(obj => {
                  if (typeof obj == 'object') {
                    obj['jcitem'] = true;
                    obj.SGST = this.taxdtls.SGST;
                    obj.CGST = this.taxdtls.CGST;
                    obj.KFcess = this.taxdtls.KFcess;
                    obj['MRP'] = parseFloat(obj.Price) + parseFloat((obj.Price * obj.SGST / 100).toFixed(2))
                      + parseFloat((obj.Price * obj.CGST / 100).toFixed(2))
                      + parseFloat((obj.Price * obj.KFcess / 100).toFixed(2));;
                    this.jcloadItems.push(obj);
                    const addrCtrl = this.initItems();
                    control.push(addrCtrl);
                  }
                });

                this.salesform.patchValue({
                  invdate: new Date(data['InvDate']),
                    guaranteecard:data['guaranteecard'],
                    guaranteedate:new Date(data['guaranteedate']),
                    InvSeries:data['InvSeries'] ,
                });
                var result = data['Customer'];
                this.salesform.patchValue({
                  customer: {
                    phone: result.Phone,
                    // email: result.Email,
                    name: result.Name,
                    address: result.Address,
                    //  postalcode: result.PostalCode,
                    // gst: result.GST,
                    // cusstate: result.cusstate,
                    custid: result.CustID
                  }
                });
              }
              else {
                //this.clearList_OnInvNotfound()
                this.message.error("Invoice not found / Cancelled. Please try again");
                //this.salesform.patchValue({ invoicenumber: '0' });
              }
            }
            else {
              //this.clearList_OnInvNotfound()
              this.message.error("Invoice not found / Cancelled. Please try again");
              //this.salesform.patchValue({ invoicenumber: '0' });
            }
          },
          err => {
            this.message.error("Error while communicating with server. Please try again");
            this.sessiondata.handleError(err);
          });
    }
  }

  getDateform() {
  }

  itemlistupdated(event, param): void {

    let totatlvalue = 0, sgstamt = 0, cgstamt = 0, netamt = 0, kfcessamt = 0,
      roundoff = 0, grandtotal = 0;
    let saleobj = this.salesform.getRawValue();

    saleobj.items.forEach(obj => {
      if (typeof obj.itemcode == 'object') {
        totatlvalue = totatlvalue + (obj.qty * obj.price);
        sgstamt = sgstamt + this.sessiondata.roundToTwo(obj.total * obj.sgst / 100);
        cgstamt = cgstamt + this.sessiondata.roundToTwo(obj.total * obj.cgst / 100);
        kfcessamt = kfcessamt + this.sessiondata.roundToTwo(obj.total * obj.kfcess / 100);
        // netamt = netamt + totatlvalue + sgstamt + cgstamt;


      }
    });

    netamt = totatlvalue + sgstamt + cgstamt + kfcessamt;
    this.itemdatachange = 1;
    this.salesform.patchValue({
      totalvalue: parseFloat(totatlvalue.toFixed(2)),
      sgstAmt: parseFloat(sgstamt.toFixed(2)),
      cgstAmt: parseFloat(cgstamt.toFixed(2)),
      kfcessAmt: parseFloat(kfcessamt.toFixed(2)),
      netamount: parseFloat(netamt.toFixed(2))
    });

    this.itemdatachange = 0;
    this.setItemData();


  }

  setItemData() {
    this.itemdatachange = this.itemdatachange + 1;
    if (this.itemdatachange == 1) {

      this.salesform.updateValueAndValidity();
      let obj = this.salesform.getRawValue();

      if (!obj.totalvalue) {
        obj.totalvalue = 0;
      }

      if (!obj.sgstAmt) {
        obj.sgstAmt = 0;
      }

      if (!obj.cgstAmt) {
        obj.cgstAmt = 0;
      }

      if (!obj.kfcessAmt) {
        obj.kfcessAmt = 0;
      }

      if (!obj.netamount) {
        obj.netamount = 0;
      }

      if (!obj.roundoff) {
        obj.roundoff = 0;
      }


      if (!obj.grandtotal) {
        obj.grandtotal = 0;
      }

      obj.grandtotal = parseFloat((obj.netamount - obj.roundoff).toFixed(2));



      this.salesform.patchValue(
        {
          totalvalue: obj.totalvalue,
          sgstAmt: obj.sgstAmt,
          cgstAmt: obj.cgstAmt,
          kfcessAmt: obj.kfcessAmt,
          netamount: obj.netamount,
          roundoff: obj.roundoff,
          grandtotal: obj.grandtotal
        }
      );

    }

    this.itemdatachange = 0;
  }


  save(isValid: boolean, isPrint: boolean): void {
    if (isValid && confirm("Please confirm.")) {
      let salevalue: any = this.salesform.getRawValue();
      salevalue.srdate = new Date().toLocaleString();
      this.userAccess.Save = false;
      this.invservice.InvoiceDataService('api/jobcard/save/', salevalue)
        .subscribe(
          data => {
            this.userAccess.Save = true;
            if (data) {
              if (data['IsSuccess']) {
                this.message.success("Saved successfully");
                if (isPrint) {
                  this.sessiondata.redirect("service/jobcard/view/", { print: true, id: data["RetID"] });
                }
                else {
                  this.reset();
                }
              }
            }
            else {
              this.message.error(data['Message'] + " Please try again");
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
    this.jcloadItems = [];
    const control = <FormArray>this.salesform.controls['items'];
    let len = control.length;
    for (let i = len; i >= 0; i--)
      control.removeAt(i);

    this.salesform.patchValue({
      // paymode: this.defaultformData.paymode,
      srseries: this.defaultformData.srseries,
      srinvoicenumber: this.defaultformData.srinvoicenumber,
      InvSeries: this.defaultformData.invoiceseries,
      invoicenumber: this.defaultformData.invoicenumber,
      invdate: this.defaultformData.invdate,
      salesmanid: this.defaultformData.salesmanid,
      customer: this.defaultformData.customer,
      EstDelivery: this.defaultformData.EstDelivery,
      iswithwarranty: this.defaultformData.iswithwarranty,
      guaranteecard: this.defaultformData.guaranteecard,
      guaranteedate: "",
      
      totalvalue: 0,
      sgstAmt: 0,
      cgstAmt: 0,
      kfcessAmt: 0,
      netamount: 0,
      roundoff: 0,
      grandtotal: 0
    });

    this.salesform.updateValueAndValidity();
    this.addItems();
    this.loadData();
    this.loadItem();
    this.itemdatachange = 0;
  }

  searchcustomer() {
    this.custdialogRef = this.dialog.open(CustomerSearchComponent, {
      data: {
        description: 'Job Card'
      }
    });

    this.custdialogRef.afterClosed().subscribe((result: any) => {
     // console.log(result);
      if (result) {
        this.salesform.patchValue({
          customer: {
            phone: result.Phone,
            name: result.Name,
            address: result.Address,
            custid: result.CustID
          }
        });
      }

      this.custdialogRef = null;
    });
  }
}
