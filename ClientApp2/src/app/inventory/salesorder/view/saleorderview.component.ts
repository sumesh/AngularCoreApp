import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { DecimalPipe, DOCUMENT } from '@angular/common';
import { AlertService, InventoryService, LocalDataService } from '../../../_services/index';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PrintAuditComponent } from '../../printaudit/printaudit.component';
import { InvoiceCancelComponent } from '../../invoicecancel/invoicecancel.component';


@Component({
  selector: 'app-invoice',
  templateUrl: './saleorderview.component.html',
  styleUrls: ['./saleorderview.component.scss']
})
export class SaleOrderViewComponent implements OnInit {
  userAccess: any = {};
  branchdtl: any = {};
  today = '';
  invdata: any = {};
  PrintListType: any = [];
  PrintType: any = { cust: true, shop: true, comp: false };
  invtableitem: any = [];
  isprint: boolean = false;
  dialogRef: MatDialogRef<PrintAuditComponent> | null;
  canceldialogRef: MatDialogRef<InvoiceCancelComponent> | null;
  lastAfterClosedResult: any;
  lastBeforeCloseResult: string;
  actionsAlignment: string;

   displayedColumns: string[] = ['name','qty','weight','ucode','price','amount','discount','cgst','sgst','kfcess','total'];
  dataSource = new MatTableDataSource<any>();


  config = {
    disableClose: false,
    panelClass: 'custom-overlay-pane-class',
    hasBackdrop: true,
    width: '80vw',
    height: '',
    maxheight: '40vw',
    data: {
      invid: 0,
      cust: false,
      shop: true,
      comp: true,
      InvType: 'SaleOrder'
    }
  };
  constructor(private invservice: InventoryService,
    public sessiondata: LocalDataService,
    private message: AlertService,
    public dialog: MatDialog,
    @Inject(DOCUMENT) doc: any) {

    // Possible useful example for the open and closeAll events.
    // Adding a class to the body if a dialog opens and
    // removing it after all open dialogs are closed
    dialog.afterOpen.subscribe(() => {
      if (!doc.body.classList.contains('no-scroll')) {
        doc.body.classList.add('no-scroll');
      }
    });
    dialog.afterAllClosed.subscribe(() => {
      doc.body.classList.remove('no-scroll');
    });
  }

  ngOnInit() {
    this.branchdtl = this.sessiondata.getBranch();
    this.userAccess = this.sessiondata.getUserAccess("SALEORDER");
    let q: any = this.sessiondata.getQueryStringValue(['print', 'id']);
    this.getInvoiceData(q.id, JSON.parse(q.print));
  }



  getInvoiceData(invid: number, isprint: boolean) {
    this.invservice.InvoiceDataService('api/salesorder/view/', { IVID: invid, IsPrint: isprint })
      .subscribe(
      data => {

        if (data) {
          this.isprint = isprint;
          this.invdata = data;
         this.dataSource.data = this.invdata.Items;

          this.invtableitem = this.invdata.Items.map(x => Object.assign({}, x));
          if (this.invdata.Items.length > 0 && this.invdata.Items.length < 8) {
            for (var i = this.invdata.Items.length; i <= 8; i++) {
              this.invdata.Items.push({ HSNCode: '', Name: '', })
            }
          }

          console.log(this.invdata, this.isprint);
          if (this.invdata && this.isprint) {
            if (this.invdata.PrintCount == 0) {
              this.updatePrintList(this.invdata.PrintCount);
            }
            else {
              this.PrintType.cust = false;
              this.openPrintAudit();
            }
          }
        }
        else {
          this.message.error("Error while communicating with server. Please try again");
        }

      },
      err => {
        this.message.error("Error while communicating with server. Please try again");
        this.sessiondata.handleError(err); 
      });
  }

  updatePrintList(cnt): void {
    let addText = cnt == 0 ? " Original" : " Duplicate";
    let cnttext = cnt == 0 ? "" : " (" + cnt + ")";
    this.PrintListType = [];
    if (this.PrintType.cust) {
      this.PrintListType.push({ printType: 'Customer' + addText + cnttext });
    }
    if (this.PrintType.shop) {
      this.PrintListType.push({ printType: 'Shop Duplicate' + cnttext });
    }
    if (this.PrintType.comp) {
      this.PrintListType.push({ printType: 'Company Duplicate' + cnttext });
    }
    
    this.today = new Date().toString();
    setTimeout(this.print, 1000);
  }

  print(): void {
    let printContents, popupWin, printcss;
    printcss = `@media print { 
      div[size="A5"] {
        background: white;
        width: 21cm;
        height: 12.80cm;
        /*29.7cm;*/
        display: block;
        margin: 0 auto;
        margin-bottom: 0.5cm;    
        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; 
      }
      .item-list {
        border-collapse: collapse;
        width: 100%;
        font-size: 12px;
      }
      .item-list tr.items th,
      .item-list tr.items td {
        border: 1px solid #424040;
        border-bottom: none;
        border-top: none;
        font-size: 11px;
        padding-top: 3px;
      }
      .item-list tr.items th {
        font-weight: 500;
        height: 15px;
        background-color: #eee;
        vertical-align: middle;
        border: 1px solid #424040;
      }
      .item-list tr.items:last td {
        border-bottom: 1px solid #424040;
      }
      .item-list tr.items td {
        height: 16px;
      }
      .item-list tfoot tr td {
        height: 16px;
      }
      .inv-width-3 {
        width: 3%;
      }
      .inv-width-4 {
        width: 4%;
      }
      .inv-width-5 {
        width: 6%;
      }
      .inv-width-6 {
        width: 6%;
      }
      .inv-width-7 {
        width: 7%;
      }
      .inv-width-9 {
        width: 9%;
      }
      .inv-width-10 {
        width: 10%;
      }
      .inv-width-15 {
        width: 15%;
      }
      .inv-width-25 {
        width: 25%;
      }
      .inv-width-30 {
        width: 31%
      }
      .inv-center {
        text-align: center;
        vertical-align: middle;
      }
      .inv-left {
        text-align: left;
        vertical-align: middle;
      }
      .inv-right {
        text-align: right;
        vertical-align: middle;
        padding-right: 2px;
      }
      .item-header .fl {
        float: left;
        border-right: 1px solid #424040;
      }
      .item-header .fr {
        float: left;
        border-right: 1px solid #424040;
      }
      .item-header .header-company {
        text-align: left;
        width: 58%;
      }
      .item-header .header-details {
        text-align: right;
        width: 40%;
      }
      .item-header {
        width: 100%;
        font-size: 12px;
        clear: both;
        border-collapse: collapse;
      }
      .item-header h1 {
        margin: 0;
        padding: 0;
      }
      .item-header h3 {
        margin: 0;
        padding: 0;
      }
      .head-width-60 {
        width: 62.2%;
      }
      .br-1-b0 {
        border: 1px solid #424040;
        border-bottom: none;
      }
      .br-b1 {
        border-bottom: 1px solid #424040;
      }
      .br-r1 {
        border-right: 1px solid #424040;
      }
      html,
      body {
        width: 21cm;
        /* height: 14.85cm;
        29.7cm;*/
      }
      body {
        margin: 0;
        padding: 0;
        background-color: transparent;
        box-shadow: 0;
        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
      }
      body 
      {
        margin: 0 !important; 
        padding: 0 !important; 
        box-shadow: 0;
      }
      @page { 
        size: A5 landscape
        margin: 0;
        padding:0;
      } 
      .page-break{page-break-before:always;clear:both}
      .footer {break-after: always;}
      thead { display: table-header-group }
      tfoot { display: table-row-group }
      tr { page-break-inside: avoid }
      .invbold{font-weight: bold;text-transform: capitalize}
      .pclear{display:block;clear:both;margin:0;padding:0;margin-top:.9cm}
    } `;
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

  openPrintAudit() {
    this.config.data.invid = this.invdata.IVID;
    this.dialogRef = this.dialog.open(PrintAuditComponent, this.config);

    // this.dialogRef.beforeClose().subscribe((result: any) => {
    //   console.log(result);
    //   this.lastBeforeCloseResult = result;
    // });
    this.dialogRef.afterClosed().subscribe((result: any) => {
      this.lastAfterClosedResult = result;

      if (this.lastAfterClosedResult) {
        this.PrintType.cust = this.lastAfterClosedResult.isCusCopy;
        this.PrintType.shop = this.lastAfterClosedResult.IsShCopy;
        this.PrintType.comp = this.lastAfterClosedResult.isCmpCopy;
        this.updatePrintList(this.invdata.PrintCount++);
      }

      this.dialogRef = null;
    });
  }


  openCancelInvoice() {
    this.config.data.invid = this.invdata.IVID;
    this.canceldialogRef = this.dialog.open(InvoiceCancelComponent, this.config); 
    this.canceldialogRef.afterClosed().subscribe((result: any) => {
      this.lastAfterClosedResult = result;
      console.log(result);
      if (this.lastAfterClosedResult)
      { 
         this.ngOnInit(); 
      }
       
      this.canceldialogRef = null;
    });
  } 


}




