import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      //  console.log(localStorage.getItem('currentUser'),"canActivate");
        if (localStorage.getItem('currentUser')) {
            // logged in so return true 
            return true;
        }
        console.log("No Access");
        // not logged in so redirect to login page with the return url
        this.router.navigate(['session/signin'], { queryParams: { returnUrl: state.url } });
        return false;
    } 
}