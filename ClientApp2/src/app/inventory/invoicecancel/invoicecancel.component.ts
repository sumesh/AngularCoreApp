import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CustomValidators } from 'ng2-validation';
import { FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";
import { AlertService, InventoryService, LocalDataService } from '../../_services/index';

@Component({
  //moduleId: module.id,
  selector: 'app-invoicecancel',
  templateUrl: './invoicecancel.component.html',
  styleUrls: ['./invoicecancel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvoiceCancelComponent implements OnInit {
  public finvcancel: FormGroup;

  printlist: any = [];
  // @Output() itemupdated: EventEmitter<any> = new EventEmitter();
  // @Input('pagetype') public pageType: string;
  // @Input('invid') public invid: string; 


  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<InvoiceCancelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private invservice: InventoryService,
    private sessiondata: LocalDataService,
    private message: AlertService) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.finvcancel = this.fb.group({
      Comments: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(200)])],
    });
  }



  ///
  saveCancel() {
    //this.itemupdated.emit(null);
    if (this.finvcancel.valid) {
      this.saveCancelInvoice();
    }
  }


  saveCancelInvoice() {
    this.invservice.InvoiceDataService('api/savecancelinvoice/',
      {
        InvID: this.data.invid,
        InvType: this.data.InvType,
        Comments: this.finvcancel.get("Comments").value
      }).subscribe(
      data => {
        if (data) {
          if (data['IsSuccess']) {
            this.message.success("Invoice Cancelled");
            this.dialogRef.close(this.finvcancel.value);
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
        this.message.error("Error while communicating with server. Please try again");
      });
  }


}

