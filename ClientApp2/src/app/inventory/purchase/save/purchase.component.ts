import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { InvoiceModel, CustomerDetails, InvoiceNumeber, ItemModel, SaleMasterData, TaxCategory } from '../../../_model/index';
import { AlertService, InventoryService, LocalDataService } from '../../../_services/index';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CustomerSearchComponent } from '../../customer/search/customersearch.component';
import { InvoiceImportSearchComponent } from '../../importinvoice/search/invoiceimport.component';
// const password = new FormControl('', Validators.required);
// const confirmPassword = new FormControl('', CustomValidators.equalTo(password));


export const PurchaseData: any = {
  srseries: 'PR',
  purchasetype: 'UNREGISTERED',
  invtype: 'LOCAL',
  srinvoicenumber: '',
  srinvoicedate: new Date(),
  invoicenumber: '',
  invoiceseries: 'PR',
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
      cusstate: '',
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
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  public salesform: FormGroup;
  public theBoundCallback: Function;
  custdialogRef: MatDialogRef<CustomerSearchComponent> | null;
  invimportdialogRef: MatDialogRef<InvoiceImportSearchComponent> | null;
  userAccess: any = {};

  defaultformData: any;
  itemdatachange = 0;
  discountperchange = 0;
  discountchange = 0;
  defaultstatecode: string = "";
  showStateError: boolean = false;
  TotalQty: number = 0;
  purchasetypedata = [
    { value: 'UNREGISTERED', viewValue: 'UNREGISTERED' },
    { value: 'LOCAL', viewValue: 'Local' },
    { value: 'INTERSTATE', viewValue: 'InterState' }
  ];

  invSeriesData = [
    { value: 'PR', viewValue: 'PR' },
    { value: 'KR', viewValue: 'KR' },
    { value: 'MR', viewValue: 'MR' },
    { value: 'NW', viewValue: 'NW' } ,
    { value: 'GLS', viewValue: 'GLS' }   
  ];
  salesmanlist = [];
  enableKFcess: boolean = true;
  enableIgst: boolean = false;
  enableTax: boolean = false;
  refFinyearData = [];
  refFinyearData_unreg = [];
  jcloadItems: any = [];
  taxdtls: TaxCategory;
  branchlist = [];
  isEnableImport: boolean = false;
  isDisableItemEdit: boolean = true;
  importinvoiceid: number = 0;

  constructor(
    private fb: FormBuilder,
    private invservice: InventoryService,
    public sessiondata: LocalDataService,
    private message: AlertService,
    public dialog: MatDialog) { }


  ngOnInit() {
    this.defaultformData = PurchaseData;
    this.userAccess = this.sessiondata.getUserAccess("PURCHASE");
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
    this.invservice.getInvoiceCommonData('api/purchase/master/')
      .subscribe((data: SaleMasterData) => {
        if (data) {
          this.salesmanlist = data.SaleMan;
          this.branchlist = data.Branches;
          this.defaultformData.salesmanid = this.sessiondata.getSessionData().EmpID.toString();
          this.defaultformData.customer.name = 'Customer ' + data.InvNo.InvNo;
          this.defaultformData.customer.cusstatecode = data.States.cusstatecode;
          this.defaultstatecode = data.States.cusstatecode;
          this.defaultformData.customer.cusstate = data.States.cusstate;
          this.taxdtls = data.TaxDtls[0];
          this.refFinyearData = data.Finyear;
          this.refFinyearData_unreg = data.Finyear;

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
          this.message.error("Error while communicating with server. Please try again");
          this.sessiondata.handleError(err);
        });
  }

  loadItem() {
    localStorage.removeItem('purchaseitemlist');
    this.invservice.InvoiceDataService('api/getitemlist/', { PageType: "PURCHASE" })
      .subscribe(
        data => {
          if (data) {
            localStorage.setItem('purchaseitemlist', JSON.stringify(data));
          }
          else {

          }

        },
        err => {
          this.message.error("Error while communicating with server. Please try again");
          this.sessiondata.handleError(err);
        });
  }

  ngOnChange() {
    this.salesform.get("roundoff").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.setItemData();
      }
    });

    this.salesform.get("totdiscbtaxPer").valueChanges.subscribe(item => {

      this.salesform.updateValueAndValidity();
      if (this.itemdatachange == 0) {
        this.discountperchange = 1;
        this.setDiscountBeforeTax(this.salesform.get("totdiscbtaxPer").value, "per");
        // this.setItemData();
      }
    });

    this.salesform.get("totdiscbtaxval").valueChanges.subscribe(item => {
      this.salesform.updateValueAndValidity();
      if (this.itemdatachange == 0) {
        this.discountchange = 1;
        this.setDiscountBeforeTax(this.salesform.get("totdiscbtaxval").value, "val");
        //this.setItemData();
      }
    });

    this.salesform.get("purchasetype").valueChanges.subscribe(item => {
      this.showStateError = false;
      if (item == "UNREGISTERED") {
        this.isEnableImport = false;
        this.isDisableItemEdit = true;
        //this.salesform.get('tobranchid').clearValidators();
        this.refFinyearData = this.refFinyearData_unreg;
        if (this.refFinyearData && this.refFinyearData.length > 0) {
          this.salesform.patchValue({
            refFinyear: this.refFinyearData[0].FinYearID
          });
        }
      }
      else {

        this.isEnableImport = true;
        this.isDisableItemEdit = true;
        if (this.itemdatachange == 0) {
          this.clearList_OnInvNotfound();

          this.salesform.patchValue({
            invoicenumber: ''
          });

          //this.itemlistupdated(null, "delete");
        }
      }


      if (this.itemdatachange == 0) {
        this.setKFCessForGST(this.salesform.get("customer").get("gst").value);
        // this.setItemData();
      }
    });

    this.salesform.get("invoicenumber").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        //  console.log(this.salesform.get("invoicenumber").value);
        this.getInvoiceData();
      }
    });

    this.salesform.get("refFinyear").valueChanges.subscribe(item => {
      if (item == "0" && this.isEnableImport == false) {
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
      
      ///this.salesform.get('refFinyear').updateValueAndValidity(); 
      if (this.itemdatachange == 0) {
        ///console.log(this.salesform.get("invoicenumber").value);
        this.getInvoiceData();
      }
    });



    this.salesform.get("customer").get("gst").valueChanges.subscribe(item => {

      this.salesform.updateValueAndValidity();
      if (this.itemdatachange == 0) {
        this.setKFCessForGST(this.salesform.get("customer").get("gst").value);
        // this.setItemData();
      }
    });

  }


  // loadBranchDetails() {
  //   var item = this.salesform.get("tobranchid").value;
  //   if (item) {
  //     this.defaultformData.customer.custid = item.BranchID;
  //     this.defaultformData.customer.name = item.BranchName;
  //     this.defaultformData.customer.address = item.Br_Adrs;
  //     this.defaultformData.customer.phone = item.Br_Ph;
  //     this.salesform.patchValue({
  //       customer: this.defaultformData.customer,
  //     });
  //     this.refFinyearData = JSON.parse(item.FinYear);
  //     if (this.refFinyearData && this.refFinyearData.length > 0) {
  //       this.salesform.patchValue({
  //         refFinyear: this.refFinyearData[0].FinYearID
  //       });
  //     }

  //     this.itemdatachange = 0
  //     //this.loadDeliveryItem();
  //   }
  // }

  createForm() {

    this.salesform = this.fb.group({
      paymode: [{ value: 'CASH' }, Validators.required],
      purchasetype: [{ value: 'UNREGISTERED', disabled: false }, Validators.required],
      // tobranchid: [null],
      srseries: [{ value: 'PR', disabled: false }, Validators.required],
      srinvoicenumber: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      srinvoicedate: [{ value: '', disabled: !this.userAccess.datechange }, Validators.compose([Validators.required, CustomValidators.date])],
      refFinyear: [''],
      InvSeries: [{ value: 'PR', disabled: false }, Validators.required],
      invoicenumber: [0, { updateOn: 'blur', validators: Validators.compose([Validators.required, Validators.min(1)]) }],
      invdate: [null, Validators.compose([Validators.required, CustomValidators.date])],
      customer: this.fb.group({
        name: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25)])],
        phone: [null, Validators.compose([Validators.minLength(6), Validators.maxLength(25)])],
        address: [null],
        custid: ['0'],
        cusstate: [{ value: '', disabled: true }],
        cusstatecode: [null],
        gst: [null, { updateOn: 'blur' }],
      }),
      Comments: [null],
      salesmanid: ['', Validators.required],
      items: this.fb.array([]),
      //total section
      totalvalue: [{ value: 0, disabled: true }, Validators.required],
      totdiscbtaxPer: [0, { updateOn: 'blur', validators: Validators.required }],
      totdiscbtaxval: [0, { updateOn: 'blur', validators: Validators.required }],
      grossamount: [{ value: 0, disabled: true }, Validators.required],
      sgstAmt: [{ value: 0, disabled: false }, Validators.required],
      cgstAmt: [{ value: 0, disabled: false }, Validators.required],
      igstAmt: [{ value: 0, disabled: false }, Validators.required],
      kfcessAmt: [{ value: 0, disabled: true }, Validators.required],
      netamount: [{ value: 0, disabled: true }, Validators.required],
      roundoff: [0, { updateOn: 'blur', validators: Validators.required }],
      grandtotal: [{ value: 0, disabled: true }, Validators.required]
    });

    // add address
    this.addItems();


    //console.log(this.defaultformData.customer);
    this.salesform.patchValue({
      paymode: this.defaultformData.paymode,
      purchasetype: this.defaultformData.purchasetype,
      customer: this.defaultformData.customer,
      srseries: this.defaultformData.invoiceseries,
      srinvoicenumber: this.defaultformData.invoicenumber,
      srinvoicedate: this.defaultformData.invdate,
      InvSeries: this.defaultformData.invoiceseries,
      invoicenumber: this.defaultformData.invoicenumber,
      invdate: this.defaultformData.invdate,
      salesmanid: this.defaultformData.salesmanid
    })
  }

  initItems() {
    return this.fb.group({
      ivid: ['0'],
      itemcode: [{ value: '', disabled: this.isDisableItemEdit }, Validators.required],
      itemid: [''],
      tid: [''],
      itemname: [{ value: '', disabled: true }, Validators.required],
      qty: [{ value: '', disabled: this.isEnableImport }, Validators.required],
      price: [{ value: '', disabled: this.isEnableImport }, Validators.required],
      uom: [{ value: '', disabled: true }, Validators.required],
      discountper: [{ value: '', disabled: this.isEnableImport }],
      discount: [{ value: '', disabled: this.isEnableImport }],
      total: [{ value: '', disabled: true }, Validators.required],
      gst: [{ value: '', disabled: true }, Validators.required],
      sgst: [{ value: '', disabled: true }, Validators.required],
      cgst: [{ value: '', disabled: true }, Validators.required],
      kfcess: [{ value: '', disabled: true }, Validators.required],
      gst_back: [''],
      sgst_back: [''],
      cgst_back: [''],
      kfcess_back: [''],
      grossamt: [{ value: '', disabled: true }, Validators.required],
      mrp: [{ value: '', disabled: true }, Validators.required],
      weight:[{ value: '', disabled: false }, Validators.required]
    });
  }

  addItems() {
    this.jcloadItems.push({ jcitem: false });
    const control = <FormArray>this.salesform.controls['items'];
    const addrCtrl = this.initItems();
    control.push(addrCtrl);
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
   // this.salesform.get('refFinyear').updateValueAndValidity(); 
    //this.salesform.get('invoicenumber').updateValueAndValidity(); 
    if (this.salesform.get("invoicenumber").valid 
    && this.salesform.get("refFinyear").value != "0" && this.itemdatachange == 0) {

      this.invservice.InvoiceDataService('api/sale/view/', {
        InvoiceNumber: this.salesform.get("invoicenumber").value,
        RefFinyear: this.salesform.get("refFinyear").value,
        IsImport: this.importinvoiceid != 0
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
                    // if (this.enableTax==false) {
                    //   obj.Discount = 0;
                    //   obj.SGST = this.taxdtls.SGST;
                    //   obj.CGST = this.taxdtls.CGST;
                    //   obj.KFcess = this.taxdtls.KFcess;
                    //   obj['MRP'] = parseFloat(obj.Price) + parseFloat((obj.Price * obj.SGST / 100).toFixed(2))
                    //     + parseFloat((obj.Price * obj.CGST / 100).toFixed(2))
                    //     + parseFloat((obj.Price * obj.KFcess / 100).toFixed(2));
                    // }

                    this.jcloadItems.push(obj);
                    const addrCtrl = this.initItems();
                    control.push(addrCtrl);
                  }
                });

                this.salesform.patchValue({
                  invdate: new Date(data['InvDate']),
                  InvSeries:data['InvSeries'] ,
                  srseries:data['InvSeries']  
                });

                if (this.importinvoiceid == 0) {
                  var result = data['Customer'];
                  this.salesform.patchValue({
                    //invtype: data['invtype'],
                    customer: {
                      name: result.Name,
                      phone: result.Phone,
                      address: result.Address,
                      gst: result.GST,
                      cusstate: result.cusstate,
                      cusstatecode: result.cusstatecode,
                      custid: result.CustID
                    }
                  });
                }
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

    let totatlvalue = 0, sgstamt = 0, cgstamt = 0, netamt = 0, kfcessamt = 0, igstamt = 0,
      roundoff = 0, grandtotal = 0, grossamount = 0, discount = 0, discount_per = 0;
    let saleobj = this.salesform.getRawValue();
this.TotalQty=0;
    saleobj.items.forEach(obj => {
      if (typeof obj.itemcode == 'object') {
        totatlvalue = totatlvalue + (obj.qty * obj.price);
        discount = discount + obj.discount;
        sgstamt = sgstamt + this.sessiondata.roundToTwo(obj.total * obj.sgst / 100);
        cgstamt = cgstamt + this.sessiondata.roundToTwo(obj.total * obj.cgst / 100);
        igstamt = igstamt + this.sessiondata.roundToTwo(obj.total * obj.gst / 100);
        kfcessamt = kfcessamt + this.sessiondata.roundToTwo(obj.total * obj.kfcess / 100);
        //netamt = netamt + totatlvalue + sgstamt + cgstamt; 
        this.TotalQty  = this.TotalQty +obj.qty;
      }
    });

    grossamount = totatlvalue - discount;

    if (discount != 0 && totatlvalue != 0) {
      discount_per = discount / totatlvalue * 100;
    }

    if (this.enableIgst) {
      sgstamt = 0;
      cgstamt = 0;
    }
    else {
      igstamt = 0;
    }

    netamt = totatlvalue - discount + sgstamt + cgstamt + kfcessamt + igstamt;

    this.itemdatachange = 1;
    this.salesform.patchValue({
      totalvalue: parseFloat(totatlvalue.toFixed(2)),
      totdiscbtaxPer: parseFloat(discount_per.toFixed(2)),
      totdiscbtaxval: parseFloat(discount.toFixed(2)),
      grossamount: parseFloat(grossamount.toFixed(2)),
      sgstAmt: parseFloat(sgstamt.toFixed(2)),
      cgstAmt: parseFloat(cgstamt.toFixed(2)),
      igstAmt: parseFloat(igstamt.toFixed(2)),
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
      if (!obj.totdiscPer) {
        obj.totdiscPer = 0;
      }

      if (!obj.totdiscval) {
        obj.totdiscval = 0;
      }

      if (!obj.grossamount) {
        obj.grossamount = 0;
      }

      if (!obj.sgstAmt) {
        obj.sgstAmt = 0;
      }

      if (!obj.cgstAmt) {
        obj.cgstAmt = 0;
      }

      if (!obj.igstAmt) {
        obj.igstAmt = 0;
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

      if (this.discountperchange == 1) {
        if (!obj.totdiscPer)
          obj.totdiscPer = 0;
        obj.totdiscval = parseFloat((obj.netamount * obj.totdiscPer / 100).toFixed(2));
      }
      else if (this.discountchange == 1) {
        if (!obj.totdiscval)
          obj.totdiscval = 0;
        if (obj.netamount == 0)
          obj.totdiscPer = 0;
        else
          obj.totdiscPer = parseFloat((obj.totdiscval / obj.netamount * 100).toFixed(2));
      }

      obj.grandtotal = parseFloat((obj.netamount - obj.roundoff).toFixed(2));



      this.salesform.patchValue(
        {
          totalvalue: obj.totalvalue,
          totdiscPer: obj.totdiscPer,
          totdiscval: obj.totdiscval,
          grossamount: obj.grossamount,
          sgstAmt: obj.sgstAmt,
          cgstAmt: obj.cgstAmt,
          igstAmt: obj.igstAmt,
          kfcessAmt: obj.kfcessAmt,
          netamount: obj.netamount,
          roundoff: obj.roundoff,
          grandtotal: obj.grandtotal
        }
      );

    }

    this.itemdatachange = 0;
  }

  setDiscountBeforeTax(val: number, type: string) {
    const control = <FormArray>this.salesform.get("items");
    //this.salesform.get("items").get("0").patchValue({discountper: 5})
    let totatlvalue = 0, totaltax = 0, grandtotal = 0;
    let saleobj = this.salesform.getRawValue();
    saleobj.items.forEach(obj => {
      if (typeof obj.itemcode == 'object') {
        totatlvalue = totatlvalue + (obj.qty * obj.mrp);
      }
    });

    saleobj.items.forEach((obj, index) => {
      if (typeof obj.itemcode == 'object') {
        if (type == "val") {
          var disc_row = parseFloat(((obj.qty * obj.mrp) / totatlvalue * val).toFixed(4));
          control.at(index).patchValue({
            discount: this.sessiondata.roundToTwo(disc_row * 100 / (100.00 + obj.gst + obj.sgst + obj.cgst + obj.kfcess))
          });
        }
        else {
          control.at(index).patchValue({
            discountper: val
          });
        }
      }
    });

    this.discountchange = 0;
    this.discountperchange = 0;
    this.itemlistupdated(null, null);
  }

  /// 
  setKFCessForGST(reggstno) {

    if (reggstno && reggstno != '') {
      this.enableKFcess = false;
    }
    else {
      this.enableKFcess = true;
    }

    if (this.salesform.get("purchasetype").value == "UNREGISTERED") {
      this.enableIgst = false;
      this.enableKFcess = false;
      this.enableTax = false;
      this.salesform.get("sgstAmt").clearValidators();
      this.salesform.get("cgstAmt").clearValidators();
      this.salesform.get("igstAmt").clearValidators();
    }
    else if (this.salesform.get("purchasetype").value == "LOCAL") {
      this.enableIgst = false;
      this.enableTax = true;
      this.salesform.get("sgstAmt").setValidators([Validators.required, Validators.min(.01)]);
      this.salesform.get("cgstAmt").setValidators([Validators.required, Validators.min(.01)]);
      this.salesform.get("igstAmt").clearValidators();
    }
    else if (this.salesform.get("purchasetype").value == "INTERSTATE") {
      this.enableIgst = true;
      this.enableKFcess = false;
      this.enableTax = true;
      this.salesform.get("sgstAmt").clearValidators();
      this.salesform.get("cgstAmt").clearValidators();
      this.salesform.get("igstAmt").setValidators([Validators.required, Validators.min(.01)]);
    }

    // console.log(this.enableKFcess, this.enableIgst, this.enableTax);
    const control = <FormArray>this.salesform.get("items");
    //this.salesform.get("items").get("0").patchValue({discountper: 5})
    let totatlvalue = 0, totaltax = 0, grandtotal = 0;
    let saleobj = this.salesform.getRawValue();


    saleobj.items.forEach((obj, index) => {
      if (typeof obj.itemcode == 'object') {
        if (this.enableKFcess) {
          control.at(index).patchValue({
            kfcess: control.at(index).get("kfcess_back").value
          });
        }
        else {
          control.at(index).patchValue({
            kfcess: 0
          });
        }

        if (this.enableTax == false) {
          control.at(index).patchValue({
            gst: 0,
            sgst: 0,
            cgst: 0,

          });
        }
        else if (this.enableIgst) {
          control.at(index).patchValue({
            gst: control.at(index).get("gst_back").value,
            sgst: 0,
            cgst: 0
          });
        }
        else if (this.enableTax) {
          control.at(index).patchValue({
            gst: 0,
            sgst: control.at(index).get("sgst_back").value,
            cgst: control.at(index).get("cgst_back").value
          });
        }

        control.at(index).patchValue({
          mrp: parseFloat(control.at(index).get("price").value)
            + parseFloat((control.at(index).get("price").value * control.at(index).get("sgst").value / 100).toFixed(2))
            + parseFloat((control.at(index).get("price").value * control.at(index).get("cgst").value / 100).toFixed(2))
            + parseFloat((control.at(index).get("price").value * control.at(index).get("gst").value / 100).toFixed(2))
            + parseFloat((control.at(index).get("price").value * control.at(index).get("kfcess").value / 100).toFixed(2))
        });
      }
    });

    this.discountchange = 0;
    this.itemdatachange = 0;
    this.itemlistupdated(null, null);
  }


  save(isValid: boolean, isPrint: boolean): void {
    this.showStateError = false;
    let salevalue: any = this.salesform.getRawValue();
    if ((salevalue.invtype == 'INTERSTATE' && salevalue.customer.cusstatecode == this.defaultstatecode)
      || (salevalue.invtype == 'LOCAL' && salevalue.customer.cusstatecode != this.defaultstatecode)) {
      this.showStateError = true;
    }

    if (isValid && confirm("Please confirm.")) {
      //let salevalue: any = this.salesform.getRawValue();
      salevalue.srdate = new Date().toLocaleString();
      this.userAccess.Save = false;
      this.invservice.InvoiceDataService('api/purchase/save', salevalue)
        .subscribe(
          data => {
            this.userAccess.Save = true;
            if (data) {
              if (data['IsSuccess']) {
                this.message.success("Saved successfully");
                if (isPrint) {
                  this.sessiondata.redirect("purchase/purchase/view", { print: true, id: data["RetID"] });
                }
                else {
                  this.reset();
                }
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
      if (this.showStateError) {
        this.message.error("Please check State and Invoice Type.");
      }
      else {
        this.message.error("Invalid input data. Please check again");
      }
    }
  }

  reset(): void {
    this.itemdatachange = 1;
    this.discountchange = 1;
    this.discountperchange = 1;
    this.showStateError = false;
    this.jcloadItems = [];
    const control = <FormArray>this.salesform.controls['items'];
    let len = control.length;
    for (let i = len; i >= 0; i--)
      control.removeAt(i);

    this.salesform.patchValue({
      paymode: this.defaultformData.paymode,
      purchasetype: this.defaultformData.purchasetype,
      srseries: this.defaultformData.srseries,
      srinvoicenumber: this.defaultformData.srinvoicenumber,
      InvSeries: this.defaultformData.invoiceseries,
      invoicenumber: this.defaultformData.invoicenumber,
      invdate: this.defaultformData.invdate,
      salesmanid: this.defaultformData.salesmanid,
      customer: this.defaultformData.customer,
      totalvalue: 0,
      sgstAmt: 0,
      cgstAmt: 0,
      igstAmt: 0,
      kfcessAmt: 0,
      netamount: 0,
      roundoff: 0,
      grandtotal: 0,
      grossamount: 0,
      totdiscPer: 0,
      totdiscval: 0
    });

    this.salesform.updateValueAndValidity();
    this.addItems();
    this.loadData();
    this.loadItem();
    this.itemdatachange = 0;
    this.discountperchange = 0;
    this.discountchange = 0;
  }

  searchcustomer() {
    this.custdialogRef = this.dialog.open(CustomerSearchComponent, {
      data: {
        description: 'Purchase'
      }
    });

    this.custdialogRef.afterClosed().subscribe((result: any) => {

      if (result) {
        this.salesform.patchValue({
          customer: {
            phone: result.Phone,
            name: result.Name,
            address: result.Address,
            custid: result.CustID,
            cusstate: result.cusstate,
            cusstatecode: result.cusstatecode
          }
        });
      }

      this.custdialogRef = null;
    });
  }

  searchInvoice() {
    this.invimportdialogRef = this.dialog.open(InvoiceImportSearchComponent, {
      data: {
        description: 'Sale',
        branchlist: this.branchlist
      }
    });

    this.invimportdialogRef.afterClosed().subscribe((result: any) => {

      if (result) {
        this.itemdatachange = this.itemdatachange + 1;
        this.importinvoiceid = result.IVID;
        this.refFinyearData = [{ FinYearID: result.RefFinyear, FinYear: result.RefFinyearName }];
        this.salesform.patchValue({
          refFinyear: result.RefFinyear,
          InvSeries: result.InvSeries,
          invoicenumber: result.SRInvNo,
          purchasetype: result.invtype,
          customer: {
            name: result.Branch.BranchName,
            phone: result.Branch.Br_Ph,
            address: result.Branch.Br_Adrs,
            gst: result.Branch.Brn_GST,
            cusstate: result.Branch.Br_State,
            cusstatecode: result.Branch.Br_StateCode,
            custid: result.Branch.CustID
          }
        });

        this.salesform.updateValueAndValidity();
        //console.log(result.SRInvNo, this.salesform.get("invoicenumber").value);
        this.itemdatachange = 0;
        this.setKFCessForGST(this.salesform.get("customer").get("gst").value);
        this.getInvoiceData();
      }

      this.custdialogRef = null;
    });
  }
}
