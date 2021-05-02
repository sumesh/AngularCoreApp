import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {CdkTableModule} from '@angular/cdk/table';
import { SatPopoverModule } from '@ncstate/sat-popover';
import {
  MatIconModule,
  MatAutocompleteModule,
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatToolbarModule,
  MatTabsModule,
  MatListModule,
  MatNativeDateModule,
  MatDatepickerModule,
  DateAdapter,
  MatSlideToggleModule,
  MatSelectModule,
  MatTooltipModule,
  MatTableModule,
  MatPaginatorModule
} from '@angular/material';
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
