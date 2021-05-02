import { Routes } from '@angular/router';

import { AdminLayoutComponent, AuthLayoutComponent } from './core';
import { AuthGuard } from './_guard/index';

export const AppRoutes: Routes = [
  {
  path: '',
  component: AdminLayoutComponent,
  canActivate: [AuthGuard],
  data: {
  },
  children: [{
    path: '',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },   {
    path: 'sale',
    canActivate: [AuthGuard],
    loadChildren: './inventory/inventory.module#InventoryModule',
    data: {
      breadcrumb: 'Sale'
    }
  },{
    path: 'purchase',
    canActivate: [AuthGuard],
    loadChildren: './inventory/inventory.module#InventoryModule',
    data: {
      breadcrumb: 'Purchase'
    }
  },{
    path: 'purchasereturn',
    canActivate: [AuthGuard],
    loadChildren: './inventory/inventory.module#InventoryModule',
    data: {
      breadcrumb: 'Purchase Return'
    }
  }, {
    path: 'service',
    canActivate: [AuthGuard],
    loadChildren: './inventory/inventory.module#InventoryModule',
    data: {
      breadcrumb: 'Service'
    }
  }, {
    path: 'delivery',
    canActivate: [AuthGuard],
    loadChildren: './inventory/inventory.module#InventoryModule',
    data: {
      breadcrumb: 'Delivery'
    }
  },
  {
    path: 'reports',
    canActivate: [AuthGuard],
    loadChildren: './reports/reports.module#ReportsModule',
    data: {
      breadcrumb: 'Reports'
    }
  }
  , {
    path: 'accounts',
    canActivate: [AuthGuard],
    loadChildren: './inventory/inventory.module#InventoryModule',
    data: {
      breadcrumb: 'Accounts'
    }
  } , {
    path: 'products',
    canActivate: [AuthGuard],
    loadChildren: './inventory/inventory.module#InventoryModule',
    data: {
      breadcrumb: 'Products'
    }
  }
  , {
    path: 'invoice',
    canActivate: [AuthGuard],
    loadChildren: './inventory/inventory.module#InventoryModule',
    data: {
      breadcrumb: 'Invoice'
    }
  } 
]}, 
     {
    path: '',
    component: AuthLayoutComponent,
    children: [{
      path: 'session',
      loadChildren: './session/session.module#SessionModule'
    }]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [AuthGuard],
    children: [{
      path: 'changepassword',
      loadChildren: './session/session.module#SessionModule'
    }]
  },
  {
    path: '**',
    redirectTo: 'session/404'

  }];
