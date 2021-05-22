import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MatPaginator, MatTableDataSource,MatOption } from "@angular/material";
import { AlertService, InventoryService, LocalDataService, ExcelService } from '../../_services/index';
import { map, startWith } from 'rxjs/operators';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'app-blank',
  templateUrl: './reportmaster.component.html',
  styleUrls: ['./reportmaster.component.scss']
})
export class ReportMasterComponent implements OnInit {

  public config: PerfectScrollbarConfigInterface = {};
  //@ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective,{static:false}) directiveRef?: PerfectScrollbarDirective;

  public fblist: FormGroup;
  userAccess: any = {};
  minDate: Date;
  maxDate: Date;
  stocklist: any;
  itemcode: FormControl;
  itemdatachange = 0;
  filteredItem: any;
  showtable: boolean = false;
  rows: any = [];

  temp: any = [];
  downloaddata: any = {};
  reportcodes = [];
  reportTypes = [];
  rptbranches = [];
  reportmaster: any = {
    FromDate: true,
    ToDate: true,
    ReportType: true,
    ItemCode: false,
    Branch:false
  };
  showprintbutton:boolean=false;
  str_startdate:string='';
  columns = [];
  branchdtl: any = {};
  displayedColumns: string[] = this.columns.map(c => c.columnDef);
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator,{static: false}) paginator!: MatPaginator;
  @ViewChild('brn_allSelected',{static:false}) private brn_allSelected: MatOption;
  // Report Type
  invoicetype: string = '';
  invoiceseries: string = '';
  
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
    this.userAccess = this.sessiondata.getUserAccess("REPORTMASTER");
    this.branchdtl = this.sessiondata.getBranch();
    this.fblist = this.fb.group({
      reportcode: [''],
      startdate: [d, Validators.compose([Validators.required, CustomValidators.date])],
      enddate: [d, Validators.compose([Validators.required, CustomValidators.date])],
      itemcode: [''],
      itemid: [''],
      reporttype: [''],
      branchids:['']
    });

    this.loadItem();
    this.ngEvents();

  }


  ngEvents() {
    //Auto complete
    this.filteredItem = this.fblist.get("itemcode").valueChanges.pipe(
      // .startWith(null)
      map(val => this.displayFn(val))
      , map(name => this.filterItem(name))
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

    this.fblist.get("reportcode").valueChanges.subscribe(item => {

      this.loadItem();
    });
  }

  loadItem() {
    this.showtable = false;
    this.showprintbutton=false;
    this.invservice.InvoiceDataService('api/reports/reportmaster/', { ReportCode: this.fblist.get("reportcode").value })
      .subscribe(
        data => {
          if (data) {
            if (data['Reports'] && data['Reports'].length > 0) {
              this.reportmaster = data['Reports'][0];
            }

            if (this.fblist.get("reportcode").value == '') {
              this.reportcodes = data['Reports'];

              this.fblist.patchValue(
                {
                  reportcode: this.reportcodes[0].ReportCode
                });
            }

            this.reportTypes = data['Types'];
            if (this.reportTypes.length > 0) {
              this.fblist.patchValue(
                {
                  reporttype: this.reportTypes[0].Value
                });
            }

            this.rptbranches = data['Branches'];
            if (this.rptbranches.length > 0) {
              this.fblist.patchValue(
                {
                  branchids: [this.rptbranches[0].Value]
                });
            }

            localStorage.setItem('itemlist', JSON.stringify(data['Items']));
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
  }

  getData() {
    if (this.fblist.valid) {
      this.fblist.value.startdate = this.fblist.value.startdate.toLocaleString();
      this.fblist.value.enddate = this.fblist.value.enddate.toLocaleString();
      this.userAccess.Save = false;
      this.invservice.InvoiceDataService('api/reports/reportdata/', this.fblist.value)
        .subscribe(data => {
          this.userAccess.Save = true;
          if (data) {
            // push our inital complete list 
            this.rows = data['TableData'].Table;

            // cache our list
            this.temp = [...this.rows];
            this.downloaddata = data['TableData'];
            this.bindTable();
            //this.excelService.exportAsExcelFile(this.rows, this.fblist.get("reportcode").value);
          }
          else {
            this.message.error("No Data Available. Please try again");
          }
        },
          err => {
            this.userAccess.Save = true;
            this.message.error("Error while communicating with server. Please try again");
            this.sessiondata.handleError(err);
          });
    }
  }

  view() {
    this.getData();
  }

  download() {
    // this.getData()
    this.excelService.exportAsExcelFile_MultiSheet(this.downloaddata, this.fblist.get("reportcode").value);
  }

  bindTable() {
    this.columns = [];
    if (this.rows.length > 0) {
      this.showtable = true;
      var columnsIn = this.rows[0];
      // loop through every key in the object
      for (var key in columnsIn) {
        this.columns.push({ columnDef: key, header: key });
        // console.log(key); // here is your column name you are looking for + its value
      }

      if(this.fblist.get("reportcode").value=="TAXDAILY")
      {
        this.showprintbutton=true;
        this.str_startdate=new Date(this.fblist.value.startdate).toDateString();
      }
    }
    else {
      this.showtable = false;
      this.showprintbutton=false;
    }

    this.displayedColumns = this.columns.map(c => c.columnDef);
    this.dataSource.data = this.rows;
    this.dataSource.paginator = this.paginator;
    //this.dataSource.paginator.pageIndex = 0;
    // this.dataSource.paginator.pageSize = 10;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ///
  displayFn(value: any): string {
    return value && typeof value === 'object' ? (value.Code + " - " + value.Name) : value;
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

  getInvoiceType(t) {
    if (this.invoicetype == t.InvType  && this.invoiceseries == t.Series ) {
      return false;
    }
    else {
      this.invoicetype = t.InvType;
      this.invoiceseries = t.Series;
      return true;
    }
  }

  brn_togglePerOne(all){ 
    if (this.brn_allSelected.selected) {  
     this.brn_allSelected.deselect();
     return false;
 }
   if(this.fblist.controls.branchids.value.length== this.rptbranches.length)
     this.brn_allSelected.select();
 
 }
 brn_toggleAllSelection() {
     if (this.brn_allSelected.selected) {
       this.fblist.controls.branchids
         .patchValue([... this.rptbranches.map(item => item.Value), 0]);
     } else {
        this.fblist.controls.branchids.patchValue([]);
          
     }
   }

  print(): void {
    let printContents, popupWin, printcss;
    printcss = `  
    h2,h4{margin:0;}
    h4{margin:2px 0;  border-bottom: 1px solid #000000;}
      .p_page{
        width: 98%;
        margin: 1%;
        clear: both; 
    }
    .p_brd{
      display: block;
      clear: both;
      width: 98%;
      margin: 0px 0 5px 0;
      
      border-bottom: 1px solid #000000;
  }
  .p_table
  {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #000000;
      font-size:12px;
  }
  .p_table tr.p_row td,.p_table tr.p_row th
  {
      border: 1px solid #000000;
      font-size:12px;
  }
  .p_table thead th{font-weight: bold;background-color: rgb(111, 143, 175)}
  .p_table .highight {background-color: #6C7A89;}
  .p_table .total {background-color: rgb(212, 207, 207);font-weight: bold}
  .p_table td.inv-right{text-align: right}
    body {
      margin: 0 !important; 
      padding: 0 !important; 
      background-color: transparent;
      box-shadow: 0;
      font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
      font-size:12px;
    }
    
    @page { 
      size: A4 landscape
      margin: 0;
      padding:0;
    } 
    .page-break{page-break-before:always;clear:both}  
   `

    printContents = document.getElementById('print_dailysummay').innerHTML;
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

}
