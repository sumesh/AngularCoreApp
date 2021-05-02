import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-proxy',
  templateUrl: './proxy.component.html',
  styleUrls: ['./proxy.component.scss']
})
export class ProxyComponent implements OnInit {

  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl?: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      console.log(this.authenticationService.currentUserValue);
    //  this.router.navigate(['/']);
    }
  }


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(7)])]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onLogin() {
    //localStorage.setItem('isLoggedin', 'true');
    //this.router.navigate(['/dashboard']);
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.authenticationService.proxylogin(this.f.username.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log('login page',data);
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.router.navigate(["login/noaccess"]);
          console.log(error);
        });
  }
}
