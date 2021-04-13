export const childRoutes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    data: { icon: 'dashboard', text: 'Dashboard', breadcrumb: 'Dashboard' }
  }, 
  {
    path: 'plsummary',
    loadChildren: () =>
      import('./pandlsummary/pandlsummary.module').then(m => m.PLSummaryModule),
    data: { icon: 'account_balance', text: 'P&L Summary', breadcrumb: 'P&L Summary' }
  } ,
  {
    path: 'workbook',
    loadChildren: () =>
      import('./workbook/workbook.module').then(m => m.WorkbookModule),
    data: { icon: 'table_chart', text: 'Workbook', breadcrumb: 'Workbook' }
  },
  {
    path: 'forms',
    loadChildren: () => import('./forms/forms.module').then(m => m.FormsTemplateModule),
    data: { icon: 'assignment', text: 'Forms', breadcrumb: 'Forms' }
  },
  {
    path: 'mat-grid',
    loadChildren: () =>
      import('./mat-grid/mat-grid.module').then(m => m.MatGridModule),
    data: { icon: 'grid_on', text: 'Flex Grid', breadcrumb: 'Flex' }
  },
  {
    path: 'mat-components',
    loadChildren: () =>
      import('./mat-components/mat-components.module').then(
        m => m.MatComponentsModule
      ),
    data: { icon: 'code', text: 'Material Components', breadcrumb: 'Material' }
  } 
];
