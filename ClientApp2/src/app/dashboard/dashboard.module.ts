import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  MatIconModule, 
  MatCardModule, 
  MatButtonModule,
  MatListModule, 
  MatProgressBarModule, 
  MatMenuModule,
  MatTableModule,
  MatPaginatorModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout'; 
import { ChartsModule } from 'ng2-charts';
//import { NgxDatatableModule } from 'ngx-datatable';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatProgressBarModule,
    MatMenuModule,
    ChartsModule,
    //NgxDatatableModule,
    FlexLayoutModule,
     MatTableModule,
    MatPaginatorModule
  ],
  declarations: [ DashboardComponent ]
})

export class DashboardModule {}
