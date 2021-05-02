import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { AlertService, InventoryService, LocalDataService } from '../../../_services/index';

@Component({
  selector: 'app-table-filter',
  templateUrl: './saleorderlist.component.html',
  styleUrls: ['./saleorderlist.component.scss']
})
export class SaleOrderListComponent implements OnInit {

  public fblist: FormGroup;

  userAccess: any = {};

  minDate: Date;
  maxDate: Date;

  rows: any = [];

  temp: any = [];

  displayedColumns: string[] = ['InvoiceNumber', 'invdatetime', 'invtotal', 'discount', 'tax', 'grossamount', 'giftcard', 'grandtotal', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableOffset: number = 0;
  pageSize: number = 10;

  // columns = [
  //   { prop: 'InvoiceNumber', name: 'Invoice Number' },
  //   { prop: 'InvDate_S', name: 'Date' },
  //   { prop: 'InvTime_S', name: 'Time' },
  //   //{ prop: 'Customer.CustomerName', name: 'Customer' },
  //   { prop: 'totalvalue', name: 'Total' },
  //   { prop: 'totdiscbtaxval', name: 'Gift' },
  //   { prop: 'SGSTAmt', name: 'SGST' },
  //   { prop: 'CGSTAmt', name: 'CGST' },
  //   { prop: 'grossamount', name: 'Gross.' },
  //   { prop: 'totdiscval', name: 'Discount' },
  //   { prop: 'grandtotal', name: 'Grand Total' },
  // ];

  constructor(
    private fb: FormBuilder,
    private invservice: InventoryService,
    public sessiondata: LocalDataService,
    private message: AlertService) {
  }


  ngOnInit() {
    let d = new Date();
    this.maxDate = new Date();
    this.minDate = new Date()
    this.minDate.setDate(d.getDate() - 400);
    this.userAccess = this.sessiondata.getUserAccess("SALEORDER");
    this.fblist = this.fb.group({
      startdate: [d, Validators.compose([Validators.required, CustomValidators.date])],
      enddate: [d, Validators.compose([Validators.required, CustomValidators.date])],
      filtervalue: ['']
    });

    if (this.getPageData() == false) {
      this.getData();
    }
  }


  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.InvoiceNumber.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // update the rows
    this.rows = temp;
    this.bindTableData();
  }

  getData() {

    if (this.fblist.valid) {
      let searchdata = this.fblist.value;
      searchdata.startdate = searchdata.startdate.toLocaleString();
      searchdata.enddate = searchdata.enddate.toLocaleString();

      this.invservice.InvoiceDataService('api/salesorder/search/', this.fblist.value)
        .subscribe(data => {
          if (data) {
            // push our inital complete list
            this.rows = data;
            // cache our list
            this.temp = [...this.rows];

            this.bindTableData();
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

  onPaginateChange(event): void {
    this.tableOffset = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  setPageData() {
    var pagedata = {
      pagenumber: this.tableOffset,
      pagesize: this.pageSize,
      pagerows: this.rows,
      pagerowstemp: this.temp,
      startdate: this.fblist.value.startdate,
      enddate: this.fblist.value.enddate,
      filter: this.fblist.value.filtervalue

    }

    localStorage.setItem('salesorderlist', JSON.stringify(pagedata));
  }

  getPageData() {
    var pagedata = JSON.parse(localStorage.getItem('salesorderlist'));
    if (pagedata) {
      this.tableOffset = pagedata.pagenumber;
      this.pageSize = pagedata.pagesize;
      this.rows = pagedata.pagerows;
      this.temp = pagedata.pagerowstemp;
      this.fblist.patchValue({
        startdate: new Date(pagedata.startdate),
        enddate: new Date(pagedata.enddate),
        filtervalue: pagedata.filter
      });
      this.bindTableData();
      this.clearPageData();
      return true;
    }

    return false;
  }

  clearPageData() {
    localStorage.removeItem('salesorderlist');
  }

  bindTableData() {
    this.dataSource.data = this.rows;
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageIndex = this.tableOffset;
    this.dataSource.paginator.pageSize = this.pageSize;

  }

  redirectPage(page: string, obj: any) {
    if (page == "print") {
      this.setPageData();
      this.sessiondata.redirect('sale/salesorder/view', { print: true, id: obj.IVID });
    }
    else if (page == "view") {
      this.setPageData();
      this.sessiondata.redirect('sale/salesorder/view', { print: false, id: obj.IVID });
    }
    else if (page == "edit") {
      this.sessiondata.redirect('sale/salesorder', { id: obj.IVID });
    }
    else if (page == "cancel") {
      //this.sessiondata.redirect('service/service', {  id: obj.IVID });
    }
  }
}
