import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { User, CommonData } from '../../_model/index'
import { AlertService, AuthenticationService, LocalDataService } from '../../_services/index';
import { ErrorStateMatcher } from '@angular/material';



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  loading = false;
  returnUrl: string;
  public form: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder
    , private router: Router
    , private route: ActivatedRoute
    , private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private localDataService: LocalDataService
  ) { }


  ngOnInit() {
    this.form = this.fb.group({
      currentpassword: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@#$!%*?&])[A-Za-z\d$@#$!%*?&].{6,}$')])]
      , cpassword: [null, Validators.compose([Validators.required])]
    }, { validator: this.checkPasswords });



    // get return url from route parameters or default to '/'
    this.returnUrl = '/';
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('password').value;
    let confirmPass = group.get('cpassword').value;

    return pass === confirmPass ? null : { notSame: true }
  }

  onSubmit() {
    this.loading = true;
    this.authenticationService.changepassword(this.form.get('currentpassword').value , this.form.get('password').value)
      .subscribe(data => {
        if (data) {
          if (data['IsSuccess']) {
            this.alertService.success("Password updated.");
            this.router.navigate([this.returnUrl]);
          }
          else {
            this.alertService.error(data['Message'] + " Please try again");
            this.loading = false;
          }
        }
        else {
          this.alertService.error("Error while communicating with server. Please try again");
        }
      },
        err => {
          this.alertService.error('Error while communicating with server. Please try again.');
          this.loading = false;
        });

  }

}

