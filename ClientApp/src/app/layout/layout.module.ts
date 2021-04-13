import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatProgressBarModule} from '@angular/material/progress-bar';



import { LayoutComponent } from './masterlayout/layout.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    //vendor
    SharedModule,

    //material
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatListModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDividerModule,
    MatCardModule,
    MatExpansionModule,
    MatCheckboxModule
  ],

  declarations: [
    LayoutComponent,
    TopNavComponent,
    SideNavComponent,
    BreadcrumbComponent]  
})
export class LayoutModuleModule { }
