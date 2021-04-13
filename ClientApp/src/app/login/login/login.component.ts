import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  loading = true;
  returnUrl?: string;
  error = '';
  isproxy = false;

  constructor(

    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }


  ngOnInit() {

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log(this.route.snapshot.queryParams['isproxy']);
    this.isproxy = this.route.snapshot.queryParams['isproxy'] || true;
    console.log(this.isproxy,this.route.snapshot.queryParams['isproxy']);
    this.onLogin();
  }


  onLogin() {
    //localStorage.setItem('isLoggedin', 'true');
    //this.router.navigate(['/dashboard']);
    // stop here if form is invalid

    this.authenticationService.login(this.isproxy ? "147852" : "369852")
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          if (data.isproxy) {
              //console.log('login page',data);
              this.router.navigate(["login/proxy"]);
          }
          else {
            //console.log('login page',data);
            this.router.navigate([this.returnUrl]);
          }
        },
        error => {
          console.log(error);
        });
  }
}
