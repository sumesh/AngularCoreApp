import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { SliderComponent } from './slider/slider.component';
import { InputsComponent } from './inputs/inputs.component';
import { OtherComponent } from './other/other.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'autocomplete'
      },
      {
        path: 'autocomplete',
        component: AutoCompleteComponent,
        data: {   breadcrumb: 'Auto Complete' }
      },
      {
        path: 'datepicker',
        component: DatepickerComponent,
        data: {   breadcrumb: 'Datepicker' }
      },
      {
        path: 'checkbox',
        component: CheckboxComponent,
        data: {   breadcrumb: 'Checkbox' }
      },
      {
        path: 'slider',
        component: SliderComponent,
        data: {   breadcrumb: 'Slider' }
      },
      {
        path: 'inputs',
        component: InputsComponent,
        data: {   breadcrumb: 'Input' }
      },
      {
        path: 'other',
        component: OtherComponent,
        data: {   breadcrumb: 'Other' }
      },
      {
        path: '**',
        redirectTo: 'autocomplete'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule {}
