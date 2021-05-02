import { Routes } from '@angular/router';

import { StockReportComponent } from './stock/stock.component';

import { StockByDateReportComponent } from './stockbydate/stockbydate.component';

import { DailyStatementReportComponent } from './dailystatement/dailystatement.component';

import { StockmovementReportComponent } from './stockmovement/stockmovement.component';

import { ReportMasterComponent } from './reportmaster/reportmaster.component';

import { StockCheckByDateReportComponent } from './stockcheck/stockcheckbydate.component';

export const ReportsRoutes: Routes = [
  {     
      path: '',
      //component: PurchaseComponent,
      data: {
        breadcrumb: 'Reports'
      },
      children: [{
        path: 'stock',
        component: StockReportComponent,
        data: {
          breadcrumb: 'Stock'
        }
      },{
        path: 'stockbydate',
        component: StockByDateReportComponent,
        data: {
          breadcrumb: 'Stock By Date'
        }
      }, {
        path: 'dailystatement',
        component: DailyStatementReportComponent,
        data: {
          breadcrumb: 'Daily Statement'
        }
      }, {
        path: 'stockmovement',
        component: StockmovementReportComponent,
        data: {
          breadcrumb: 'Stock Movement'
        }
      }, {
        path: 'reportmaster',
        component: ReportMasterComponent,
        data: {
          breadcrumb: 'Report Master'
        }
      },{
        path: 'stockcheck',
        component: StockCheckByDateReportComponent,
        data: {
          breadcrumb: 'Stock Check'
        }
      }
      
    ] 
  }
];
