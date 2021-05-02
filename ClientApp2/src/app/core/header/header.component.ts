import { Component, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as screenfull from 'screenfull';

import { AuthenticationService, LocalDataService } from '../../_services/index'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleNotificationSidenav = new EventEmitter<void>();

  PageHeader: string = "PARAKKAT";

  constructor(private router: Router, private authenticationService: AuthenticationService
    , private sessiondata: LocalDataService) {

    this.setPageHeader();

    this.sessiondata.globalOnchanges.subscribe(data => {

      this.setPageHeader();
    });

  }

  fullScreenToggle(): void {
    // if (screenfull.enabled) {
    //  screenfull.toggle();
    // }
  }

  changePassword(): void {
     
    this.router.navigate(['session/changepassword']);
  }
  singnOut(): void {
    this.authenticationService.logout();
    this.router.navigate(['session/signin']);
  }

  setPageHeader() {
    console.log("Page Head  Load");
    let masterdtls = this.sessiondata.getSessionData();
    this.PageHeader = masterdtls.BranchName;
  }
}
