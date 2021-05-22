import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { AlertService, InventoryService, LocalDataService, ExcelService } from '../../_services/index';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-blank',
  templateUrl: './stockmovement.component.html',
  styleUrls: ['./stockmovement.component.scss']
})
export class StockmovementReportComponent implements OnInit {

  public fblist: FormGroup;
  userAccess: any = {};
  minDate: Date;
  maxDate: Date;
  stocklist: any;
  itemcode: FormControl;
  itemdatachange = 0;
  filteredItem: any;

  rows: any = [];

  temp: any = [];

  salesType = [
    { value: 'ALL', viewValue: 'ALL' },
    { value: 'SALE', viewValue: 'SALE' },
    { value: 'SALE RETURN', viewValue: 'SALE RETURN' },
    { value: 'PURCHASE', viewValue: 'PURCHASE' },
    { value: 'SALE ORDER', viewValue: 'SALE ORDER' }
  ];

  columns = [
    { columnDef: 'BatchNo', header: 'Item', cell: (element: any) => `${element.BatchNo}` },
    { columnDef: 'ItemName', header: 'Name', cell: (element: any) => `${element.ItemName}` },
    { columnDef: 'Status', header: 'Type', cell: (element: any) => `${element.Status}` },
    //{ columnDef: 'Mode', header: 'Mode', cell: (element: any) => `${element.PayMode}` },
    { columnDef: 'InvoiceNumber', header: 'Inv No#', cell: (element: any) => `${element.InvoiceNumber}` },
    { columnDef: 'InvDate_S', header: 'Date', cell: (element: any) => `${element.InvDate_S}` },
    { columnDef: 'Comments', header: 'Remarks', cell: (element: any) => `${element.Comments}` },
    { columnDef: 'Quantity', header: 'Quantity', cell: (element: any) => `${element.Quantity}` },
    { columnDef: 'BalaceQuantity', header: 'Bal. Qty', cell: (element: any) => `${element.BalaceQuantity}` },
     
  ];

  displayedColumns = this.columns.map(c => c.columnDef);
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator,{static: false}) paginator!: MatPaginator;
  constructor(
    private fb: FormBuilder,
    private invservice: InventoryService,
    public sessiondata: LocalDataService,
    private message: AlertService,
    private excelService: ExcelService) {

  }

  ngOnInit() {
    let d = new Date();
    this.maxDate = new Date();
    this.minDate = new Date()
    this.minDate.setDate(d.getDate() - 400);
    this.userAccess = this.sessiondata.getUserAccess("DAILYSTATEMENT");
    this.fblist = this.fb.group({
      startdate: [d, Validators.compose([Validators.required, CustomValidators.date])],
      enddate: [d, Validators.compose([Validators.required, CustomValidators.date])],
      itemcode: ['', Validators.required],
      itemid: ['']
    });
    
    this.loadItem();
    this.ngEvents();

  }


  ngEvents() {
    //Auto complete
    this.filteredItem = this.fblist.get("itemcode").valueChanges.pipe(
      // .startWith(null)
      map(val => this.displayFn(val))
      ,map(name => this.filterItem(name))
    );

    //Item select
    this.fblist.get("itemcode").valueChanges.subscribe(val => {
      // console.log(val, 'Value change event for control');
      if (val && typeof val === 'object') {
        this.fblist.patchValue(
          {
            itemid: val.ItemID
          });
      }
    });
  }

  loadItem() {
    this.invservice.InvoiceDataService('api/getitemlist/', { PageType: "PURCHASE" })
      .subscribe(
      data => {
        if (data) {
          localStorage.setItem('itemlist', JSON.stringify(data));
        }
        else {

        }

      },
      err => {
        this.message.error("Error while communicating with server. Please try again");
        this.sessiondata.handleError(err);
      });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.InvNo.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.rows = temp;

    this.bindTable();
  }

  getData() {
    if (this.fblist.valid) {
      this.fblist.value.startdate = this.fblist.value.startdate.toLocaleString();
      this.fblist.value.enddate = this.fblist.value.enddate.toLocaleString();

      this.invservice.InvoiceDataService('api/reports/stockmovement/', this.fblist.value)
        .subscribe(data => {
          if (data) {
            // push our inital complete list
            this.rows = data;
            // cache our list
            this.temp = [...this.rows];
            this.bindTable();
          }
          else {
            //this.message.error("Error while communicating with server. Please try again");
          }
        },
        err => {
          this.message.error("Error while communicating with server. Please try again");
          this.sessiondata.handleError(err);
        });
    }
  }

  
  bindTable() {
    this.dataSource.data = this.rows;
    this.dataSource.paginator = this.paginator;
  }


  download() {
    this.excelService.exportAsExcelFile(this.rows, 'Stock Movement');
  }

  ///
  displayFn(value: any): string {
    return value && typeof value === 'object' ? (value.Code +" - "+value.Name) : value;
  }

  ///
  filterItem(val: string) {
    // console.log(this.stocklist);
    if (this.stocklist == null || this.stocklist == undefined) {
      this.stocklist = JSON.parse(localStorage.getItem('itemlist'))
    }

    if (val && this.stocklist) {
      const filterValue = val.toLowerCase();
      return this.stocklist.filter(item =>
        item.Code.toLowerCase().startsWith(filterValue));
    }

    return this.stocklist;
  }

}
