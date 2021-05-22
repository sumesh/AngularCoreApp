import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
//import { TreeModule } from 'angular-tree-component';
//import { NgxDatatableModule } from 'ngx-datatable';
import { FlexLayoutModule } from '@angular/flex-layout';

import { InventoryRoutes } from './inventory.routing';

import { SalesComponent } from './sales/save/sales.component';
import { SaleListComponent } from './sales/list/salelist.component';
import { SaleViewComponent } from './sales/view/saleview.component';

import { SaleReturnComponent } from './salesreturn/save/salereturn.component'
import { SaleReturnListComponent } from './salesreturn/list/salereturnlist.component'
import { SaleReturnViewComponent } from './salesreturn/view/salereturnview.component'

import { SaleOrderComponent } from './salesorder/save/saleorder.component';
import { SaleOrderListComponent } from './salesorder/list/saleorderlist.component';
import { SaleOrderViewComponent } from './salesorder/view/saleorderview.component';

import { PurchaseComponent } from './purchase/save/purchase.component';
import { PurchaseListComponent } from './purchase/list/purchaselist.component';
import { PurchaseViewComponent } from './purchase/view/purchaseview.component';

import { PurchaseReturnComponent } from './purchasereturn/save/purchasereturn.component';
import { PurchaseReturnListComponent } from './purchasereturn/list/purchasereturnlist.component';
import { PurchaseReturnViewComponent } from './purchasereturn/view/purchasereturnview.component';


import { ItemListComponent } from './itemlist/itemlist.component';
import { JobItemsComponent } from './jobitems/jobitems.component';

import { JobCardViewComponent } from './jobcard/view/jobcardview.component';
import { JobCardComponent } from './jobcard/save/jobcard.component';
import { JobCardListComponent } from './jobcard/list/jobcardlist.component';

import { ServiceComponent } from './service/save/service.component';
import { ServiceListComponent } from './service/list/servicelist.component';
import { ServiceViewComponent } from './service/view/serviceview.component';

import { DeliveryOutViewComponent } from './deliveryout/view/deliveryoutview.component';
import { DeliveryOutComponent } from './deliveryout/save/deliveryout.component';
import { DeliveryOutListComponent } from './deliveryout/list/deliveryoutlist.component';

import { DeliveryInViewComponent } from './deliveryin/view/deliveryinview.component';
import { DeliveryInComponent } from './deliveryin/save/deliveryin.component';
import { DeliveryInListComponent } from './deliveryin/list/deliveryinlist.component';

import { SaleInvoiceComponent } from './invoice/sales/saleinvoice.component';
import { GalleryListComponent } from './gallery/list/gallerylist.component';



import { ExpenseViewComponent } from './expense/view/expenseview.component';
import { ExpenseComponent } from './expense/save/expense.component';
import { ExpenseListComponent } from './expense/list/expenselist.component';
//import { CustomerSearchComponent  } from './customer/search/customersearch.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(InventoryRoutes),
    MatNativeDateModule,
    MatAutocompleteModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatSelectModule,
    MatTooltipModule,
    FlexLayoutModule,
    // NgxDatatableModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSidenavModule
  ],
  declarations: [
    SalesComponent,
    SaleListComponent,
    SaleViewComponent,
    SaleReturnComponent,
    SaleReturnListComponent,
    SaleReturnViewComponent,

    SaleOrderComponent,
    SaleOrderViewComponent,
    SaleOrderListComponent,
    ItemListComponent,
    JobItemsComponent,

    PurchaseComponent,
    PurchaseListComponent,
    PurchaseViewComponent,
    PurchaseReturnComponent,
    PurchaseReturnListComponent,
    PurchaseReturnViewComponent,

    JobCardComponent,
    JobCardViewComponent,
    JobCardListComponent,
    SaleInvoiceComponent,

    ServiceComponent,
    ServiceListComponent,
    ServiceViewComponent,

    DeliveryOutComponent,
    DeliveryOutListComponent,
    DeliveryOutViewComponent,

    DeliveryInComponent,
    DeliveryInListComponent,
    DeliveryInViewComponent,

    ExpenseComponent,
    ExpenseListComponent,
    ExpenseViewComponent   ,

    GalleryListComponent
  ],
})

export class InventoryModule { }
