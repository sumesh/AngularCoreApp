import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { InvoiceModel, CustomerDetails, InvoiceNumeber, ItemModel, SaleMasterData, Employee } from '../../../_model/index';
import { AlertService, InventoryService, LocalDataService } from '../../../_services/index';
import { SelectionModel } from '@angular/cdk/collections';

// const password = new FormControl('', Validators.required);
// const confirmPassword = new FormControl('', CustomValidators.equalTo(password));


export const JobCardData: any = {
  invoicenumber: '',
  invoiceseries: 'PR',
  invdate: new Date(),
  paymode: 'CASH',
  salesmanid: '',
  customer: <CustomerDetails>
    {
      custid: '0',
      name: 'Customer 0',
      phone: '',
      address: '',
      email: '',
      postalcode: '',
      gst: '',
      cusstate: 'KL'
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
  selector: 'app-deliveryout',
  templateUrl: './deliveryout.component.html',
  styleUrls: ['./deliveryout.component.scss']
})
export class DeliveryOutComponent implements OnInit {

  public salesform: FormGroup;
  public theBoundCallback: Function;
  userAccess: any = {};
  defaultformData: any;
  itemdatachange = 0;
  TotalQty: number = 0
  dtype = [
    { value: 'PURCHASE-OUT', viewValue: 'Purchase Items' },
    { value: 'SERVICE-OUT', viewValue: 'Service Items' },
    { value: 'STOCK-OUT', viewValue: 'Stock Out' }
  ];

  dseries = [
    { value: 'DO', viewValue: 'DO' }
  ];

  salesmanlist = [];
  branchlist = [];
  purch_Service_items: any = []; 
  showItemListTable = false;

  displayedColumns: string[] = ['select','name', 'invno', 'qty', 'ucode', 'price', 'amount', 'action'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator,{static: false}) paginator!: MatPaginator;
  enableKFcess: boolean = true;
  constructor(
    private fb: FormBuilder,
    private invservice: InventoryService,
    public sessiondata: LocalDataService,
    private message: AlertService) { }


  ngOnInit() {
    this.defaultformData = JobCardData;
    this.userAccess = this.sessiondata.getUserAccess("DELIVERYOUT");
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
    let sobj = this.sessiondata.getSessionData();
    this.invservice.InvoiceDataService('api/delivery/master/', {
      PageType: "DELIVERYOUT",
      CompanyID: sobj.CompanyID,
      BranchID: sobj.BranchID,
      FinYearID: sobj.FinYearID,
      UserID: sobj.UserID
    })
      .subscribe((data: SaleMasterData) => {
        if (data) {
          this.salesmanlist = data.SaleMan;
          this.branchlist = data.Branches;
          this.defaultformData.salesmanid = this.sessiondata.getSessionData().EmpID.toString();
          this.defaultformData.customer.name = 'Customer ' + data.InvNo.InvNo;
          this.salesform.patchValue({
            salesmanid: this.defaultformData.salesmanid,
            customer: this.defaultformData.customer,
            InvSeries: data.InvNo.InvSeries,
            invoicenumber: data.InvNo.InvNo
          });

        }
        else {
          this.salesform.patchValue({
            srinvoicenumber: ''
          });
        }

      },
        err => {
          // this.alertService.error(err);
          //this.loading = false;
          this.sessiondata.handleError(err);
        });
  }

  loadItem() {
    localStorage.removeItem('deliveryoutitemlist');
    this.invservice.InvoiceDataService('api/getitemlist/', { PageType: "DELIVERY" })
      .subscribe(
        data => {
          if (data) {
            localStorage.setItem('deliveryoutitemlist', JSON.stringify(data));
          }
          else {

          }

        },
        err => {
          // this.alertService.error(err);
          //this.loading = false;
          this.sessiondata.handleError(err);
        });
  }

  bindItemfromList(data) {

  }

  ngOnChange() {
    this.salesform.get("roundoff").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.setItemData();
      }
    });

    this.salesform.get("tobranchid").valueChanges.subscribe(item => {
      this.defaultformData.customer.custid = item.BranchID;
      this.defaultformData.customer.name = item.BranchName;
      this.defaultformData.customer.address = item.Br_Adrs;
      this.defaultformData.customer.phone = item.Br_Ph;
      this.salesform.patchValue({
        customer: this.defaultformData.customer,
      });

      this.loadDeliveryItem();
    });


    this.salesform.get("deliverytype").valueChanges.subscribe(item => {
      if (item == "STOCK-OUT") {
        this.addItems();
        this.showItemListTable = false;
      }
      else if (item == "SERVICE-OUT" || item == "PURCHASE-OUT") {
        this.purch_Service_items = [];
        this.selection.clear();
        this.showItemListTable = true;
        this.itemdatachange = 1;
        this.removeAllItems();
        this.loadDeliveryItem();
      }

    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  removeSelectedRows() {
    let tmp = JSON.parse(JSON.stringify(this.purch_Service_items));
    this.selection.selected.forEach(item => {
      let index: number = tmp.findIndex(d => d.InvDtlID === item.InvDtlID);
     // console.log(tmp.findIndex(d => d.InvDtlID === item.InvDtlID));
      tmp.splice(index,1) 
    });

    this.purch_Service_items = tmp;
    this.bindTable();
    this.itemlistupdated(null, "delete");
    this.selection = new SelectionModel<Element>(true, []);
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
 

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  removeItemFromTable(rowIndex) {
    rowIndex = (rowIndex) + (this.paginator.pageIndex * this.paginator.pageSize);
    let tmp = JSON.parse(JSON.stringify(this.purch_Service_items));
    tmp.splice(rowIndex, 1);
    this.purch_Service_items = tmp;
    this.bindTable();
    this.itemlistupdated(null, "delete");
  }

  bindTable() {
    this.dataSource.data = this.purch_Service_items;
    this.dataSource.paginator = this.paginator;
  }

  loadDeliveryItem() {
    let dtype: any = this.salesform.get("deliverytype").value;
    let brobj: any = this.salesform.get("tobranchid").value;
    this.invservice.InvoiceDataService('api/delivery/pending', { PageType: dtype, ToBranch: brobj ? brobj.BranchID : 0 })
      .subscribe(
        data => {
          if (data) {
            this.purch_Service_items = data;
            this.selection.clear();
          }
          else {
            this.purch_Service_items = [];
             this.selection.clear();
          }
          this.bindTable();
          this.itemdatachange = 0;
          this.itemlistupdated(null, "add");
        },
        err => {
          // this.alertService.error(err);
          //this.loading = false;
          this.sessiondata.handleError(err);
        });
  }

  createForm() {
   // console.log(this.userAccess.datechange);
    this.salesform = this.fb.group({
      deliverytype: [{ value: 'STOCK-OUT', disabled: false }, Validators.required],
      InvSeries: [{ value: 'DO', disabled: false }, Validators.required],
      invoicenumber: [{ value: '', disabled: true }, Validators.compose([Validators.required])],
      invdate: [{ value: '', disabled: !this.userAccess.datechange }, Validators.compose([Validators.required, CustomValidators.date])],
      customer: this.fb.group({
        custid: [null, Validators.required],
        name: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(200)])],
        phone: [null, Validators.compose([Validators.minLength(10), Validators.maxLength(25)])],
        address: [null]
      }),
      dispatctype: [null, Validators.required],
      dispatchthru: [null],
      dispatcphone: [null],
      dispatchvehicle: [null],
      Comments: [null],
      salesmanid: ['', Validators.required],
      tobranchid: ['', Validators.required],
      items: this.fb.array([]),
      //total section
      totalvalue: [{ value: 0, disabled: true }, Validators.required],
      sgstAmt: [{ value: 0, disabled: true }, Validators.required],
      cgstAmt: [{ value: 0, disabled: true }, Validators.required],
      kfcessAmt: [{ value: 0, disabled: true }, Validators.required],
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
      InvSeries: this.defaultformData.invoiceseries,
      invoicenumber: this.defaultformData.invoicenumber,
      invdate: this.defaultformData.invdate,
      salesmanid: this.defaultformData.salesmanid
    })
  }

  initItems() {
    return this.fb.group({
      itemcode: ['', Validators.required],
      itemid: [''],
      tid: [''],
      itemname: [{ value: '', disabled: true }, Validators.required],
      qty: [{ value: '', disabled: false }, Validators.required],
      price: [{ value: '', disabled: false }, Validators.required],
      weight: [{ value: '', disabled: false }],
      servicedesc: [{ value: '', disabled: false }],
      uom: [{ value: '', disabled: true }, Validators.required],
      discountper: [''],
      discount: [''],
      total: [{ value: '', disabled: true }, Validators.required],
      gst: [{ value: '', disabled: false }, Validators.required],
      sgst: [{ value: '', disabled: false }, Validators.required],
      cgst: [{ value: '', disabled: false }, Validators.required],
      kfcess: [{ value: '', disabled: true }, Validators.required],
      kfcess_back: [''],
      grossamt: [{ value: '', disabled: true }, Validators.required],
      mrp: [{ value: '', disabled: true }, Validators.required]
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
    this.TotalQty = 0;
    let totatlvalue = 0, sgstamt = 0, cgstamt = 0, netamt = 0, kfcessamt = 0,
      roundoff = 0, grandtotal = 0;

    if (this.salesform.get("deliverytype").value == "STOCK-OUT") {
      let saleobj = this.salesform.getRawValue();
      saleobj.items.forEach(obj => {
        if (typeof obj.itemcode == 'object') {
          totatlvalue = totatlvalue + (obj.qty * obj.price);
          sgstamt = sgstamt + this.sessiondata.roundToTwo(obj.total * obj.sgst / 100);
          cgstamt = cgstamt + this.sessiondata.roundToTwo(obj.total * obj.cgst / 100);
          kfcessamt = kfcessamt + this.sessiondata.roundToTwo(obj.total * obj.kfcess / 100);
          // netamt = netamt + totatlvalue + sgstamt + cgstamt;
          this.TotalQty = this.TotalQty + obj.qty;

         
        }
      });
    }
    else {
      this.purch_Service_items.forEach(obj => {
        totatlvalue = totatlvalue + (obj.Qty * obj.Price);
        sgstamt = sgstamt + this.sessiondata.roundToTwo((obj.Qty * obj.Price) * obj.SGST / 100);
        cgstamt = cgstamt + this.sessiondata.roundToTwo((obj.Qty * obj.Price) * obj.CGST / 100);
        kfcessamt = kfcessamt + this.sessiondata.roundToTwo((obj.Qty * obj.Price) * obj.KFCess / 100);
        // netamt = netamt + totatlvalue + sgstamt + cgstamt; 
        this.TotalQty = this.TotalQty + obj.Qty;
      });
    }

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
      let saveobj = this.salesform.getRawValue();
      saveobj.invdate = new Date().toLocaleString();//saveobj.invdate.toLocaleString();
      if (this.salesform.get("deliverytype").value != "STOCK-OUT") {
        saveobj.items = this.purch_Service_items;
      }
      if (saveobj.items.length > 0) {
        this.userAccess.Save = false;
        this.invservice.InvoiceDataService('api/delivery/save/', saveobj)
          .subscribe(
            data => {
              this.userAccess.Save = true;
              if (data) {
                if (data['IsSuccess']) {
                  this.message.success("Saved successfully");
                  if (isPrint) {
                    this.sessiondata.redirect("delivery/deliveryout/view/", { print: true, id: data["RetID"] });
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
        this.message.error("Invalid input data. Please check again");
      }
    }
    else {
      this.message.error("Invalid input data. Please check again");
    }
  }

  reset(): void {
    this.itemdatachange = 1;

    const control = <FormArray>this.salesform.controls['items'];
    let len = control.length;
    for (let i = len; i >= 0; i--)
      control.removeAt(i);

    this.defaultformData.customer.custid = 0;
    this.defaultformData.customer.name = "";
    this.defaultformData.customer.address = "";
    this.defaultformData.customer.phone = "";

    this.salesform.patchValue({
      deliverytype: "STOCK-OUT",
      InvSeries: this.defaultformData.invoiceseries,
      invoicenumber: this.defaultformData.invoicenumber,
      invdate: this.defaultformData.invdate,
      salesmanid: this.defaultformData.salesmanid,
      customer: this.defaultformData.customer,
      totalvalue: 0,
      sgstAmt: 0,
      cgstAmt: 0,
      kfcessAmt: 0,
      netamount: 0,
      roundoff: 0,
      grandtotal: 0,
      tobranchid: '',
      dispatctype: '',
      dispatchthru: '',
      dispatcphone: '',
      dispatchvehicle: ''
    });

    this.salesform.updateValueAndValidity();
    //this.addItems();
    this.TotalQty = 0;
    this.loadData();
    this.loadItem();
    this.itemdatachange = 0;
  }

  removeAllItems() {
    const control = <FormArray>this.salesform.controls['items'];
    let len = control.length;
    for (let i = len; i >= 0; i--)
      control.removeAt(i);
  }

}
