import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {CdkTableModule} from '@angular/cdk/table';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';


import { ReportsRoutes } from './reports.routing';
import { StockReportComponent } from './stock/stock.component';
import { StockByDateReportComponent } from './stockbydate/stockbydate.component';
import { DailyStatementReportComponent } from './dailystatement/dailystatement.component';
import { StockmovementReportComponent } from './stockmovement/stockmovement.component';
import { ReportMasterComponent } from './reportmaster/reportmaster.component';
import { StockCheckByDateReportComponent } from './stockcheck/stockcheckbydate.component';
import { InlineEditComponent  } from './stockcheck/inlinedit/inlineedit.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  //suppressScrollX: true
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ReportsRoutes),
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    MatListModule,
    MatSlideToggleModule,
    MatSelectModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTooltipModule,
    CdkTableModule,
    MatPaginatorModule,
    PerfectScrollbarModule,
    SatPopoverModule 
  ],
  declarations: [
    StockReportComponent,
    StockByDateReportComponent,
    DailyStatementReportComponent,
    StockmovementReportComponent,
    ReportMasterComponent,
    StockCheckByDateReportComponent,
    InlineEditComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})

export class ReportsModule { }
