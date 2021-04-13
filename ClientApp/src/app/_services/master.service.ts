import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Session, InputData } from '../_models';
import { AuthenticationService } from './authentication.service';


@Injectable({ providedIn: 'root' })
export class MasterDataService {

    //session data service
    private sessionSubject: BehaviorSubject<Session>;
    public commonSessionObjs: Observable<Session>;

    //serviceline list


    private subscriptionlist: Subscription[] = [];

    constructor(private http: HttpClient
        , private authenticationService: AuthenticationService) {
        this.sessionSubject = new BehaviorSubject<Session>({});
        this.commonSessionObjs = this.sessionSubject.asObservable();

        var subscription1: Subscription = this.authenticationService.activeRole.subscribe(r => {
            //console.log('master Service contructor Roles', r, this.authenticationService.activeRoleValue);
            this.setSessionValues();
        });

        var subscription2: Subscription = this.authenticationService.currentUser.subscribe(r => {
          //  console.log('master Service contructor user', r, this.authenticationService.currentUser);
            this.setSessionValues();
        });

        this.subscriptionlist.push(subscription1);
        this.subscriptionlist.push(subscription2);
    }

    public get commonSession(): Session {
        return this.sessionSubject.value;
    }

    private setSessionValues() {
        let cursession: Session = {
            Identity: this.authenticationService.currentUserValue,
            Role: this.authenticationService.activeRoleValue
        };

        this.sessionSubject.next(cursession);

    }



    getServicelines() {
        return this.http.get<any>(`${environment.apiUrl}/master/serviceline`)
            .pipe(map(servicelines => {
                // login successful if there's a jwt token in the response 
                // store user details and jwt token in local storage to keep user logged in between page refreshes 
                return servicelines;
            }));
    }

    getPandLSummary(obj: InputData) {
        return this.http.post<any>(`${environment.apiUrl}/pandl/summary`, obj)
            .pipe(map(ret => {
                // login successful if there's a jwt token in the response 
                // store user details and jwt token in local storage to keep user logged in between page refreshes 
                return ret;
            }));
    }

    getBucketType(obj: InputData) {
        return this.http.post<any>(`${environment.apiUrl}/master/buckettype`, obj)
            .pipe(map(ret => {
                // login successful if there's a jwt token in the response 
                // store user details and jwt token in local storage to keep user logged in between page refreshes 
                return ret;
            }));
    }

    getPandLgridmaster(obj: InputData) {
        return this.http.post<any>(`${environment.apiUrl}/pandl/gridmaster`, obj)
            .pipe(map(ret => {
                // login successful if there's a jwt token in the response 
                // store user details and jwt token in local storage to keep user logged in between page refreshes 
                return ret;
            }));
    }

    getPandLgridmasterV2(obj: InputData) {
        return this.http.post<any>(`${environment.apiUrl}/pandl2/gridmaster`, obj)
            .pipe(map(ret => {
                // login successful if there's a jwt token in the response 
                // store user details and jwt token in local storage to keep user logged in between page refreshes 
                return ret;
            }));
    }

    
    getPandLGridData(obj: InputData) {
        return this.http.post<any>(`${environment.apiUrl}/pandl/griddata`, obj)
            .pipe(map(ret => {
                // login successful if there's a jwt token in the response 
                // store user details and jwt token in local storage to keep user logged in between page refreshes 
                return ret;
            }));
    }

    
    getPandLGridDataV2(obj: InputData) {
        return this.http.post<any>(`${environment.apiUrl}/pandl2/griddata`, obj)
            .pipe(map(ret => {
                // login successful if there's a jwt token in the response 
                // store user details and jwt token in local storage to keep user logged in between page refreshes 
                return ret;
            }));
    }
}