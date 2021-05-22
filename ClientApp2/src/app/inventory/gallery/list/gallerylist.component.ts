import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MatPaginator, PageEvent } from "@angular/material";
import { AlertService, InventoryService, LocalDataService } from '../../../_services/index';

@Component({
  selector: 'app-gallerylist',
  templateUrl: './gallerylist.component.html',
  styleUrls: ['./gallerylist.component.scss']
})
export class GalleryListComponent implements OnInit {

  rowcount: number = 45;
  colcount: number = 3;
  categoryname: string = "";
  groupname: string = "";
  rcount: number = 0;
  printpages = [];
  public fblist: FormGroup;
  userAccess: any = {};
  rows: any = [];
  temp: any = [];
  categorylist = [];
  itemgrouplist = [];
  products: any = [];
  num = 1;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageIndex: number = 0;
  length = 100;
  pageSize = 20;


  constructor(
    private fb: FormBuilder,
    private invservice: InventoryService,
    public sessiondata: LocalDataService,
    private message: AlertService
  ) {

  }

  // MatPaginator Output
  pageEvent: PageEvent;



  onPaginateChange(event): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  //  console.log(this.pageIndex, this.pageSize, this.length);
    this.bindTable();
  }

  ngOnInit() {
    this.userAccess = this.sessiondata.getUserAccess("GALLERY");
    let d = new Date();

    this.fblist = this.fb.group({
      txtFilter: [""],
      itemgroup: ["ALL", Validators.compose([Validators.required])],
      categoryid: ["ALL", Validators.compose([Validators.required])],

    });
    this.getData();
    this.ngOnChange();



  }

  ngOnChange() {

    this.fblist.get("txtFilter").valueChanges.subscribe(item => {
      this.updateFilter();
    });

    this.fblist.get("itemgroup").valueChanges.subscribe(item => {
      this.updateFilter();
    });

    this.fblist.get("categoryid").valueChanges.subscribe(item => {
      this.updateFilter();
    });
  }
 

  updateFilter() {
    this.fblist.updateValueAndValidity();
    const val = this.fblist.get("txtFilter").value;//event.target.value.toLowerCase();
    const cid = this.fblist.get("categoryid").value;
    const grp = this.fblist.get("itemgroup").value;

    // filter our data
    const temp = this.temp.filter(function (d) {
      return ((cid == "ALL" || d.Brnd == cid)
        && (grp == "ALL" || d.Grp == grp)
        && (d.ItemCode.toLowerCase().indexOf(val.toLowerCase()) !== -1 || !val));
    });
    //console.log(temp);
    // update the rows
    this.pageIndex = 0;
    this.length = temp.length;
    this.rows = temp;
    this.bindTable();

  }

  getData() {

    // for (this.num; this.num <= 20; this.num += 1) {
    //   this.addProducts(this.num);
    // }





    // // console.log(this.fblist.value );
    // if (this.fblist.valid) {
    //   this.fblist.value.startdate = this.fblist.value.startdate.toLocaleString();
    this.invservice.InvoiceDataService('api/reports/gallerydata/', {})
      .subscribe(data => {
        if (data) {
          // push our inital complete list
          this.temp = data['TableData'].Table;
          // cache our list
          this.rows = [...this.temp];
          this.length = this.rows.length;
          this.pageIndex = 0;
          this.categorylist = this.uniqueBy("Brnd", this.rows);
          this.itemgrouplist = this.uniqueBy("Grp", this.rows);
          this.bindTable();
         // console.log(this.categorylist, this.itemgrouplist);
        }
        else {
          this.message.error("Error while communicating with server. Please try again");
        }

      },
        err => {
          this.message.error("Error while communicating with server. Please try again");
          this.sessiondata.handleError(err);
        });
  }

  bindTable() {
    const end = (this.pageIndex + 1) * this.pageSize;
    const start = this.pageIndex * this.pageSize;
    this.products = this.rows.slice(start, end);
  }


  uniqueBy(field, arr) {
    return arr.reduce((acc, curr) => {
      const exists = acc.find(v => v[field] === curr[field]);
      return exists ? acc : acc.concat(curr);
    }, [])
  }


  converttostring(obj: any) {
    return JSON.stringify(obj);
  }

  getURL(p) {
    return p;//+'&time='+ (new Date().toJSON());
  }

  onImgError(event) { 
    event.target.src = 'assets/images/imagenotfound.jpg';
}

}
