import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'allaccounts',
    loadChildren: () =>
    import('../entitylist/entitylist.module').then(m => m.EntityListModule), 
    data: { breadcrumb: 'My Accounts' }    
  },
  {
    path: 'pnlworkbook',
    loadChildren: () =>
    import('../workbook/workbook.module').then(m => m.WorkbookModule), 
    data: { breadcrumb: 'P&L Workbook' }
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanlSummaryRoutingModule { }
