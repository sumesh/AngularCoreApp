import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { Roles } from 'src/app/_models';
import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  // @ViewChild('sidemenu') snav: MatSidenav;;
  // @ViewChild('sidemenu') snavright: MatSidenav;;
  roles!:Roles[];
  selectedRole!:Roles;
  roleid!:string;
  roletype!:string;
  roleservicelineval='8';

  sideNavOpened = true;
  rightsideNavOpened=false;
  sideNavMode: MatDrawerMode = 'over';
  toolBarHeight = 64;
  buckettypeval='ML';
  servicelineval='0';
  searchfilterval='All';
 
  private readonly mediaWatcher: Subscription;
  constructor(media: MediaObserver,
    private authenticationService: AuthenticationService) {
    this.mediaWatcher = media.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'sm' || change.mqAlias === 'xs') {
        if (this.sideNavOpened) {
          this.sideNavOpened = false;
          this.rightsideNavOpened=false;
        }
        this.sideNavMode = 'over';
      } else {
        this.sideNavOpened = false;
        this.rightsideNavOpened=false;
        this.sideNavMode = 'over';
      }
      if (change.mqAlias === 'xs') {
        this.toolBarHeight = 56;
      } else {
        this.toolBarHeight = 64;
      }
    });
  }
  ngOnInit() { 

    this.getRoles();
  }

  ngOnDestroy(): void {
    this.mediaWatcher.unsubscribe();
  }

  ddlChangeEvenet()
  {
   // console.log('Layout Dropdown event',this.roleid);
    this.selectedRole = this.roles.find(x => x.roleid === this.roleid)||{};
    this.authenticationService.activeRolefromPage(this.selectedRole);
  }

  getRoles()
  {
    this.authenticationService.roles().subscribe(roles => {       
    this.roles = roles;
    this.selectedRole=this.roles[0];
    this.roleid=this.selectedRole.roleid||'';
  });
  }

  setRole(r:Roles )
  {
    //console.log("layout setroles",r);
    this.authenticationService.activeRolefromPage(r);
  }
}
