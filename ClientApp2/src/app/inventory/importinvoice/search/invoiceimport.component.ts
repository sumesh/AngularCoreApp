import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatTooltip } from "@angular/material/tooltip";
import { AlertService, InventoryService, LocalDataService } from '../../../_services/index';
import { map, startWith } from 'rxjs/operators';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-search-customer',
  templateUrl: './invoiceimport.component.html',
  styleUrls: ['./invoiceimport.component.scss']
})
export class InvoiceImportSearchComponent implements OnInit {

  public fbcustsearch: FormGroup; 
  customersaving: boolean = false;
  userAccess: any = {};
  rows: any = [];

  branchlist: any = [];
  displayedColumns: string[] = ['finyear', 'invno', 'taxtype', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  description: 'Invoice Search';
  public showCustomerSearch: boolean = true;
  //   private dialogRef: MatDialogRef<CustomerSearchComponent>;
  //   @Inject(MAT_DIALOG_DATA)  data   {

  //   this.description = data.description;
  // }

  constructor(
    private fb: FormBuilder,
    private invservice: InventoryService,
    public sessiondata: LocalDataService,
    private message: AlertService,
    private dialogRef: MatDialogRef<InvoiceImportSearchComponent>,
    @Inject(MAT_DIALOG_DATA) dialogdata: any) {
    this.description = dialogdata.description;
    this.branchlist=dialogdata.branchlist;;
  }

  ngOnInit() {

    this.userAccess = this.sessiondata.getUserAccess("CUSTOMERSEARCH");
    this.fbcustsearch = this.fb.group({
      tobranchid: ['', Validators.required],
      invNo: ['']
    });



    this.ngOnChange();
  }

  ngOnChange() { 

    //Item select
    this.fbcustsearch.get("tobranchid").valueChanges.subscribe(val => {
      this.fbcustsearch.updateValueAndValidity();
      this.getInvoiceData();
    });
    //Item select
    this.fbcustsearch.get("invNo").valueChanges.subscribe(val => {
      this.getInvoiceData();
    });

  }


  getInvoiceData() {
    if (this.fbcustsearch.valid) {
      var br=this.fbcustsearch.get("tobranchid").value;
      this.invservice.InvoiceDataService('api/invoice/import/',
      {
        ToBranch: br.BranchID,
        InvoiceNumber: this.fbcustsearch.get("invNo").value,
        PageType: this.description
      })
        .subscribe(data => {
          if (data) {
            this.rows = data;
            this.dataSource.data = this.rows;
            this.dataSource.paginator = this.paginator;
          }
          else {

          }
        },
          err => {
            this.message.error("Error while communicating with server. Please try again");
            this.sessiondata.handleError(err);
          });
    }
  }

  getBrnachData() {
    if (this.fbcustsearch.valid) {
      this.invservice.InvoiceDataService('api/invoice/branch/', {})
        .subscribe(data => {
          if (data) {
            this.branchlist = data; 
          }
        },
          err => {
            this.message.error("Error while communicating with server. Please try again");
            this.sessiondata.handleError(err);
          });
    }
  } 

  redirectPage(page: string, obj: any) {
    if (page == "view") { 
      obj.Branch=this.fbcustsearch.get("tobranchid").value;
      this.dialogRef.close(obj);
    }
  }

  close() {
    this.dialogRef.close();
  } 
}
