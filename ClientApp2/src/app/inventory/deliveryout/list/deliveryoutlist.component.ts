import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { AlertService, InventoryService, LocalDataService } from '../../../_services/index';

@Component({
  selector: 'app-table-filter',
  templateUrl: './deliveryoutlist.component.html',
  styleUrls: ['./deliveryoutlist.component.scss']
})
export class DeliveryOutListComponent implements OnInit {

  public fblist: FormGroup;
  userAccess:any={}; 
  minDate: Date;
  maxDate: Date;

  rows: any = [];

  temp: any = [];

  salesType = [
    { value: 'OUT-ALL', viewValue: 'ALL' },
    { value: 'STOCK-OUT', viewValue: 'STOCK-OUT' },
    { value: 'SERVICE-OUT', viewValue: 'SERVICE-OUT' },
    { value: 'PURCHASE-OUT', viewValue: 'PURCHASE-OUT' }  
  ];
 
  displayedColumns: string[] = ['InvoiceNumber', 'invdatetime', 'deliverytype', 'frombr', 'invtotal'  , 'action'];
 dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tableOffset: number = 0;
  pageSize: number = 10;

  deliverytype: string = '';


  constructor(
    private fb: FormBuilder,
    private invservice: InventoryService,
    public sessiondata: LocalDataService,
    private message: AlertService) {

  }

  ngOnInit() {
    let d = new Date();
    this.maxDate = new Date();
    this.minDate=new Date()
    this.minDate.setDate(d.getDate() - 400);
    this.userAccess=this.sessiondata.getUserAccess("DELIVERYOUT");
    this.fblist = this.fb.group({
      startdate: [d, Validators.compose([Validators.required, CustomValidators.date])],
      enddate: [d, Validators.compose([Validators.required, CustomValidators.date])],
      deliverytype:['OUT-ALL'],
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
      this.fblist.value.startdate =  this.fblist.value.startdate.toLocaleString();
      this.fblist.value.enddate =  this.fblist.value.enddate.toLocaleString();
      
      this.invservice.InvoiceDataService('api/delivery/search/', this.fblist.value)
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

 
  bindTableData() {
    this.dataSource.data = this.rows;
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageIndex = this.tableOffset;
    this.dataSource.paginator.pageSize = this.pageSize;

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
      filter: this.fblist.value.filtervalue,
      deliverytype:this.fblist.value.deliverytype
    }

    localStorage.setItem('deliveryoutlist', JSON.stringify(pagedata));
  }

  getPageData() {
    var pagedata = JSON.parse(localStorage.getItem('deliveryoutlist'));
    if (pagedata) {
      this.tableOffset = pagedata.pagenumber;
      this.pageSize = pagedata.pagesize;
      this.rows = pagedata.pagerows;
      this.temp = pagedata.pagerowstemp;
      this.fblist.patchValue({
        startdate: new Date(pagedata.startdate),
        enddate: new Date(pagedata.enddate),
        filtervalue: pagedata.filter,
        deliverytype:pagedata.deliverytype
      });

      this.bindTableData();
      this.clearPageData();
      return true;
    }

    return false;
  }

  clearPageData() {
    localStorage.removeItem('deliveryoutlist');
  }

  redirectPage(page:string,obj:any)
  {  
    if(page=="print")
    {
      this.setPageData();
      this.sessiondata.redirect('delivery/deliveryout/view', { print: true, id: obj.IVID });
    }
    else if(page=="view")
    {
      this.setPageData();
      this.sessiondata.redirect('delivery/deliveryout/view', { print: false, id: obj.IVID });
    }
    else if(page=="edit")
    {
      this.sessiondata.redirect('sdelivery/deliveryout', {  id: obj.IVID });
    }
    else if(page=="cancel")
    {
      //this.sessiondata.redirect('service/service', {  id: obj.IVID });
    }
  }
}
