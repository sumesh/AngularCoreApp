import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { NoAccessComponent } from './noaccess/noaccess.component';
import { ProxyComponent } from './proxy/proxy.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children:[
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'proxy',
        component: ProxyComponent
      },
      {
        path: 'noaccess',
        component: NoAccessComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
