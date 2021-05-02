import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { WorkbookRoutingModule } from './workbook-routing.module';
import { WorkbookComponent } from './home/workbook.component';
import { BudgetComponent } from './budget/budget.component';
import { CostComponent } from './cost/cost.component';
import { ResourceComponent } from './resource/resource.component';
import { GridComponent } from './grid/grid.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CODComponent } from './cod/cod.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PPMComponent } from './ppm/ppm.component';
 

@NgModule({
  imports: [
    SharedModule,
    WorkbookRoutingModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatTabsModule, 
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    MatToolbarModule 
  ],
  declarations: [
    WorkbookComponent,
    BudgetComponent,
    CostComponent,
    ResourceComponent,
    GridComponent ,
    CODComponent,
    PPMComponent
  ] 
})
export class WorkbookModule {}
