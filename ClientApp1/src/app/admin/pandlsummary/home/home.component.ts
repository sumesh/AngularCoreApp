import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlSummary } from 'src/app/models';
import { GridBasicComponent } from 'src/app/shared/grid-basic/grid-basic.component';
import { InputData, MasterDropdown } from 'src/app/_models';
import { MasterDataService } from 'src/app/_services';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  summarylist: Array<PlSummary> = [];
  servicelineid: string = "0";
  subHzID: string = "0";
  gridinput: InputData = {};
  bucketlist: Array<MasterDropdown> = [];
  bucketTypeID: string = '';
  role?: string = '';
  lastupdated: Date = new Date();
  subscription1!: Subscription;

  @ViewChild(GridBasicComponent) gridcomponent!: GridBasicComponent;

  constructor(private sessionservice: MasterDataService) {
    this.subscription1 = this.sessionservice.commonSessionObjs.subscribe(r => {
      //console.log('contructor', r, this.sessionservice.commonSession);
      this.getRole();
    });
  }

  getRole() {
    this.role = this.sessionservice.commonSession.Role?.rolename;
    this.lastupdated = new Date();

  }

  onServicelineChanged(sid: any) {
    console.log("PNL onServicelineChanged ", sid);
    this.servicelineid = sid;
    this.updateGridInput(false);

  }

  onddlBucketTypeChanged(val: string) {
    console.log("PNL onddlBucketTypeChanged ", val);
    this.updateGridInput(false);
  }

  ngOnDestroy(): void {
    this.subscription1.unsubscribe();
  }

  ngOnInit() {
    this.bindData();
  }

  updateGridInput(onload: boolean) {
    this.gridinput.buckettype = this.bucketTypeID;
    this.gridinput.horzid = this.servicelineid;
    this.gridinput.subhorzid = this.subHzID;
    if (onload) {
      this.gridcomponent.bindGrid();
    }
    else {
      this.gridcomponent.bindData('parent');
    }

  }

  bindData() {
    this.sessionservice.getBucketType({ horzid: this.servicelineid }).subscribe(s => {
      this.bucketlist = s;
      if (this.bucketlist && this.bucketlist.length > 0) {
        this.bucketTypeID = this.bucketlist.find(f => f.isdefault == true)?.id || '';
      }

      this.updateGridInput(true);
    });

    this.sessionservice.getPandLSummary({ horzid: this.servicelineid }).subscribe(s => {
      this.summarylist = s;
    });
  }
}
