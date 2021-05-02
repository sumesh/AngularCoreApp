import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { User, CommonData } from '../../_model/index'
import { AlertService, AuthenticationService, LocalDataService } from '../../_services/index';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  loading = false;
  returnUrl: string;
  public form: FormGroup;

  constructor(private fb: FormBuilder
    , private router: Router
    , private route: ActivatedRoute
    , private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private localDataService: LocalDataService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required])]
      , password: [null, Validators.compose([Validators.required])]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    this.loading = true;
    this.authenticationService.login(this.form.get('uname').value, this.form.get('password').value)
      .subscribe(data => {
        if (data) {
          let usrdata = JSON.parse(JSON.stringify(data));           
          this.localDataService.setSessionData(usrdata);
          if(usrdata.PasswordExpiry)
          {
            this.alertService.success('Login Success. Password Expired, Please update password.');
            this.router.navigate(['session/changepassword']);
          }
          else
          {
          // localStorage.setItem('currentUser', JSON.stringify(data));
          this.router.navigate([this.returnUrl]);
          }
        }
        else {
          this.alertService.error('Invalid user name/password');
        }
        //this.router.navigate(['/dashboard']);
      },
      err => {
        console.log(err);
        // this.alertService.error(err);
        this.alertService.error('Invalid user name/password');
        this.loading = false;
      });
    // if (this.authenticationService.login(this.form.get('uname').value, this.form.get('password').value)) {
    //   console.log('success');
    //   // this.router.navigate(['']);
    //    this.router.navigate([this.returnUrl]);
    // }
    // else {
    //   console.log('fail');
    //    this.alertService.error('Invalid user name/password');
    // }
    //this.router.navigate ( [ '/dashboard' ] );
  }

}
