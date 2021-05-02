import { Component,OnInit } from '@angular/core';
import { AlertService, InventoryService, LocalDataService } from '../../../_services/index';
@Component({
  selector: 'app-sale-invoice',
  templateUrl: './saleinvoice.component.html',
  styleUrls: ['./saleinvoice.component.scss']
})
export class SaleInvoiceComponent implements OnInit{ 
  
  lstInvoiceType: any = [
    { "TypeD": "SALE", "InvoiceType": "Sale", URL: "sale/sales/view" },
  { "TypeD": "SALEORDER", "InvoiceType": "Sale Order", URL: "sale/salesorder/view" },
  { "TypeD": "SALERETURN", "InvoiceType": "Sale Return", URL: "sale/salesreturn/view" },
  { "TypeD": "PURCHASE", "InvoiceType": "Purchase", URL: "purchase/purchase/view" },
  { "TypeD": "PURCHASERETURN", "InvoiceType": "Purchase Return", URL: "purchase/purchasereturn/view" },
  { "TypeD": "JOBCARD", "InvoiceType": "Job Card", URL: "service/jobcard/view" },
  { "TypeD": "SERVICE", "InvoiceType": "Service", URL: "service/service/view" },
  { "TypeD": "DELIVERYIN", "InvoiceType": "Delivery In", URL: "delivery/deliveryin/view" },
  { "TypeD": "DELIVERYOUT", "InvoiceType": "Delivery Out", URL: "delivery/deliveryout/view" },
  { "TypeD": "DASHBOARD", "InvoiceType": "Dashboard", URL: "/" }];

  constructor( 
    public sessiondata: LocalDataService)
    {}

    ngOnInit() {
      let q: any = this.sessiondata.getQueryStringValue(['page','print', 'id']);

      var objurl = this.lstInvoiceType.filter(item =>
        item.TypeD == q.page)
        this.sessiondata.redirect(objurl[0].URL, {  print: false, id: q.id });
       
    }
}
