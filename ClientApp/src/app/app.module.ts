import { BrowserModule } from '@angular/platform-browser';
import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ErrorInterceptor, JwtInterceptor } from './_helpers';
import { fakeBackendProvider } from './_helpers/fake-backend';



@NgModule({
  declarations: [AppComponent],
  imports: [
   // BrowserModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'USD' },
    // provider used to create fake backend
    fakeBackendProvider

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
