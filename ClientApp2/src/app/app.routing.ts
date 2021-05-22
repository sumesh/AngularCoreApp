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
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },   {
    path: 'sale',
    canActivate: [AuthGuard],
    loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
    data: {
      breadcrumb: 'Sale'
    }
  },{
    path: 'purchase',
    canActivate: [AuthGuard],
    loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
    data: {
      breadcrumb: 'Purchase'
    }
  },{
    path: 'purchasereturn',
    canActivate: [AuthGuard],
    loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
    data: {
      breadcrumb: 'Purchase Return'
    }
  }, {
    path: 'service',
    canActivate: [AuthGuard],
    loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
    data: {
      breadcrumb: 'Service'
    }
  }, {
    path: 'delivery',
    canActivate: [AuthGuard],
    loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
    data: {
      breadcrumb: 'Delivery'
    }
  },
  {
    path: 'reports',
    canActivate: [AuthGuard],
    loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
    data: {
      breadcrumb: 'Reports'
    }
  }
  , {
    path: 'accounts',
    canActivate: [AuthGuard],
    loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
    data: {
      breadcrumb: 'Accounts'
    }
  } , {
    path: 'products',
    canActivate: [AuthGuard],
    loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
    data: {
      breadcrumb: 'Products'
    }
  }
  , {
    path: 'invoice',
    canActivate: [AuthGuard],
    loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
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
      loadChildren: () => import('./session/session.module').then(m => m.SessionModule)
    }]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [AuthGuard],
    children: [{
      path: 'changepassword',
      loadChildren: () => import('./session/session.module').then(m => m.SessionModule)
    }]
  },
  {
    path: '**',
    redirectTo: 'session/404'

  }];
