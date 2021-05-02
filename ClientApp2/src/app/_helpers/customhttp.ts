import { Injectable } from '@angular/core'
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from '../_guard/index'
import { appConfig } from '../app.config'
import { AlertService } from '../_services/alert.service'
import { LocalDataService } from '../_services/localdata.service'


export class HeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.startsWith('api')) {

      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const dummyrequest = req.clone({
        url: appConfig.apiUrl + req.url,
        setHeaders: {
          'Authorization': 'Bearer ' + (currentUser ? currentUser.Token : ''),
          'Content-Type': 'application/json; charset=utf-8'
        }
      });

      return next.handle(dummyrequest);
    }
    else {
      return next.handle(req);
    }
  }
}


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private sessiondata: LocalDataService,
    private alertService: AlertService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // tap(evt => { }),
      // map((event: HttpEvent<any>) => {
      //   if (event instanceof HttpResponse) {
      //     console.log('event--->>>', event);
      //     // this.errorDialogService.openDialog(event);
      //   }
      //   return event;
      // }),
      catchError((error: HttpErrorResponse) => {
        console.log('Error --->>>', error); 
       // if (error.error instanceof ErrorEvent) {
          
          //this.errorDialogService.openDialog(data);
          return throwError(error);
        
      })
      // catchError((err: any) => {
      //   console.log(err)
      //  // return throwError('');
      //   //return throwError("")
      //   //return of(err);
      //    return Observable.throw(err);
      // })
    );
    // return next.handle(request).do((event: HttpEvent<any>) => {
    //     if (event instanceof HttpResponse) {
    //         // do stuff with response if you want
    //     }
    // }, (err: any) => {
    //     return err;
    //     // if (err instanceof HttpErrorResponse) {
    //     //     if (err.status === 401) {
    //     //         // redirect to the login route
    //     //         // or show a modal
    //     //         console.log(err.status);
    //     //         localStorage.removeItem('currentUser');
    //     //         //this.authGuard.logout();
    //     //         // this.auth.canActivate(this.route, this.state);
    //     //        // this.alertService.error("No Access. Please login again");
    //     //     } 

    //     //     Observable.throw(err);
    //     // }
    // });
  }
}


// import { Injectable } from "@angular/core";
// import { ConnectionBackend, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Http, Headers } from "@angular/http";
// import { appConfig } from '../app.config';

// import { Observable } from "rxjs";
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/observable/throw';

// @Injectable()
// export class MyCustomHttp extends Http {
//     constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
//         super(backend, defaultOptions);
//     }

//     get(url: string, options?: RequestOptionsArgs): Observable<Response> {
//         return super.get(appConfig.apiUrl + url, this.addJwt(options)).catch(this.handleError);
//     }

//     post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
//         return super.post(appConfig.apiUrl + url, body, this.addJwt(options)).catch(this.handleError);
//     }

//     put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
//         return super.put(appConfig.apiUrl + url, body, this.addJwt(options)).catch(this.handleError);
//     }

//     delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
//         return super.delete(appConfig.apiUrl + url, this.addJwt(options)).catch(this.handleError);
//     }

//     // private helper methods

//     private addJwt(options?: RequestOptionsArgs): RequestOptionsArgs {
//         // ensure request options and headers are not null
//         options = options || new RequestOptions();
//         options.headers = options.headers || new Headers();

//         options.headers.append('Content-Type', 'application/json; charset=utf-8');

//         // add authorization header with jwt token
//         let currentUser = JSON.parse(localStorage.getItem('currentUser'));
//         console.log(currentUser);
//         if (currentUser && currentUser.Token) {
//             console.log(currentUser.Token);
//             options.headers.append('Authorization', 'Bearer ' + currentUser.Token);
//         }

//         return options;
//     }

//     private handleError(error: any) {
//         if (error.status === 401) {
//             // 401 unauthorized response so log user out of client
//             window.location.href = '/session/signin';
//             console.log(error);
//         }

//         return Observable.throw(error._body);
//     }
// }

// export function CustomHttp(xhrBackend: XHRBackend, requestOptions: RequestOptions): Http {
//     return new MyCustomHttp(xhrBackend, requestOptions);
// }

// export let customHttpProvider = {
//     provide: Http,
//     useFactory: CustomHttp,
//     deps: [XHRBackend, RequestOptions]
// };

// import {ConnectionBackend, Headers, Http, RequestOptions, RequestOptionsArgs, Response,XHRBackend} from '@angular/http';
// import {Observable} from 'rxjs'; 
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';
// import 'rxjs/add/observable/empty';
// import {Injectable} from '@angular/core';

// @Injectable()
// export class MyCustomHttp extends Http {
//   constructor(_backend: ConnectionBackend, _defaultOptions: RequestOptions ) {
//     super(_backend, _defaultOptions);
//   }
//   get(url: string, options?: RequestOptionsArgs): Observable<Response> {
//     // On every request, we will add the Authorization header
//     const enhacedOptions = this.setAuthorizationHeader(options);
//     return super.request(url, enhacedOptions)
//       .catch(this.catch401);
//   }
//   // Request Interceptor to append Authorization Header
//   private setAuthorizationHeader(options?: RequestOptionsArgs): RequestOptionsArgs {
//     if (!options) {
//       options = new RequestOptions();
//     }
//     if (!options.headers) {
//       options.headers = new Headers();
//     }
//     let currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     const token = 'Bearer ' + currentUser.Token;
//     // Make a copy of headers on the RequestOptions and append 'Authorization' token
//     const headers = {
//       ...options.headers.toJSON(),
//       Authorization: token,
//        ContentType: 'application/json; charset=utf-8'
//     };
//     options.headers = new Headers(headers);
//     return options;
//   }
//   // Response Interceptor
//   private catch401(error: Response): Observable<any> {
//     // Check if we had 401 response
//     if (error.status === 401) {
//       // redirect to Login page for example
//       return Observable.empty();
//     }
//     return Observable.throw(error);
//   }
// }


// // factory dependency injection
// export function providerCustomHttp(backend: XHRBackend, defaultOptions: RequestOptions) {
//     return new MyCustomHttp(backend, defaultOptions);
//   }