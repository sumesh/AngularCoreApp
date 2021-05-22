import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { AlertService, InventoryService, LocalDataService,ExcelService } from '../../_services/index';

@Component({
  selector: 'app-stockbydate',
  templateUrl: './stockbydate.component.html',
  styleUrls: ['./stockbydate.component.scss']
})
export class StockByDateReportComponent implements OnInit {

  rowcount: number = 45;
  colcount: number = 3;
  categoryname: string = "";
  groupname: string = "";
  rcount: number = 0;
  printpages = [];
  public fblist: FormGroup;
  userAccess: any = {};
  rows: any = [];
  temp: any = [];
  categorylist = [
    { value: 'ALL', viewValue: 'ALL' },
    { value: 'PR', viewValue: 'PR' },
    { value: 'KR', viewValue: 'KR' },
    { value: 'MR', viewValue: 'MR' },
    { value: 'NW', viewValue: 'NW' },
    { value: 'GLS', viewValue: 'GLS' }
  ];

  itemgrouplist = [];

  columns = [
    { columnDef: 'Brd', header: 'Category', cell: (element: any) => `${element.Brd}` },
    { columnDef: 'Grp', header: 'Group', cell: (element: any) => `${element.Grp}` },
    { columnDef: 'Code', header: 'Code', cell: (element: any) => `${element.Code}` },
    { columnDef: 'Qty', header: 'Qty', cell: (element: any) => `${element.Qty}` },
    { columnDef: 'Price', header: 'Price', cell: (element: any) => `${element.Price}` },
    { columnDef: 'CGST', header: 'CGST', cell: (element: any) => `${element.CGST}` },
    { columnDef: 'SGST', header: 'SGST', cell: (element: any) => `${element.SGST}` }
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
    this.userAccess = this.sessiondata.getUserAccess("SERVICE");
    let d = new Date();
    
    this.fblist = this.fb.group({
      txtFilter: [""],
      itemgroup: ["ALL", Validators.compose([Validators.required])],
      categoryid: ["ALL", Validators.compose([Validators.required])],
      startdate: [d, Validators.compose([Validators.required, CustomValidators.date])],
    });
    this.getData();
    this.ngOnChange();

    

  }

  ngOnChange() {

    this.fblist.get("txtFilter").valueChanges.subscribe(item => {
      this.updateFilter();
    });

    this.fblist.get("itemgroup").valueChanges.subscribe(item => {
      this.updateFilter();
    });

    this.fblist.get("categoryid").valueChanges.subscribe(item => {
      this.updateFilter();
    });
  }

  updateFilter() {
    this.fblist.updateValueAndValidity();
    const val = this.fblist.get("txtFilter").value;//event.target.value.toLowerCase();
    const cid = this.fblist.get("categoryid").value;
    const grp = this.fblist.get("itemgroup").value;

    // filter our data
    const temp = this.temp.filter(function (d) {
      return ((cid == "ALL" || d.Brd == cid)
        && (grp == "ALL" || d.Grp == grp)
        && (d.Code.toLowerCase().indexOf(val.toLowerCase()) !== -1 || !val));
    });
    // update the rows
   
    this.rows = temp;
    this.bindTable();
    this.createPrintArray();
  }

  getData() {
    // console.log(this.fblist.value );
    if (this.fblist.valid) {
      this.fblist.value.startdate = this.fblist.value.startdate.toLocaleString();
    this.invservice.InvoiceDataService('api/reports/stockbydate/', this.fblist.value)
      .subscribe(data => {
        if (data) {
          // push our inital complete list
          this.rows = data;
          this.itemgrouplist = this.uniqueBy("Grp", data);
          // cache our list
          this.temp = [...this.rows];
          this.bindTable();
          this.createPrintArray();
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


  uniqueBy(field, arr) {
    return arr.reduce((acc, curr) => {
      const exists = acc.find(v => v[field] === curr[field]);
      return exists ? acc : acc.concat(curr);
    }, [])
  }

  createPrintArray() {
    let r_c = 1, c_c = 1, p_c = 1;
    let pages = [];
    let spage = {};
    let s_columns = [];
    let s_rows = [];
    let isnewcat: boolean = false;
    let isnewgrp: boolean = false; 

    this.categoryname = "";
    this.groupname = "";

    this.rows.forEach(obj => {
      isnewcat = this.isNewCategory(obj.Brd)
      isnewgrp = this.isNewGroup(obj.Grp)

      if (r_c > this.rowcount || (isnewcat && p_c != 1)) {// row less than 20
        
        s_columns.push(JSON.parse(JSON.stringify(s_rows)));

        spage["Columns"].push(JSON.parse(JSON.stringify(s_columns)));
        this.groupname = ""; 
        isnewgrp = this.isNewGroup(obj.Grp)
        s_rows = [];
        s_columns = [];
        c_c++;
        r_c = 1
      }

      if (c_c > this.colcount || (isnewcat && p_c != 1)) {//column count >4 then new page
        pages.push(JSON.parse(JSON.stringify(spage)));
        this.categoryname = "";
        this.groupname = "";
        isnewcat = this.isNewCategory(obj.Brd)
        isnewgrp = this.isNewGroup(obj.Grp)
        c_c = 1;
        r_c = 1;
        p_c++;
        spage = { Brd: obj.Brd, Columns: [] };
        s_columns = [];
        
      }

      if (isnewcat && p_c == 1) {
        spage = { Brd: obj.Brd, Columns: [] };
        s_columns = [];
        p_c++;
        
      }

      if (isnewgrp) {
        s_rows.push({ IsGroup: true, Grp: obj.Grp })
        r_c++;
      }

      s_rows.push({ IsGroup: false, Grp: obj.Grp, Code: obj.Code, Qty: obj.Qty, Price: obj.Price });
      r_c++;

      // console.log(r_c, c_c, p_c, isnewcat, isnewgrp, this.categoryname, this.groupname);

    });

    if (s_rows.length > 0) {
      s_columns.push(JSON.parse(JSON.stringify(s_rows)));
      spage["Columns"].push(JSON.parse(JSON.stringify(s_columns)));
    }

    if (spage["Columns"] != undefined && spage["Columns"].length > 0) {
      pages.push(JSON.parse(JSON.stringify(spage)));
      p_c++;
    }


    this.printpages = pages;
  }

  isNewCategory(cname: string) {
    if (cname != this.categoryname) {
      this.categoryname = cname;
      return true;
    }

    return false;
  }

  isNewGroup(cname: string) {
    if (cname != this.groupname) {
      this.groupname = cname;
      return true;
    }
    return false;
  }

  converttostring(obj: any) {
    return JSON.stringify(obj);
  }

  print(): void {
    let printContents, popupWin, printcss;
    printcss = ` 
      .p_page{
        width: 98%;
        margin: 1%;
        clear: both; 
    }
    .p_brd{
        display: block;
        clear: both;
        width: 98%;
        margin-bottom: 5px;
        border-bottom: 1px solid #000000;
    }
    .p_table
    {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #000000;
    }
    .p_table tr.p_row td,.p_table tr.p_row th
    {
        border: 1px solid #000000;
    }
    body {
      margin: 0 !important; 
      padding: 0 !important; 
      background-color: transparent;
      box-shadow: 0;
      font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
    }
    
    @page { 
      size: A4 landscape
      margin: 0;
      padding:0;
    } 
    .page-break{page-break-before:always;clear:both}  
   `

    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
          <html>
            <head>
              <title>Adavance Booking</title>
              <style> 
              ${printcss}
              </style>
            </head>
        <body onload="window.print();window.close()">${printContents}</body>
          </html>`
    );
  
    popupWin.document.close();
  }

  exporttoexcel() {
    this.excelService.exportAsExcelFile(this.rows, 'Stock');
 }

}
