import { NgModule } from '@angular/core';
 
 
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './home/home.component';
import { StatComponent } from './stat/stat.component';
import { GridComponent } from './grid/grid.component';



@NgModule({
  imports: [
    
    SharedModule,
    
    //Material
    MatGridListModule, 
    MatCardModule,
  
    MatTableModule,
    MatButtonModule,
    MatIconModule, 
    MatSelectModule,
    MatRadioModule,
    DashboardRoutingModule
  ],
  declarations: [HomeComponent, StatComponent,GridComponent]
})
export class DashboardModule {}
