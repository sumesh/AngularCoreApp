import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        
        if (currentUser && currentUser.token ) {
            // check if route is restricted by role
            // if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
            //     // role not authorised so redirect to home page
            //     this.router.navigate(['/']);
            //     return false;
            // }

            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(private router: Router) {}
//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean> | Promise<boolean> | boolean { 
//     if (localStorage.getItem('isLoggedin')) {
//       return true;
//     }

//     this.router.navigate(['/login']);
//     return false;
//   }
// }


@Injectable({
  providedIn: 'root'
})
export class AuthGuardChild implements CanActivateChild {
  constructor(private router: Router,
    private authenticationService: AuthenticationService) {}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
  
    const currentUser = this.authenticationService.currentUserValue;
   // console.log("auth child",currentUser,currentUser.token);
      if (currentUser && currentUser.token) {
        // check if route is restricted by role
        // if (next.data.roles && next.data.roles.indexOf(currentUser.role) === -1) {
        //     // role not authorised so redirect to home page
        //     this.router.navigate(['/']);
        //     return false;
        // }

        // authorised so return true
        return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
    // if (localStorage.getItem('isLoggedin')) {
    //   return true;
    // }

    // this.router.navigate(['/login']);
    // return false;
  }
}

 