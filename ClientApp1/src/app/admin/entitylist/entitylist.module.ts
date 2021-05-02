import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EntityListRoutingModule } from './entitylist-routing.module';
import { HomeComponent } from './home/home.component';
import { StatComponent } from './stat/stat.component';
import { GridComponent } from './grid/grid.component';
import { MatRadioModule } from '@angular/material/radio'; 
import { MatExpansionModule } from '@angular/material/expansion'; 
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule, 
    MatGridListModule,
    FlexLayoutModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule, 
    MatSelectModule,
    MatRadioModule,
    MatExpansionModule,
    MatCheckboxModule,
    EntityListRoutingModule, 
  ],
  declarations: [HomeComponent, StatComponent,GridComponent]
})
export class EntityListModule {}
