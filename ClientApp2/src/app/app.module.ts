import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule,  HTTP_INTERCEPTORS } from '@angular/common/http';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BidiModule } from '@angular/cdk/bidi';

import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import {
  MenuComponent,
  HeaderComponent,
  SidebarComponent,
  NotificationComponent,
  BreadcrumbComponent,
  OptionsComponent,
  AdminLayoutComponent,
  AuthLayoutComponent,
  AccordionAnchorDirective,
  AccordionLinkDirective,
  AccordionDirective
} from './core';
import { PrintAuditComponent } from './inventory/printaudit/printaudit.component';
import { InvoiceCancelComponent } from "./inventory/invoicecancel/invoicecancel.component";
import { CustomerSearchComponent  } from './inventory/customer/search/customersearch.component';
import { InvoiceImportSearchComponent  } from './inventory/importinvoice/search/invoiceimport.component';
//import { InlineEditComponent  } from './reports/stockcheck/inlinedit/inlineedit.component';


import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { HeaderInterceptor, JwtInterceptor } from './_helpers/index';

import { AuthGuard } from './_guard/index';
import { AlertComponent } from './_directive/index';
import { AlertService, AuthenticationService, InventoryService, LocalDataService,ExcelService } from './_services/index'; 
 
//import { HelloComponent } from './hello.component';

// export function createTranslateLoader(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    NotificationComponent,
    BreadcrumbComponent,
    OptionsComponent,
    MenuComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    AlertComponent,
   PrintAuditComponent,
   InvoiceCancelComponent,
   CustomerSearchComponent,
   InvoiceImportSearchComponent
   //InlineEditComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: (createTranslateLoader),
    //     deps: [HttpClient]
    //   }
    // }),
    LoadingBarRouterModule,
    MatSidenavModule,
    MatCardModule,
    MatMenuModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    MatListModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    FlexLayoutModule,
    BidiModule, 
    PerfectScrollbarModule,
    SatPopoverModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    AuthGuard,
    AlertService,
    AuthenticationService,
    InventoryService,
    LocalDataService,
    ExcelService,
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
     
  ],
  entryComponents: [
    PrintAuditComponent,
    InvoiceCancelComponent,
    CustomerSearchComponent ,
    InvoiceImportSearchComponent
    // InlineEditComponent
],
  bootstrap: [AppComponent]
})
export class AppModule { } 
