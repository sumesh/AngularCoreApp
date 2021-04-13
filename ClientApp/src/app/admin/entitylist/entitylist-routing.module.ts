import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 
 
 
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  } , 
  {
    path: 'acntworkbook',
    loadChildren: () =>
    import('../workbook/workbook.module').then(m => m.WorkbookModule), 
    data: { breadcrumb: 'Account Workbook' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityListRoutingModule { }
