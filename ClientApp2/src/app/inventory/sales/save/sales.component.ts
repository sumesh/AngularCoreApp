import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { InvoiceModel, CustomerDetails, InvoiceNumeber, ItemModel, SaleMasterData, Employee } from '../../../_model/index';
import { AlertService, InventoryService, LocalDataService } from '../../../_services/index';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerSearchComponent } from '../../customer/search/customersearch.component';
// import { CustomerSearchComponent } from '../../customer/search/customersearch.component';

// const password = new FormControl('', Validators.required);
// const confirmPassword = new FormControl('', CustomValidators.equalTo(password));


export const SaleData: InvoiceModel = {
  invoicenumber: 'S1001',
  invoiceseries: 'PR',
  invtype: 'LOCAL',
  invoicedate: new Date(),
  saletype: 'RT',
  billtype: 'Sale',
  iscard: false,
  iscash: true,
  iscredit: false,
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
      gst: '',
      cusstate: '',
      cusstatecode: '',
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
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  public salesform: FormGroup;
  public form: FormGroup;
  public saleObjPrint: any;
  public theBoundCallback: Function;
  custdialogRef: MatDialogRef<CustomerSearchComponent> | null;
  userAccess: any = {};
  defaultstatecode: string = "";
  showStateError: boolean = false;
  sale: InvoiceModel;
  itemdatachange = 0;
  discountperchange = 0;
  discountchange = 0;
  discountperchange_gift = 0;
  discountchange_gift = 0;
  TotalQty: number = 0;
  DefaultEmpID = '0';
  itemSeries: string = "PR";
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

  salesInvType = [
    { value: 'LOCAL', viewValue: 'Local' },
    { value: 'INTERSTATE', viewValue: 'InterState' }
  ];


  invSeriesData = [
    { value: 'PR', viewValue: 'PR' },
    { value: 'KR', viewValue: 'KR' },
    { value: 'GLS', viewValue: 'GLS' },
    { value: 'MR', viewValue: 'MR' },
    { value: 'NW', viewValue: 'NW' }
  ];

  refferenceType = [
    { value: '', viewValue: 'None' },
    { value: 'SR', viewValue: 'Sales Return' },
    { value: 'AD', viewValue: 'Advance' },
    { value: 'GIFT', viewValue: 'Gift Card' }
  ];

  warrantyType = [];
  warrantyTypeData = [];

  salesmanlist = [];
  billtypelist = [];
  enableIgst: boolean = false;
  enableKFcess: boolean = true;
  enableTax: boolean = true;
  constructor(
    private fb: FormBuilder,
    private invservice: InventoryService,
    public sessiondata: LocalDataService,
    private message: AlertService,
    public dialog: MatDialog
  ) { }


  ngOnInit() {
    this.sale = <InvoiceModel>JSON.parse(JSON.stringify(SaleData));
    this.userAccess = this.sessiondata.getUserAccess("SALES");
    this.createForm();
    this.ngOnChange();
    this.loadData();
    this.loadItem();
    this.theBoundCallback = this.theCallback.bind(this);
    this.sessiondata.globalOnchanges.subscribe(data => {
      console.log(data);
    });
  }

  public theCallback() {
    //console.log("Callback Parent", this);
    //this.theBoundCallback();
  }

  filterWarrantyType(val) {
    const temp = this.warrantyTypeData.filter(function (d) {
      return d.BrandCode == val;
    });

    this.warrantyType = temp;

    this.salesform.patchValue({
      guaranteecard: ''
    });
  }

  loadData() {
    this.invservice.getInvoiceCommonData('api/sale/master/')
      .subscribe((data: SaleMasterData) => {
        if (data) {
          this.salesmanlist = data.SaleMan;
          this.billtypelist = data.BillType;
          this.warrantyTypeData = [...data.WarrantyType]

          // console.log(this.salesmanlist);
          this.sale.salesmanid = this.sessiondata.getSessionData().EmpID.toString();
          this.sale.customer.name = 'Customer ' + data.InvNo.InvNo;
          this.sale.customer.cusstatecode = data.States.cusstatecode;
          this.sale.customer.cusstate = data.States.cusstate;
          this.defaultstatecode = this.sale.customer.cusstatecode;

          this.salesform.patchValue({
            salesmanid: this.sale.salesmanid,
            billtype: this.sale.billtype,
            customer: this.sale.customer,
            InvSeries: data.InvNo.InvSeries,
            invoicenumber: data.InvNo.InvNo,//.InvDisaply
            //guaranteecard:''
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
          //this.loading = false;
        });
  }

  loadItem() {
    localStorage.removeItem('salesitemlist');
    this.invservice.InvoiceDataService('api/getitemlist/', { PageType: "SALE" })
      .subscribe(
        data => {
          if (data) {
            localStorage.setItem('salesitemlist', JSON.stringify(data));
          }
          else {

          }

        },
        err => {

          this.sessiondata.handleError(err);
        });
  }

  ngOnChange() {
    this.salesform.get("InvSeries").valueChanges.subscribe(item => {
      this.filterWarrantyType(item);
    });

    this.salesform.get("guaranteecard").valueChanges.subscribe(item => {
      if (item == '') {
        this.salesform.patchValue({
          guaranteedate: ''
        });
      }
      else {
        const temp = this.warrantyType.find(function (d) {
          return d.WarrantyID == item;
        });
        if (temp) {
          this.salesform.patchValue({
            guaranteedate: temp.WaarantyUpto
          });
        }
      }

    });


    this.salesform.get("iscash").valueChanges.subscribe(item => {
      this.salesform.get("cashamt").clearValidators();
      // if (item) {
      //   this.salesform.get("cashamt").setValidators([Validators.required, Validators.min(.1)]);
      // }
      // else {
      //   this.salesform.get("cashamt").setValidators(Validators.required);
      // }

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

    this.salesform.get("iscredit").valueChanges.subscribe(item => {
      this.salesform.get("creditamt").clearValidators();
      if (item) {
        this.salesform.get("creditamt").setValidators([Validators.required, Validators.min(.1)]);
      }
      else {
        this.salesform.get("creditamt").setValidators(Validators.required);
      }

      this.salesform.get("creditamt").updateValueAndValidity();
    });

    this.salesform.get("iswithwarranty").valueChanges.subscribe(item => {
      if (item == '') {
        this.salesform.get("guaranteecard").clearValidators();
      }
      else {
        this.salesform.get("guaranteecard").setValidators(Validators.required);
      }

      this.salesform.get("guaranteecard").updateValueAndValidity();
    });


    this.salesform.get("reftype").valueChanges.subscribe(item => {

      if (item == '') {
        this.salesform.get("refnum").clearValidators();
        this.salesform.get("advanceamt").disable();
        this.salesform.patchValue({
          advanceamt: 0
        });
      }
      else {
        this.salesform.get("refnum").setValidators(Validators.required);
        this.salesform.patchValue({
          refnum: '0'
        });

        if (item == "AD") {
          this.salesform.get("advanceamt").enable();
          this.salesform.patchValue({
            advanceamt: 0
          });
        }
        else {
          this.salesform.get("advanceamt").disable();
          this.salesform.patchValue({
            advanceamt: 0
          });
        }
      }

      this.salesform.get("refnum").updateValueAndValidity();

    });

    this.salesform.get("refnum").valueChanges.subscribe(item => {
      console.log(item, this.salesform.get("reftype").value);
      if (this.salesform.get("reftype").value == 'AD') {
        this.getAdvanceAmt();
      }
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
        this.itemdatachange = 0;
        debugger;
        this.setItemData();
      }
    });

    this.salesform.get("cardamt").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.itemdatachange = 0;
        this.setItemData();
      }
    });

    this.salesform.get("creditamt").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.setItemData();
      }
    });

    this.salesform.get("roundoff").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.setItemData();
      }
    });



    // this.salesform.get("giftcard").valueChanges.subscribe(item => {
    //   if (this.itemdatachange == 0) {
    //     this.setItemData();
    //   }
    // });

    this.salesform.get("advanceamt").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.setItemData();
      }
    });

    // this.salesform.get("refundamt").valueChanges.subscribe(item => {
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

    this.salesform.get("customer").get("gst").valueChanges.subscribe(item => {

      this.salesform.updateValueAndValidity();
      if (this.itemdatachange == 0) {
        this.discountchange_gift = 1;
        this.setKFCessForGST(this.salesform.get("customer").get("gst").value);
        // this.setItemData();
      }
    });

    this.salesform.get("invtype").valueChanges.subscribe(item => {

      this.salesform.updateValueAndValidity();
      if (this.itemdatachange == 0) {
        this.discountchange_gift = 1;
        this.setKFCessForGST(this.salesform.get("customer").get("gst").value);
        // this.setItemData();
      }
    });



  }


  createForm() {

    this.salesform = this.fb.group({
      iscash: [true],
      iscard: [false],
      iscredit: [false],
      iswithwarranty: [false],
      invtype: [null, Validators.required],
      customer: this.fb.group({
        name: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25)])],
        phone: [null, Validators.compose([Validators.minLength(6), Validators.maxLength(25)])],
        email: [null, Validators.compose([CustomValidators.email])],
        address: [null],
        gst: [null, { updateOn: 'blur' }],
        postalcode: [null, Validators.compose([Validators.minLength(5)])],
        cusstate: [{ value: '', disabled: true }],
        cusstatecode: [null],

        custid: ['0']
      }),

      invoicenumber: [{ value: 0, disabled: true }, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25)])],
      InvSeries: [null, Validators.required],
      invoicedate: [{ value: '', disabled: !this.userAccess.datechange }, Validators.compose([Validators.required, CustomValidators.date])],
      saletype: [null, Validators.required],
      billtype: [null, Validators.required],
      salesmanid: ['', Validators.required],
      reftype: [''],
      refnum: ['', { updateOn: 'blur' }],
      guaranteecard: [''],
      guaranteedate: [null, Validators.compose([CustomValidators.date])],
      items: this.fb.array([]),
      //total section
      totalvalue: [{ value: 0, disabled: true }, Validators.required],
      totaltax: [{ value: 0, disabled: false }, Validators.compose([Validators.required, Validators.min(.1)])],
      // giftcard: [0, Validators.required],
      grossamount: [{ value: 0, disabled: true }, Validators.required],
      netamount: [{ value: 0, disabled: true }, Validators.required],
      totdiscPer: [0, { updateOn: 'blur', validators: Validators.required }],
      totdiscval: [0, { updateOn: 'blur', validators: Validators.required }],
      roundoff: [{ value: 0, disabled: true }, Validators.required],
      grandtotal: [{ value: 0, disabled: true }, Validators.required],
      cashamt: [0, Validators.required],
      cardamt: [0, Validators.required],
      creditamt: [0, Validators.required],
      advanceamt: [{ value: 0, disabled: true }, Validators.required],
      // refundamt: [{ value: 0, disabled: true }, Validators.required],
      cashbalance: [{ value: 0, disabled: false }, Validators.compose([Validators.required])], //, Validators.min(0),Validators.max(0)
      totdiscbtaxPer: [0, { updateOn: 'blur', validators: Validators.required }],
      totdiscbtaxval: [0, { updateOn: 'blur', validators: Validators.required }]
    });

    // add address
    this.addItems();

    /* subscribe to addresses value changes */
    // this.salesform.controls['items'].valueChanges.subscribe(x => {
    //   console.log(x, 'main page 2');
    // })

    //console.log(this.sale.customer);
    this.salesform.patchValue({
      customer: this.sale.customer,
      invoicenumber: this.sale.invoicenumber,
      InvSeries: this.sale.invoiceseries,
      invoicedate: this.sale.invoicedate,
      invtype: this.sale.invtype,
      saletype: this.sale.saletype,
      billtype: this.sale.billtype,
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
      ivid: ['0'],
      itemcode: ['', Validators.required],
      itemid: [''],
      tid: [''],
      itemname: [{ value: '', disabled: true }, Validators.required],
      qty: [{ value: '', disabled: false }, Validators.required],
      price: [{ value: '', disabled: true }, Validators.required],
      uom: [{ value: '', disabled: true }, Validators.required],
      discountper: [''],
      discount: [''],
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
      weight: [{ value: '', disabled: false }, Validators.required]
    });
  }

  addItems() {
    const control = <FormArray>this.salesform.controls['items'];
    const addrCtrl = this.initItems();
    control.push(addrCtrl);
    this.theCallback();
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
      this.TotalQty = 0;
      saleobj.items.forEach(obj => {
        if (typeof obj.itemcode == 'object') {
          totatlvalue = totatlvalue + (obj.qty * obj.price);
          disc_gift = disc_gift + obj.discount;
          taxtamt = this.sessiondata.roundToTwo(obj.total * obj.gst / 100)
            + this.sessiondata.roundToTwo(obj.total * obj.sgst / 100)
            + this.sessiondata.roundToTwo(obj.total * obj.cgst / 100)
            + this.sessiondata.roundToTwo(obj.total * obj.kfcess / 100);

          totaltax = totaltax + taxtamt;
          grandtotal = grandtotal + obj.total + taxtamt;
          gtotal = gtotal + obj.total;
          this.TotalQty = this.TotalQty + obj.qty;
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
      //  if (this.salesform.valid) {
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

      if (!obj.creditamt) {
        obj.creditamt = 0;
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

      if (!obj.roundoff) {
        obj.roundoff = 0;
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


      //debugger;
      obj.netamount = obj.grossamount + obj.totaltax;
      obj.roundoff = parseFloat((Math.floor(obj.netamount) - obj.netamount).toFixed(2));
      obj.netamount = obj.netamount + obj.roundoff;
      obj.grandtotal = parseFloat((obj.netamount - obj.totdiscval).toFixed(2));
      obj.cashamt = parseFloat((obj.grandtotal - obj.cardamt - obj.creditamt - obj.advanceamt).toFixed(2));
      obj.cashbalance = parseFloat((obj.cashamt).toFixed(2));

      // if (!obj.iscard && !obj.iscash  && !obj.iscredit) {
      if (obj.cardamt != 0 && !obj.iscard) {
        obj.iscard = true;
      }
      if (obj.cashamt != 0 && !obj.iscash) {
        obj.iscash = true;
      }

      if (obj.creditamt != 0 && !obj.iscredit) {
        obj.iscredit = true;
      }
      //}

      this.salesform.patchValue(
        {
          totalvalue: obj.totalvalue,
          totaltax: obj.totaltax,
          //giftcard: obj.giftcard,
          grossamount: obj.grossamount,
          netamount: obj.netamount,
          totdiscPer: obj.totdiscPer,
          totdiscval: obj.totdiscval,
          roundoff: obj.roundoff,
          grandtotal: obj.grandtotal,
          cashamt: obj.cashamt,
          cardamt: obj.cardamt,
          creditamt: obj.creditamt,
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

    // }
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

    this.discountchange_gift = 0;
    this.discountperchange_gift = 0;

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

    if (this.salesform.get("invtype").value == "LOCAL") {
      this.enableIgst = false;
    }
    else {
      this.enableIgst = true;
      this.enableKFcess = false;
    }

    console.log(this.enableKFcess, this.enableIgst);
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

        if (this.enableIgst) {
          control.at(index).patchValue({
            gst: control.at(index).get("gst_back").value,
            sgst: 0,
            cgst: 0
          });
        }
        else {
          control.at(index).patchValue({
            gst: 0,
            sgst: control.at(index).get("sgst_back").value,
            cgst: control.at(index).get("cgst_back").value
          });
        }
      }
    });

    this.discountchange_gift = 0;
    this.itemlistupdated(null, null);
  }

  validateWeight(): boolean {


    let ret_value = true;
    let saleobj = this.salesform.getRawValue();

    for (let obj of saleobj.items) {     
      if (ret_value && obj.weight <= 0) {
        this.message.error("Please check Weight. Weight should not be zero.");
        ret_value = false;
        return ret_value;
      }
    }

    return ret_value;
  }


  save(isValid: boolean, isprint: boolean): void {
    this.showStateError = false;
    this.itemlistupdated(null, null);
    this.salesform.updateValueAndValidity();
    if (!this.validateWeight()) {
      return;
    } 

    isValid = this.salesform.valid; 
    let salevalue: any = this.salesform.getRawValue();
    if ((salevalue.invtype == 'INTERSTATE' && salevalue.customer.cusstatecode == this.defaultstatecode)
      || (salevalue.invtype == 'LOCAL' && salevalue.customer.cusstatecode != this.defaultstatecode)) {
      isValid = false;
      this.showStateError = true;
    }
    if (isValid && confirm("Please confirm.")) {

      // let salevalue: any = this.salesform.getRawValue();
      salevalue.invdate = new Date().toLocaleString();
      this.userAccess.Save = false;
      this.invservice.InvoiceDataService('api/sale/save/', salevalue)
        .subscribe(
          data => {
            this.userAccess.Save = true;
            if (data) {
              if (data['IsSuccess']) {
                this.message.success("Saved successfully");
                if (isprint) {
                  this.sessiondata.redirect("sale/sales/view", { print: isprint, id: data["RetID"] });
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
            // this.alertService.error(err);
            //this.loading = false;
            console.log('Sale Something went wrong!', err);
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
    this.showStateError = false;
    this.itemdatachange = 1;
    this.discountchange_gift = 1;
    this.discountperchange_gift = 1
    this.TotalQty = 0;
    const control = <FormArray>this.salesform.controls['items'];
    let len = control.length;
    for (let i = len; i >= 0; i--)
      control.removeAt(i);

    this.salesform.patchValue({
      iscash: this.sale.iscash,
      iscard: this.sale.iscard,
      iscredit: this.sale.iscredit,
      invtype: this.sale.invtype,
      customer: this.sale.customer,
      InvSeries: this.sale.invoiceseries,
      invoicenumber: this.sale.invoicenumber,
      invoicedate: this.sale.invoicedate,
      saletype: this.sale.saletype,
      billtype: this.sale.billtype,
      salesmanid: this.sale.salesmanid,
      iswithwarranty: this.sale.iswithwarranty,
      warrantycardnum: this.sale.warrantycardnum,
      reftype: this.sale.reftype,
      refnum: this.sale.refnum,
      guaranteedate: "",
      //total section
      totalvalue: 0,
      totaltax: 0,
      // giftcard: [0, Validators.required],
      grossamount: 0,
      netamount: 0,
      totdiscPer: 0,
      totdiscval: 0,
      roundoff: 0,
      grandtotal: 0,
      cashamt: 0,
      cardamt: 0,
      creditamt: 0,
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
        description: 'SALES'
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
            gst: result.GST,
            cusstate: result.cusstate,
            cusstatecode: result.cusstatecode,
            custid: result.CustID
          }
        });

        this.salesform.patchValue({
          totdiscbtaxPer: result.Disc_Per
        });

        this.salesform.get("totdiscbtaxPer").updateValueAndValidity();
      }

      this.custdialogRef = null;
    });
  }

  /// BInd Service Item based Job card

  getAdvanceAmt() {
    if (this.salesform.get("refnum").valid && this.salesform.get("refnum").value != '0') {
      this.invservice.InvoiceDataService('api/salesorder/view/', { InvoiceNumber: this.salesform.get("refnum").value })
        .subscribe(
          data => {

            if (data) {

              this.salesform.patchValue({
                advanceamt: data['advanceamt']

              });
              var result = data['Customer'];
              this.salesform.patchValue({
                customer: {
                  phone: result.Phone,
                  email: result.Email,
                  name: result.Name,
                  address: result.Address,
                  postalcode: result.PostalCode,
                  gst: result.GST,
                  ///cusstate: result.cusstate,
                  ///cusstatecode: result.cusstatecode,
                  custid: result.CustID
                },

              });

              this.salesform.get("advanceamt").updateValueAndValidity();
            }
            else {
              this.message.error("No Jobcard found. Please try again");
            }
          },
          err => {
            this.message.error("Error while communicating with server. Please try again");
            this.sessiondata.handleError(err);
          });
    }
  }
}
