import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkbookComponent } from './home/workbook.component';
import { BudgetComponent } from './budget/budget.component';
import { CostComponent } from './cost/cost.component';
import { ResourceComponent } from './resource/resource.component';

const routes: Routes = [
  {
    path: '',
    component: WorkbookComponent, 
    children: [
      {
        path: '',
        redirectTo: 'wbbudget'       
      }, 
      {
        path: 'wbbudget',
        component: BudgetComponent,
        data: {   breadcrumb: 'Budget' }
      },
      {
        path: 'wbcost',
        component: CostComponent,
        data: {   breadcrumb: 'Cost' }
      },
      {
        path: 'wbresourceplan',
        component: ResourceComponent,
        data: {   breadcrumb: 'Reource' }
      } ,
      {
        path: '**',
        redirectTo: 'wbbudget'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkbookRoutingModule {}
