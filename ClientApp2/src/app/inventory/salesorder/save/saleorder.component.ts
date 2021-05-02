import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { InvoiceModel, CustomerDetails, InvoiceNumeber, ItemModel, SaleMasterData, Employee } from '../../../_model/index';
import { AlertService, InventoryService, LocalDataService } from '../../../_services/index';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CustomerSearchComponent } from '../../customer/search/customersearch.component';
// const password = new FormControl('', Validators.required);
// const confirmPassword = new FormControl('', CustomValidators.equalTo(password));


export const SaleData: any = {
  invoicenumber: '',
  invoiceseries: 'AV',
  invoicedate: new Date(),
  saletype: 'RT',
  iscard: false,
  iscash: true,
  salesmanid: '',
  iswithwarranty: false,
  warrantycardnum: '',
  reftype: '',
  refnum: '',
  customer: <CustomerDetails>
    {
      name: 'Customer 0',
      phone: '',
      address: '',
      email: '',
      postalcode: '',
      custid: '0'
    },
  gst: 3,
  cgst: 1.5,
  kgst: 1.5,
  items: [
    { itemid: '1', itemcode: 'Code 1', itemname: 'Items 1', price: 10, stockqty: 100, qty: 1, discount: 0, tax: 3, discountper: 0, uom: 'NOS', total: 0, grossamt: 0 },
    { itemid: '2', itemcode: 'Code 2', itemname: 'Items 2', price: 20, stockqty: 100, qty: 1, discount: 0, tax: 3, discountper: 0, uom: 'NOS', total: 0, grossamt: 0 },
    { itemid: '3', itemcode: 'Code 3', itemname: 'Items 3', price: 30, stockqty: 100, qty: 1, discount: 0, tax: 3, discountper: 0, uom: 'NOS', total: 0, grossamt: 0 },
  ],
  discount: 0,
  discountper: 0
};

@Component({
  selector: 'app-sales',
  templateUrl: './saleorder.component.html',
  styleUrls: ['./saleorder.component.scss']
})
export class SaleOrderComponent implements OnInit {

  public salesform: FormGroup;
  public theBoundCallback: Function;
  custdialogRef: MatDialogRef<CustomerSearchComponent> | null;
  userAccess: any = {};

  sale: any;
  itemdatachange = 0;
  discountperchange = 0;
  discountchange = 0;
  discountperchange_gift = 0;
  discountchange_gift = 0;
  DefaultEmpID = '0';
  states = [
    { value: 'KL', viewValue: 'Kerala' },
    { value: 'TN', viewValue: 'Tamilnadu' },
    { value: 'KA', viewValue: 'Karnadaka' },
    { value: 'AP', viewValue: 'Andrapradesh' }
  ]

  salesType = [
    { value: 'RT', viewValue: 'Retail' },
    { value: 'WH', viewValue: 'WholeSale' }
  ];

  invSeriesData = [
    { value: 'AV', viewValue: 'AV' },
    { value: 'AR', viewValue: 'AR' }
  ];

  refferenceType = [
    { value: '', viewValue: 'None' },
    { value: 'Advance', viewValue: 'Advance' },
    { value: 'Customer', viewValue: 'Customer' },
    { value: 'Staff', viewValue: 'Staff' }
  ];

  salesmanlist = [];
  sinvno: any;
  finvno: any;
  enableKFcess: boolean = true;
  enableIgst: boolean = false;
  enableTax: boolean = true;
  constructor(
    private fb: FormBuilder,
    private invservice: InventoryService,
    public sessiondata: LocalDataService,
    private message: AlertService,
    public dialog: MatDialog) { }


  ngOnInit() {
    this.sale = <InvoiceModel>JSON.parse(JSON.stringify(SaleData));
    this.userAccess = this.sessiondata.getUserAccess("SALEORDER");
    this.createForm();
    this.ngOnChange();
    this.loadData();
    this.loadItem();
    this.theBoundCallback = this.theCallback.bind(this);
    this.sessiondata.globalOnchanges.subscribe(data => {
      // console.log(data);
    });
  }

  public theCallback() {
    //console.log("Callback Parent", this);
    //this.theBoundCallback();
  }

  loadData() {
    this.invservice.getInvoiceCommonData('api/salesorder/master/')
      .subscribe((data: SaleMasterData) => {
        if (data) {
          this.salesmanlist = data.SaleMan;
          this.sinvno = data.InvNo;
          this.finvno = data.FInvNo;

          // console.log(this.salesmanlist);
          this.sale.salesmanid = this.sessiondata.getSessionData().EmpID.toString();
          this.sale.customer.name = 'Customer ' + data.InvNo.InvNo;
          this.salesform.patchValue({
            salesmanid: this.sale.salesmanid,
            customer: this.sale.customer,
            InvSeries: data.InvNo.InvSeries,
            invoicenumber: data.InvNo.InvNo//.InvDisaply
          });

        }
        else {
          this.salesform.patchValue({
            invoicenumber: ''
          });
        }

      },
        err => {
          this.message.error(err);
          this.sessiondata.handleError(err);
        });
  }

  loadItem() {
    localStorage.removeItem('saleorderitemlist');
    this.invservice.InvoiceDataService('api/getitemlist/', { PageType: "SALEORDER" })
      .subscribe(
        data => {
          if (data) {
            localStorage.setItem('saleorderitemlist', JSON.stringify(data));
          }
          else {
          }

        },
        err => {
          this.message.error(err);
          this.sessiondata.handleError(err);
        });
  }

  ngOnChange() {
    this.salesform.get("InvSeries").valueChanges.subscribe(item => {
      console.log(item);
      if (item == 'AR') {
        this.salesform.patchValue({
          //  InvSeries: this.finvno.InvSeries,
          invoicenumber: this.finvno.InvNo//.InvDisaply
        });
      }
      else {
        this.salesform.patchValue({
          // InvSeries: this.sinvno.InvSeries,
          invoicenumber: this.sinvno.InvNo//.InvDisaply
        });
      }
    });

    this.salesform.get("iscash").valueChanges.subscribe(item => {
      this.salesform.get("cashamt").clearValidators();
      if (item) {
        this.salesform.get("cashamt").setValidators([Validators.required, Validators.min(.1)]);
      }
      else {
        this.salesform.get("cashamt").setValidators(Validators.required);
      }

      this.salesform.get("cashamt").updateValueAndValidity();
    });

    this.salesform.get("iscard").valueChanges.subscribe(item => {
      this.salesform.get("cardamt").clearValidators();
      if (item) {
        this.salesform.get("cardamt").setValidators([Validators.required, Validators.min(.1)]);
      }
      else {
        this.salesform.get("cardamt").setValidators(Validators.required);
      }

      this.salesform.get("cardamt").updateValueAndValidity();
    });

    this.salesform.get("totdiscPer").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.discountperchange = 1;
        this.setItemData();
      }
    });

    this.salesform.get("totdiscval").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.discountchange = 1;
        this.setItemData();
      }
    });

    this.salesform.get("cashamt").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.setItemData();
      }
    });

    this.salesform.get("cardamt").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.setItemData();
      }
    });





    // this.salesform.get("advanceamt").valueChanges.subscribe(item => {
    //   if (this.itemdatachange == 0) {
    //     this.setItemData();
    //   }
    // });



    this.salesform.get("totdiscbtaxPer").valueChanges.subscribe(item => {

      this.salesform.updateValueAndValidity();
      if (this.itemdatachange == 0) {
        this.discountperchange_gift = 1;
        this.setDiscountBeforeTax(this.salesform.get("totdiscbtaxPer").value, "per");
        // this.setItemData();
      }
    });

    this.salesform.get("totdiscbtaxval").valueChanges.subscribe(item => {
      this.salesform.updateValueAndValidity();
      if (this.itemdatachange == 0) {
        this.discountchange_gift = 1;
        this.setDiscountBeforeTax(this.salesform.get("totdiscbtaxval").value, "val");
        //this.setItemData();
      }
    });

  }


  createForm() {

    this.salesform = this.fb.group({
      iscash: [true],
      iscard: [false],


      customer: this.fb.group({
        name: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25)])],
        phone: [null, Validators.compose([Validators.minLength(6), Validators.maxLength(25)])],
        email: [null, Validators.compose([CustomValidators.email])],
        address: [null],
        postalcode: [null, Validators.compose([Validators.minLength(5)])],
        custid: ['0']
      }),

      invoicenumber: [{ value: 0, disabled: true }, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25)])],
      InvSeries: [null, Validators.required],
      invoicedate: [{ value: '', disabled: !this.userAccess.datechange }, Validators.compose([Validators.required, CustomValidators.date])],
      saletype: [null, Validators.required],
      salesmanid: ['', Validators.required],
      reftype: [''],
      refnum: [''],
      items: this.fb.array([]),
      //total section
      totalvalue: [{ value: 0, disabled: true }, Validators.required],
      totaltax: [{ value: 0, disabled: true }, Validators.required],
      // giftcard: [0, Validators.required],
      grossamount: [{ value: 0, disabled: true }, Validators.required],
      netamount: [{ value: 0, disabled: true }, Validators.required],
      totdiscPer: [0, Validators.required],
      totdiscval: [0, Validators.required],
      grandtotal: [{ value: 0, disabled: true }, Validators.required],
      cashamt: [0, Validators.required],
      cardamt: [0, Validators.required],
      advanceamt: [{ value: 0, disabled: true }, Validators.required],
      // refundamt: [{ value: 0, disabled: true }, Validators.required],
      cashbalance: [{ value: 0, disabled: true }, Validators.required],
      totdiscbtaxPer: [0, Validators.required],
      totdiscbtaxval: [0, Validators.required]
    });

    // add address
    this.addItems();

    /* subscribe to addresses value changes */
    // this.salesform.controls['items'].valueChanges.subscribe(x => {
    //   console.log(x, 'main page 2');
    // })


    this.salesform.patchValue({
      customer: this.sale.customer,
      invoicenumber: this.sale.invoicenumber,
      InvSeries: this.sale.invoiceseries,
      invoicedate: this.sale.invoicedate,
      saletype: this.sale.saletype,
      // iscash: this.sale.iscash,
      // iscard: this.sale.iscard,
      // iscredit: this.sale.iscredit,
      salesmanid: this.sale.salesmanid,
      // iswithwarranty: this.sale.iswithwarranty,
      // warrantycardnum: this.sale.warrantycardnum,
      reftype: this.sale.reftype,
      refnum: this.sale.refnum
    })
  }

  initItems() {
    return this.fb.group({
      ivid:['0'],
      itemcode: ['', Validators.required],
      itemid: [''],
      tid: [''],
      itemname: [{ value: '', disabled: true }, Validators.required],
      qty: [{ value: '', disabled: false }, Validators.required],
      price: [{ value: '', disabled: false }, Validators.required],
      uom: [{ value: '', disabled: true }, Validators.required],
      discountper: [''],
      discount: [''],
      total: [{ value: '', disabled: true }, Validators.required],
      gst: [{ value: '', disabled: false }, Validators.required],
      sgst: [{ value: '', disabled: false }, Validators.required],
      cgst: [{ value: '', disabled: false }, Validators.required],
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
    control.removeAt(i);
    this.itemlistupdated(null, "delete");
  }

  getDateform() {
  }

  itemlistupdated(event, param): void {

    if (this.discountchange_gift == 0 && this.discountperchange_gift == 0) {
      let totatlvalue = 0, totaltax = 0, grandtotal = 0, taxtamt = 0, disc_gift = 0,
        disc_gift_Per = 0, gtotal = 0;
      let saleobj = this.salesform.getRawValue();

      saleobj.items.forEach(obj => {
        if (typeof obj.itemcode == 'object') {
          totatlvalue = totatlvalue + (obj.qty * obj.price);
          disc_gift = disc_gift + obj.discount;
          taxtamt =     this.sessiondata.roundToTwo(obj.total * obj.sgst / 100)
          + this.sessiondata.roundToTwo(obj.total * obj.cgst / 100) 
          + this.sessiondata.roundToTwo(obj.total * obj.kfcess / 100);
          totaltax = totaltax + taxtamt;
          grandtotal = grandtotal + obj.total + taxtamt;
          gtotal = gtotal + obj.total;
        }
      });

      if (disc_gift != 0 && totatlvalue != 0) {
        disc_gift_Per = disc_gift / totatlvalue * 100;
      }

      this.itemdatachange = 1;
      this.salesform.patchValue({
        totalvalue: parseFloat(totatlvalue.toFixed(2)),
        totdiscbtaxPer: parseFloat(disc_gift_Per.toFixed(2)),
        totdiscbtaxval: parseFloat(disc_gift.toFixed(2)),
        grossamount: parseFloat(gtotal.toFixed(2)),
        totaltax: parseFloat(totaltax.toFixed(2)),
        netamount: parseFloat(grandtotal.toFixed(2)),
        grandtotal: parseFloat(grandtotal.toFixed(2))
      });

      this.itemdatachange = 0;
      this.setItemData();
    }
    // if (param != "delete") {
    //   this.addItems();
    // }
  }

  setItemData() {

    this.itemdatachange = this.itemdatachange + 1;
    if (this.itemdatachange == 1) {
      if (this.salesform.valid) {
        this.salesform.updateValueAndValidity();
        let obj = this.salesform.getRawValue();

        if (!obj.totalvalue) {
          obj.totalvalue = 0;
        }

        if (!obj.totaltax) {
          obj.totaltax = 0;
        }

        if (!obj.netamount) {
          obj.netamount = 0;
        }

        if (!obj.grossamount) {
          obj.grossamount = 0;
        }

        // if (!obj.giftcard) {
        //   obj.giftcard = 0;
        // }

        if (!obj.grandtotal) {
          obj.grandtotal = 0;
        }

        if (!obj.cashamt) {
          obj.cashamt = 0;
        }

        if (!obj.cardamt) {
          obj.cardamt = 0;
        }



        if (!obj.advanceamt) {
          obj.advanceamt = 0;
        }

        // if (!obj.refundamt) {
        //   obj.refundamt = 0;
        // }

        if (!obj.cashbalance) {
          obj.cashbalance = 0;
        }

        if (!obj.totdiscPer) {
          obj.totdiscPer = 0;
        }

        if (!obj.totdiscval) {
          obj.totdiscval = 0;
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

        if (!obj.iscard && !obj.iscash) {
          if (obj.cardamt > 0) {
            obj.iscard = true;
          }
          else {
            obj.iscash = true;
            obj.cardamt = 0;
          }
        }

        obj.grandtotal = parseFloat((obj.netamount - obj.totdiscval).toFixed(2));
        obj.advanceamt = parseFloat(obj.cashamt + obj.cardamt);
        //obj.cashamt = parseFloat((obj.grandtotal - obj.cardamt - obj.creditamt).toFixed(2));
        obj.cashbalance = parseFloat((obj.grandtotal - obj.advanceamt).toFixed(2));

        this.salesform.patchValue(
          {
            totalvalue: obj.totalvalue,
            totaltax: obj.totaltax,
            //giftcard: obj.giftcard,
            grossamount: obj.grossamount,
            netamount: obj.netamount,
            totdiscPer: obj.totdiscPer,
            totdiscval: obj.totdiscval,
            grandtotal: obj.grandtotal,
            cashamt: obj.cashamt,
            cardamt: obj.cardamt,
            advanceamt: obj.advanceamt,
            //refundamt: obj.refundamt,
            cashbalance: obj.cashbalance,
            iscash: obj.iscash,
            iscard: obj.iscard
          }
        );

      }

      this.discountchange = 0;
      this.discountperchange = 0;
      this.itemdatachange = 0;

    }
  }

  /// 
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
          control.at(index).patchValue({
            discount: parseFloat(((obj.qty * obj.price) / totatlvalue * val).toFixed(2))
          });
        }
        else {
          control.at(index).patchValue({
            discountper: val
          });
        }
      }
    });

    this.discountchange_gift = 0;
    this.discountperchange_gift = 0;

    this.itemlistupdated(null, null);
  }


  validateInvoice(): boolean {
    return true;
  }



  save(isValid: boolean, isprint: boolean): void {

    this.itemlistupdated(null, null);
    this.salesform.updateValueAndValidity();
    isValid = this.salesform.valid;

    if (isValid && confirm("Please confirm.")) {
      let salevalue: any = this.salesform.getRawValue();

      // console.log(salevalue.invoicedate.toLocaleString(),new Date().toLocaleString());
      salevalue.invdate = new Date().toLocaleString();
      this.userAccess.Save = false;
      this.invservice.InvoiceDataService('api/salesorder/save/', salevalue)
        .subscribe(
          data => {
            this.userAccess.Save = true;
            if (data) {
              if (data['IsSuccess']) {
                this.message.success("Saved successfully");
                if (isprint)
                  this.sessiondata.redirect("sale/salesorder/view", { print: isprint, id: data["RetID"] });
                else
                  this.reset();
              }
            }
            else {
              this.message.error(data['Message'] + " Please try again");
            }

          },
          err => {
            // this.alertService.error(err);
            //this.loading = false;
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
    this.discountchange_gift = 1;
    this.discountperchange_gift = 1
    const control = <FormArray>this.salesform.controls['items'];
    let len = control.length;
    for (let i = len; i >= 0; i--)
      control.removeAt(i);

    this.salesform.patchValue({
      iscash: this.sale.iscash,
      iscard: this.sale.iscard,
      customer: this.sale.customer,
      InvSeries: this.sale.invoiceseries,
      invoicenumber: this.sale.invoicenumber,
      invoicedate: this.sale.invoicedate,
      saletype: this.sale.saletype,
      salesmanid: this.sale.salesmanid,
      reftype: this.sale.reftype,
      refnum: this.sale.refnum,
      //total section
      totalvalue: 0,
      totaltax: 0,
      // giftcard: [0, Validators.required],
      grossamount: 0,
      netamount: 0,
      totdiscPer: 0,
      totdiscval: 0,
      grandtotal: 0,
      cashamt: 0,
      cardamt: 0,
      advanceamt: 0,
      // refundamt: [{ value: 0, disabled: true }, Validators.required],
      cashbalance: 0,
      totdiscbtaxPer: 0,
      totdiscbtaxval: 0
    });

    this.salesform.updateValueAndValidity();
    this.addItems();
    this.loadData();
    this.loadItem();
    this.itemdatachange = 0;
    this.discountperchange_gift = 0;
    this.discountchange_gift = 0;
  }
  searchcustomer() {
    this.custdialogRef = this.dialog.open(CustomerSearchComponent, {
      data: {
        description: 'Sale Order'
      }
    });

    this.custdialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      if (result) {
        this.salesform.patchValue({
          customer: {
            phone: result.Phone,
            email: result.Email,
            name: result.Name,
            address: result.Address,
            postalcode: result.PostalCode,
            custid: result.CustID
          }
        });
      }

      this.custdialogRef = null;
    });
  }
}
