import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Role, Roles, User } from '../_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    private currentUserRolesSubject: BehaviorSubject<Roles[]>;
    public currentUserRoles: Observable<Roles[]>;

    private activeRoleSubject: BehaviorSubject<Roles>;
    public activeRole: Observable<Roles>;

    constructor(private http: HttpClient) {

        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')||'{}'));
        this.currentUser = this.currentUserSubject.asObservable();

        this.currentUserRolesSubject = new BehaviorSubject<Roles[]>(JSON.parse(localStorage.getItem('roles')||'[]'));
        this.currentUserRoles = this.currentUserRolesSubject.asObservable();

        this.activeRoleSubject=new BehaviorSubject<Roles>({});
        this.activeRole=this.activeRoleSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get currentUserRolesValue(): Roles[] {
        return this.currentUserRolesSubject.value;
    }

    public get activeRoleValue(): Roles {
        return this.activeRoleSubject.value;
    }

    public   activeRolefromPage(obj:Roles ) {
        this.activeRoleSubject.next(obj);
    }

    login(username: string) {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response

                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    //localStorage.setItem('currentUser', JSON.stringify(user));
                    //this.currentUserSubject.next(user);
                }

                return user;
            }));
    }

    proxylogin(username: string) {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response

                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
    }

    roles() {
        return this.http.get<any>(`${environment.apiUrl}/users/roles`)
            .pipe(map(roles => {
                // login successful if there's a jwt token in the response 
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('roles', JSON.stringify(roles));
                this.currentUserRolesSubject.next(roles);
                this.activeRoleSubject.next(roles[0]);
                return roles;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('roles');
        this.currentUserSubject.next({});
        this.currentUserRolesSubject.next([]);
    }
}