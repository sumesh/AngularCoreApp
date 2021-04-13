import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
 
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';  
import { MatCheckboxModule } from '@angular/material/checkbox';

import { PanlSummaryRoutingModule } from './pandlsummary-routing.module';
import { HomeComponent } from './home/home.component';
import { StatComponent } from './stat/stat.component';
import { GridComponent } from './grid/grid.component';



@NgModule({
  imports: [
    SharedModule,
    
    MatGridListModule, 
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule, 
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule, 
    MatCheckboxModule,

    PanlSummaryRoutingModule, 
  ],
  declarations: [HomeComponent, StatComponent,GridComponent]
})
export class PLSummaryModule {}
