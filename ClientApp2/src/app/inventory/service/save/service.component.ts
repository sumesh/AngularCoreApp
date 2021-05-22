import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { InvoiceModel, CustomerDetails, InvoiceNumeber, ItemModel, SaleMasterData, Employee } from '../../../_model/index';
import { AlertService, InventoryService, LocalDataService } from '../../../_services/index';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerSearchComponent } from '../../customer/search/customersearch.component';
// const password = new FormControl('', Validators.required);
// const confirmPassword = new FormControl('', CustomValidators.equalTo(password));


export const SaleData: InvoiceModel = {
  invtype: 'Local',
  invoicenumber: 'S1001',
  invoiceseries: 'PR',
  invoicedate: new Date(),
  saletype: 'RT',
  billtype: 'Sale',
  iscard: false,
  iscash: true,
  iscredit: false,
  salesmanid: '',
  iswithwarranty: false,
  warrantycardnum: '',
  reftype: 'JC',
  refnum: '',
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
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  public salesform: FormGroup;
  public form: FormGroup;
  public saleObjPrint: any;
  public theBoundCallback: Function;
  custdialogRef: MatDialogRef<CustomerSearchComponent> | null;
  userAccess: any = {};
  sale: InvoiceModel;
  itemdatachange = 0;
  discountperchange = 0;
  discountchange = 0;
  discountperchange_gift = 0;
  discountchange_gift = 0;
  DefaultEmpID = '0';
  isDisableItemEdit: boolean = true;
  states = [
    { value: 'KL', viewValue: 'Kerala' },
    { value: 'TN', viewValue: 'Tamilnadu' },
    { value: 'KA', viewValue: 'Karnadaka' },
    { value: 'AP', viewValue: 'Andrapradesh' }
  ]
  jcloadItems: any = [];
  salesType = [
    { value: 'RT', viewValue: 'Retail' },
    { value: 'WH', viewValue: 'WholeSale' }
  ];

  invSeriesData = [
    { value: 'S', viewValue: 'S' },
    { value: 'F', viewValue: 'F' }
  ];
  refFinyearData = [];
  sinvno: any;
  finvno: any;

  refferenceType = [
    { value: 'JC', viewValue: 'JC' },
    // { value: 'SR', viewValue: 'Sales Return' },
    // { value: 'AD', viewValue: 'Advance' },
    // { value: 'GIFT', viewValue: 'Gift Card' }
  ];

  salesmanlist = [];
  enableKFcess: boolean = true;

  constructor(
    private fb: FormBuilder,
    private invservice: InventoryService,
    public sessiondata: LocalDataService,
    private message: AlertService,
    public dialog: MatDialog) { }


  ngOnInit() {
    this.sale = <InvoiceModel>JSON.parse(JSON.stringify(SaleData));
    this.userAccess = this.sessiondata.getUserAccess("SERVICE");
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

  loadData() {
    this.invservice.getInvoiceCommonData('api/service/master/')
      .subscribe((data: SaleMasterData) => {
        if (data) {
          this.salesmanlist = data.SaleMan;
          // console.log(this.salesmanlist);
          this.sale.salesmanid = this.sessiondata.getSessionData().EmpID.toString();
          this.sale.customer.name = 'Customer ' + data.InvNo.InvNo;
          this.sinvno = data.InvNo;
          this.finvno = data.FInvNo;
          this.refFinyearData = data.Finyear;
          if (this.refFinyearData && this.refFinyearData.length > 0) {
            this.salesform.patchValue({
              refFinyear: this.refFinyearData[0].FinYearID
            });
          }
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
          this.sessiondata.handleError(err);
          //this.loading = false;
        });
  }

  loadItem() {
    localStorage.removeItem('serviceitemlist');
    this.invservice.InvoiceDataService('api/getitemlist/', { PageType: "SERVICEINVOICE" })
      .subscribe(
        data => {
          if (data) {
            localStorage.setItem('serviceitemlist', JSON.stringify(data));
          }
          else {

          }

        },
        err => {
          this.message.error(err);
          this.sessiondata.handleError(err);
        });
  }

  cashandtaxvalidator(item: any, txt: string) {

    if (item) {


      let saleobj = this.salesform.getRawValue();
      let iscash = saleobj.iscash, iscard = saleobj.iscard, iscredit = saleobj.iscredit;
      this.salesform.get('cashamt').clearValidators();
      this.salesform.get("cardamt").clearValidators();
      this.salesform.get("creditamt").clearValidators();
      this.salesform.get("totaltax").clearValidators();
      //  this.salesform.get("kfCessAmount").clearValidators();

      this.salesform.get('cashamt').setValidators([Validators.required, Validators.min(0)]);
      this.salesform.get('cardamt').setValidators([Validators.required, Validators.min(0)]);
      this.salesform.get('creditamt').setValidators([Validators.required, Validators.min(0)]);
      this.salesform.get("totaltax").setValidators([Validators.required, Validators.min(0)]);

      if (saleobj.InvSeries == "S") {
        if (iscash) {
          this.salesform.get('cashamt').setValidators([Validators.required, Validators.min(.1)]);
        }

        if (iscard) {
          this.salesform.get('cardamt').setValidators([Validators.required, Validators.min(.1)]);
        }

        if (iscredit) {
          this.salesform.get('creditamt').setValidators([Validators.required, Validators.min(.1)]);
        }

        this.salesform.get("totaltax").setValidators([Validators.required, Validators.min(.1)]);
      }

      this.salesform.get('cashamt').updateValueAndValidity();
      this.salesform.get('cardamt').updateValueAndValidity();
      this.salesform.get('creditamt').updateValueAndValidity();
      this.salesform.get("totaltax").updateValueAndValidity();
      //this.salesform.updateValueAndValidity()
    }
    //this.salesform.get("totaltax").updateValueAndValidity();
  }

  ngOnChange() {

    this.salesform.get("InvSeries").valueChanges.subscribe(item => {
      if (item == 'F') {
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

      if (this.itemdatachange == 0) {
        this.setItemData();
      }

    });

    this.salesform.get("iscash").valueChanges.subscribe(item => {
      this.cashandtaxvalidator(item, 'cashamt');

    });

    this.salesform.get("iscard").valueChanges.subscribe(item => {
      this.cashandtaxvalidator(item, 'cardamt');
    });

    this.salesform.get("iscredit").valueChanges.subscribe(item => {
      this.cashandtaxvalidator(item, 'creditamt');
    });

    this.salesform.get("iswithwarranty").valueChanges.subscribe(item => {
      // if (item == '') {
      //   this.salesform.get("guaranteecard").clearValidators();
      // }
      // else {
      //   this.salesform.get("guaranteecard").setValidators(Validators.required);
      // }

      // this.salesform.get("guaranteecard").updateValueAndValidity();
    });

    this.salesform.get("refnum").valueChanges.subscribe(item => {
      this.getJobCardData();
    });

    this.salesform.get("refFinyear").valueChanges.subscribe(item => {
      if (item == "0") {
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

      this.getJobCardData();
    });


    // this.salesform.get("reftype").valueChanges.subscribe(item => {

    //   if (item == '') {
    //     console.log(item);
    //     this.salesform.get("refnum").clearValidators();
    //     this.salesform.get("advanceamt").disable();
    //     this.salesform.patchValue({
    //       advanceamt: 0
    //     });
    //   }
    //   else {
    //     this.salesform.get("refnum").setValidators(Validators.required);
    //     if (item == "AD") {
    //       this.salesform.get("advanceamt").enable();
    //       this.salesform.patchValue({
    //         advanceamt: 0
    //       });
    //     }
    //     else {
    //       this.salesform.get("advanceamt").disable();
    //       this.salesform.patchValue({
    //         advanceamt: 0
    //       });
    //     }
    //   }

    //   this.salesform.get("refnum").updateValueAndValidity();

    // });

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

    this.salesform.get("creditamt").valueChanges.subscribe(item => {
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

    this.salesform.get("roundoff").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.setItemData();
      }
    });
  }


  createForm() {

    this.salesform = this.fb.group({
      iscash: [true],
      iscard: [false],
      iscredit: [false],
      iswithwarranty: [false],
      customer: this.fb.group({
        name: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25)])],
        phone: [null, Validators.compose([Validators.minLength(6), Validators.maxLength(25)])],
        email: [null, Validators.compose([CustomValidators.email])],
        address: [null],
        gst: [null],
        postalcode: [null, Validators.compose([Validators.minLength(5)])],
        cusstate: [{ value: '', disabled: true }],
        custid: ['0']
      }),

      invoicenumber: [{ value: 0, disabled: true }, Validators.compose([Validators.required, Validators.min(0), Validators.minLength(3), Validators.maxLength(25)])],
      InvSeries: [null, Validators.required],
      invoicedate: [{ value: '', disabled: !this.userAccess.datechange }, Validators.compose([Validators.required, CustomValidators.date])],
      saletype: ["RT", Validators.required],
      salesmanid: ['', Validators.required],
      reftype: ['JC'],
      refFinyear: [''],
      refnum: [0, { updateOn: 'blur', validators: Validators.compose([Validators.required, Validators.min(1)]) }],
      guaranteecard: [''],
      guaranteedate: [null, Validators.compose([CustomValidators.date])],
      items: this.fb.array([]),
      //total section
      totalvalue: [{ value: 0, disabled: true }, Validators.required],
      totaltax: [{ value: 0, disabled: false }, Validators.compose([Validators.required])], //, Validators.min(.1)
      kfCessAmount: [0, Validators.required],
      grossamount: [{ value: 0, disabled: true }, Validators.required],
      netamount: [{ value: 0, disabled: true }, Validators.required],
      totdiscPer: [0, { updateOn: 'blur', validators: Validators.required }],
      totdiscval: [0, { updateOn: 'blur', validators: Validators.required }],
      grandtotal: [{ value: 0, disabled: true }, Validators.required],
      cashamt: [0, Validators.required],
      cardamt: [0, Validators.required],
      creditamt: [0, Validators.required],
      roundoff: [{ value: 0, disabled: true }, Validators.required],
      advanceamt: [{ value: 0, disabled: true }, Validators.required],
      // refundamt: [{ value: 0, disabled: true }, Validators.required],
      cashbalance: [{ value: 0, disabled: true }, Validators.required],
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
      itemcode: [{ value: '', disabled: this.isDisableItemEdit }, Validators.required],
      itemid: [''],
      tid: [''],
      itemname: [{ value: '', disabled: true }, Validators.required],
      qty: [{ value: '', disabled: false }, Validators.required],
      price: [{ value: '', disabled: false }, Validators.required],
      uom: [{ value: '', disabled: true }, Validators.required],
      weight: [{ value: '', disabled: false }],
      servicedesc: [{ value: '', disabled: false }],
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

  getJobCardData() {
    //console.log(this.salesform.get("invoicenumber").value);
    if (this.salesform.get("refnum").valid && this.salesform.get("refFinyear").value != "0" && this.itemdatachange == 0) {
      this.invservice.InvoiceDataService('api/jobcard/view/', {
        InvoiceNumber: this.salesform.get("refnum").value,

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
                    // obj['MRP'] = parseFloat(obj.Price)+ parseFloat((obj.Price * obj.SGST / 100).toFixed(2))
                    // + parseFloat((obj.Price * obj.CGST / 100).toFixed(2))
                    // + parseFloat((obj.Price * obj.KFcess / 100).toFixed(2));;
                    this.jcloadItems.push(obj);
                    const addrCtrl = this.initItems();
                    control.push(addrCtrl);
                  }
                });

                var result = data['Customer'];
                this.salesform.patchValue({
                  customer: {
                    phone: result.Phone,
                    name: result.Name,
                    address: result.Address,
                    custid: result.CustID
                  }
                });
              }
              else {
                this.clearList_OnInvNotfound()
                this.message.error("Invoice not found / Cancelled. Please try again");
                this.salesform.patchValue({ refnum: '0' });
              }
            }
            else {
              this.clearList_OnInvNotfound()
              this.message.error("No Jobcard found / Cancelled. Please try again");
              this.salesform.patchValue({ refnum: '0' });
            }
          },
          err => {
            this.message.error("Error while communicating with server. Please try again");
            this.sessiondata.handleError(err);
          });
    }
  }




  // jobcardAddItems() {
  //   const jcobj = {
  //     ItemID: 128, TID: 6, Code: 'CHC057', Name: 'Chain', Price: 100, Qty: 5,
  //     DiscPer: 0, GST: 3, Disc: 0, SGST: 9.00, CGST: 9.00, Ucode: 'NOS',
  //     total: 0, grossamt: 0, jcitem: true
  //   }
  //   this.jcloadItems.push(jcobj);
  //   const control = <FormArray>this.salesform.controls['items'];
  //   const addrCtrl = this.initItems();
  //   control.push(addrCtrl);
  //   // const jcobj2 = {
  //   //   ItemID: 128, TID: 6, Code: 'CHC054', Name: 'Chain', Price: 250, Qty: 5,
  //   //   DiscPer: 0, GST: 3, Disc: 0, SGST: 9.00, CGST: 9.00, Ucode: 'NOS',
  //   //   total: 0, grossamt: 0
  //   // }
  //   // // control.at(0).patchValue({
  //   // //   itemcode: jcobj
  //   // // });
  //   // // this.salesform.updateValueAndValidity();

  //   // control.at(1).patchValue({
  //   //   itemcode: jcobj2
  //   // });


  //   /* subscribe to individual address value changes */
  //   // addrCtrl.valueChanges.subscribe(x => {
  //   //   console.log(x, 'Main page 2');
  //   // })addrCtrl.valueChanges.subscribe(x => {
  //   //   console.log(x, 'Main page 2');
  //   // })
  // }

  getDateform() {
  }

  itemlistupdated(event, param): void {

    if (this.discountchange_gift == 0 && this.discountperchange_gift == 0) {
      let totatlvalue = 0, totaltax = 0, grandtotal = 0, taxtamt = 0, disc_gift = 0,
        disc_gift_Per = 0, gtotal = 0, totalkfCessAmt = 0, kfCessAmt = 0;
      let saleobj = this.salesform.getRawValue();
      // console.log(saleobj.items);
      saleobj.items.forEach(obj => {
        if (typeof obj.itemcode == 'object') {
          totatlvalue = totatlvalue + (obj.qty * obj.price);
          disc_gift = disc_gift + obj.discount;
          taxtamt = this.sessiondata.roundToTwo(obj.total * obj.sgst / 100)
            + this.sessiondata.roundToTwo(obj.total * obj.cgst / 100);
          kfCessAmt = this.sessiondata.roundToTwo(obj.total * obj.kfcess / 100);
          totaltax = totaltax + taxtamt;
          totalkfCessAmt = totalkfCessAmt + kfCessAmt;
          grandtotal = grandtotal + obj.total + taxtamt + kfCessAmt;
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
        kfCessAmount: parseFloat(totalkfCessAmt.toFixed(2)),
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
      // if (this.salesform.valid) {
      this.salesform.updateValueAndValidity();
      let obj = this.salesform.getRawValue();

      if (!obj.totalvalue) {
        obj.totalvalue = 0;
      }

      if (!obj.totaltax) {
        obj.totaltax = 0;
      }

      if (!obj.kfCessAmount) {
        obj.kfCessAmount = 0;
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

      if (!obj.iscard && !obj.iscash) {
        if (obj.cardamt > 0) {
          obj.iscard = true;
        }
        else {
          obj.iscash = true;
          obj.cardamt = 0;
        }
      }

      obj.netamount = obj.grossamount + obj.totaltax + obj.kfCessAmount;
      obj.roundoff = parseFloat((Math.floor(obj.netamount) - obj.netamount).toFixed(2));
      obj.netamount = obj.netamount + obj.roundoff;
      obj.grandtotal = parseFloat((obj.netamount - obj.totdiscval).toFixed(2));
      obj.cashamt = parseFloat((obj.grandtotal - obj.cardamt - obj.creditamt).toFixed(2));
      obj.cashbalance = parseFloat((obj.cashamt - obj.advanceamt).toFixed(2));


      this.salesform.patchValue(
        {
          totalvalue: obj.totalvalue,
          totaltax: obj.totaltax,
          kfCessAmount: obj.kfCessAmount,
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

    //}
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




  print(isValid: boolean): void {
    // console.log(this.salesform.valid,this.salesform.value);
    this.saleObjPrint = true;
    if (isValid) {

      this.saleObjPrint = JSON.parse(JSON.stringify(this.salesform.value));


      let printContents, popupWin;
      printContents = document.getElementById('print-section').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          .invoice-box{
              max-width:800px;
              margin:auto;
              padding:30px;
              border:1px solid #eee;
              box-shadow:0 0 10px rgba(0, 0, 0, .15);
              font-size:16px;
              line-height:24px;
              font-family:'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
              color:#555;
          }
          
          .invoice-box table{
              width:100%;
              line-height:inherit;
              text-align:left;
          }
          
          .invoice-box table td{
              padding:5px;
              vertical-align:top;
          }
          
          .invoice-box table tr td:nth-child(2){
              text-align:right;
          }
          
          .invoice-box table tr.top table td{
              padding-bottom:20px;
          }
          
          .invoice-box table tr.top table td.title{
              font-size:45px;
              line-height:45px;
              color:#333;
          }
          
          .invoice-box table tr.information table td{
              padding-bottom:40px;
          }
          
          .invoice-box table tr.heading td{
              background:#eee;
              border-bottom:1px solid #ddd;
              font-weight:bold;
          }
          
          .invoice-box table tr.details td{
              padding-bottom:20px;
          }
          
          .invoice-box table tr.item td{
              border-bottom:1px solid #eee;
          }
          
          .invoice-box table tr.item.last td{
              border-bottom:none;
          }
          
          .invoice-box table tr.total td:nth-child(2){
              border-top:2px solid #eee;
              font-weight:bold;
          }
          
          @media only screen and (max-width: 600px) {
              .invoice-box table tr.top table td{
                  width:100%;
                  display:block;
                  text-align:center;
              }
              
              .invoice-box table tr.information table td{
                  width:100%;
                  display:block;
                  text-align:center;
              }
          }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
      );
      popupWin.document.close();

    }
    else {
      this.saleObjPrint = null;
    }
  }


  save(isValid: boolean, isprint: boolean): void {
    this.itemlistupdated(null, null);
    this.salesform.updateValueAndValidity();
    isValid = this.salesform.valid;

    if (isValid && confirm("Please confirm.")) {
      let salevalue: any = this.salesform.getRawValue();
      salevalue.invdate = new Date().toLocaleString();
      this.userAccess.Save = false;
      this.invservice.InvoiceDataService('api/service/save/', salevalue)
        .subscribe(
          data => {
            this.userAccess.Save = true;
            if (data) {
              if (data['IsSuccess']) {
                this.message.success("Saved successfully");
                if (isprint) {
                  this.sessiondata.redirect("service/service/view", { print: isprint, id: data["RetID"] });
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
    this.jcloadItems = [];
    const control = <FormArray>this.salesform.controls['items'];
    let len = control.length;
    for (let i = len; i >= 0; i--)
      control.removeAt(i);

    this.salesform.patchValue({
      iscash: this.sale.iscash,
      iscard: this.sale.iscard,
      iscredit: this.sale.iscredit,
      customer: this.sale.customer,
      InvSeries: this.sale.invoiceseries,
      invoicenumber: this.sale.invoicenumber,
      invoicedate: this.sale.invoicedate,
      saletype: this.sale.saletype,
      salesmanid: this.sale.salesmanid,
      iswithwarranty: this.sale.iswithwarranty,
      warrantycardnum: this.sale.warrantycardnum,
      reftype: this.sale.reftype,
      refnum: this.sale.refnum,
      guaranteedate: "",
      //total section
      totalvalue: 0,
      totaltax: 0,
      kfCessAmount: 0,
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
      // console.log(result);
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
            custid: result.CustID
          }
        });
      }

      this.custdialogRef = null;
    });
  }
}
