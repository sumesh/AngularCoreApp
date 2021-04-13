import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardChild } from '../_helpers/auth.guard';
import { LayoutComponent } from '../layout/masterlayout/layout.component';
 
import { childRoutes } from './child-routes';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [AuthGuardChild],
    children: [
      {
        path: '',
        redirectTo: 'dashboard'
      },
      ...childRoutes
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
