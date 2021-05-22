import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { CustomValidators } from 'ng2-validation';
import { AlertService, InventoryService, LocalDataService, ExcelService } from '../../_services/index';

@Component({
  selector: 'app-blank',
  templateUrl: './dailystatement.component.html',
  styleUrls: ['./dailystatement.component.scss']
})
export class DailyStatementReportComponent implements OnInit {

  public fblist: FormGroup;
  userAccess: any = {};
  minDate: Date;
  maxDate: Date;

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
    { columnDef: 'Status', header: 'Type', cell: (element: any) => `${element.Status}` },
    { columnDef: 'invno', header: 'Inv. No#', cell: (element: any) => `${element.InvoiceNumber}` },
    { columnDef: 'Date', header: 'Date', cell: (element: any) => `${element.InvDate_S}` },
    { columnDef: 'Mode', header: 'Mode', cell: (element: any) => `${element.PayMode}` },
    { columnDef: 'Total', header: 'Total', cell: (element: any) => `${element.totalvalue}` },
    { columnDef: 'Dicount', header: 'Dicount', cell: (element: any) => `${element.totdiscval}` },
    { columnDef: 'SGST', header: 'SGST', cell: (element: any) => `${element.SGSTAmt}` },
    { columnDef: 'CGST', header: 'CGST', cell: (element: any) => `${element.CGSTAmt}` },   
    { columnDef: 'RoundOff', header: 'Round Off', cell: (element: any) => `${element.RoundOff}` },
    { columnDef: 'Grand Total', header: 'Grand Total', cell: (element: any) => `${element.grandtotal}` },
    { columnDef: 'Advance', header: 'Advance', cell: (element: any) => `${element.advanceamt}` },
    { columnDef: 'Cash', header: 'Cash', cell: (element: any) => `${element.CashAmt}` },
    { columnDef: 'Card', header: 'Card', cell: (element: any) => `${element.CardAmt}` },
    { columnDef: 'Credit', header: 'Credit', cell: (element: any) => `${element.CreditAmt}` }
  ];

  displayedColumns = this.columns.map(c => c.columnDef);
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
      status: ['ALL']
    });
    this.getData();
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

      this.invservice.InvoiceDataService('api/reports/dailystatement/', this.fblist.value)
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
    this.excelService.exportAsExcelFile(this.rows, 'Daily statement');
  }


}
