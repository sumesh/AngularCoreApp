import {Component, Inject, OnInit, ViewEncapsulation,ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef,MatPaginator, MatTableDataSource} from "@angular/material";

import { CustomValidators } from 'ng2-validation'; 
import {FormBuilder, Validators, FormGroup,FormControl} from "@angular/forms";
import { AlertService, InventoryService, LocalDataService } from '../../_services/index';

@Component({
  moduleId: module.id,
  selector: 'app-printaudit',
  templateUrl: './printaudit.component.html',
  styleUrls: ['./printaudit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrintAuditComponent implements OnInit {
  public printaudit: FormGroup;

   printlist:any=[];

  displayedColumns: string[] = ['printedby', 'custcopy', 'cmpcopy', 'shopcopy'];
  dataSource = new MatTableDataSource<any>();
  // @Output() itemupdated: EventEmitter<any> = new EventEmitter();
  // @Input('pagetype') public pageType: string;
  // @Input('invid') public invid: string; 
 @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private fb: FormBuilder, 
    public dialogRef: MatDialogRef<PrintAuditComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private invservice: InventoryService,
     private sessiondata: LocalDataService,
     private message: AlertService) {

     
  }

  ngOnInit() {  
     this.dataSource.paginator = this.paginator;
    this.createForm();
    this.getPrintAudit();
  }

  createForm()
  {
    this.printaudit = this.fb.group({
      isCusCopy: [this.data.cust],
      IsShCopy: [this.data.shop],
      isCmpCopy: [this.data.comp],
      Comments: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25)])],
    });
  }

   
   
  ///
  savePrint() { 
    //this.itemupdated.emit(null);
    if(this.printaudit.valid)
    {      
     this.savePrintAudit();
    }
  }

  getPrintAudit() {
    this.invservice.InvoiceDataService('api/getprintaudit/', { 
      InvID: this.data.invid, 
      InvType: this.data.InvType})
      .subscribe(
      data => {
        if (data) {
          this.printlist=data;
          this.dataSource.data=this.printlist;
        }         
        else {
          this.message.error("Error while communicating with server. Please try again");
        }
      },
      err => {
        this.message.error("Error while communicating with server. Please try again");
      });
  }

  savePrintAudit() {
    this.invservice.InvoiceDataService('api/saveprintaudit/', 
    { 
      InvID: this.data.invid, 
      InvType: this.data.InvType,
      Comments:this.printaudit.get("Comments").value,
      CmpCopy:this.printaudit.get("isCmpCopy").value,
      ShopCopy:this.printaudit.get("IsShCopy").value,
      CustCopy:this.printaudit.get("isCusCopy").value }).subscribe(
      data => { 
        if (data) {
          this.dialogRef.close(this.printaudit.value);
        }
        else {
          this.message.error("Error while communicating with server. Please try again");
        }

      },
      err => {
        this.message.error("Error while communicating with server. Please try again");
      });
  }

    
}

