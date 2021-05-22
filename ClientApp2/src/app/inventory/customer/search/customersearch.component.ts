import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatTableDataSource } from "@angular/material";
import { AlertService, InventoryService, LocalDataService } from '../../../_services/index';
import { map, startWith } from 'rxjs/operators';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-search-customer',
  templateUrl: './customersearch.component.html',
  styleUrls: ['./customersearch.component.scss']
})
export class CustomerSearchComponent implements OnInit {

  public fbcustsearch: FormGroup;

  public fbcustadd: FormGroup;
  customersaving: boolean = false;
  userAccess: any = {};
  rows: any = [];
  countryfilteredItem: any;
  statesfilteredItem: any;
  cityfilteredItem: any;

  lstcontries: any = [];
  lststates: any = [];
  lstCities: any = [];

  displayedColumns: string[] = ['name', 'address', 'email', 'phone', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  description: 'Customer Search';
  public showCustomerSearch: boolean = true;
  //   private dialogRef: MatDialogRef<CustomerSearchComponent>;
  //   @Inject(MAT_DIALOG_DATA)  data   {

  //   this.description = data.description;
  // }

  constructor(
    private fb: FormBuilder,
    private invservice: InventoryService,
    public sessiondata: LocalDataService,
    private message: AlertService,
    private dialogRef: MatDialogRef<CustomerSearchComponent>,
    @Inject(MAT_DIALOG_DATA) dialogdata: any) {
    this.description = dialogdata.description;
  }

  ngOnInit() {

    this.userAccess = this.sessiondata.getUserAccess("CUSTOMERSEARCH");
    this.fbcustsearch = this.fb.group({
      name: [''],
      phone: [''],
      email: [''],
      custno: ['']
    });

    this.fbcustadd = this.fb.group({
      fname: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      lname: [null, Validators.compose([Validators.minLength(1), Validators.maxLength(50)])],
      phone1: [null, Validators.compose([Validators.required, Validators.required, Validators.minLength(6), Validators.maxLength(25)])],
      phone2: [null, Validators.compose([Validators.minLength(6), Validators.maxLength(25)])],
      email1: [null, Validators.compose([CustomValidators.email])],
      email2: [null, Validators.compose([CustomValidators.email])],
      address: [null],
      postalcode: [null, Validators.compose([Validators.minLength(5)])],
      country: [null],
      countryid: [null],
      states: [null],
      stateid: [null],
      city: [null, Validators.required],
      cityid: [null],
      gst: [null],
    });

    this.ngOnChange();
  }

  ngOnChange() {

    //Auto complete
    this.countryfilteredItem = this.fbcustadd.get("country").valueChanges
      .pipe(
        // startWith<string | User>(''),
        map(value => this.country_displayFn(value)),
        map(name => this.country_filterItem(name))
      );//Auto complete

    // this.countryfilteredItem = this.fbcustadd.get("country").valueChanges
    //   // .startWith(null)
    //   .map(val => this.country_displayFn(val))
    //   .map(name => this.country_filterItem(name));

    //Item select
    this.fbcustadd.get("country").valueChanges.subscribe(val => {
      if (val && typeof val === 'object') {
        this.fbcustadd.patchValue(
          {
            countryid: val.CountryID
          });

        this.getStateData();
      }
    });

    //Auto complete
    this.statesfilteredItem = this.fbcustadd.get("states").valueChanges
      .pipe(
        // .startWith(null)
        map(value => this.state_displayFn(value))
        , map(name => this.state_filterItem(name))
      );
    //Item select
    this.fbcustadd.get("states").valueChanges.subscribe(val => {
      if (val && typeof val === 'object') {
        this.fbcustadd.patchValue(
          {
            stateid: val.StateID
          });

        this.getCityData();

      }
    });

    //Auto complete
    this.cityfilteredItem = this.fbcustadd.get("city").valueChanges.pipe(
      // .startWith(null)
      map(val => this.city_displayFn(val))
      , map(name => this.city_filterItem(name))
    );

    //Item select
    this.fbcustadd.get("city").valueChanges.subscribe(val => {
      if (val && typeof val === 'object') {
        this.fbcustadd.patchValue(
          {
            cityid: val.CityID
          });
      }
    });
  }

  showsearch(show: boolean) {
    //console.log(this.showCustomerSearch, show);
    this.showCustomerSearch = show;

    if (!this.showCustomerSearch) {
      this.getCountryData();
    }
  }
  getCustomerData() {
    if (this.fbcustsearch.valid) {
      this.invservice.InvoiceDataService('api/customer/search/', this.fbcustsearch.value)
        .subscribe(data => {
          if (data) {
            this.rows = data;
            this.dataSource.data = this.rows;
            this.dataSource.paginator = this.paginator;
          }
          else {

          }
        },
          err => {
            this.message.error("Error while communicating with server. Please try again");
            this.sessiondata.handleError(err);
          });
    }
  }

  getCountryData() {
    if (this.fbcustsearch.valid) {
      this.invservice.InvoiceDataService('api/customer/country/', {})
        .subscribe(data => {
          if (data) {
            this.lstcontries = data;
            if (this.lstcontries && this.lstcontries.length > 0) {
              this.fbcustadd.patchValue(
                {
                  country: this.lstcontries[0]
                });
            }
          }
        },
          err => {
            this.message.error("Error while communicating with server. Please try again");
            this.sessiondata.handleError(err);
          });
    }
  }

  getStateData() {
    if (this.fbcustsearch.valid) {
      this.invservice.InvoiceDataService('api/customer/states/', { CountryID: this.fbcustadd.get('countryid').value })
        .subscribe(data => {
          if (data) {
            this.lststates = data;
            if (this.lststates && this.lststates.length > 0) {
              this.fbcustadd.patchValue(
                {
                  states: this.lststates[0]
                });
            }
          }
        },
          err => {
            this.message.error("Error while communicating with server. Please try again");
            this.sessiondata.handleError(err);
          });
    }
  }

  getCityData() {
    if (this.fbcustsearch.valid) {
      this.invservice.InvoiceDataService('api/customer/cities/', { StateID: this.fbcustadd.get('stateid').value })
        .subscribe(data => {
          if (data) {
            this.lstCities = data;
            if (this.lstCities && this.lstCities.length > 0) {
              this.fbcustadd.patchValue(
                {
                  city: this.lstCities[0]
                });
            }
          }
        },
          err => {
            this.message.error("Error while communicating with server. Please try again");
            this.sessiondata.handleError(err);
          });
    }
  }

  ///
  country_displayFn(value: any): string {
    // console.log('display with ', value);
    return value && typeof value === 'object' ? value.CountryName : value;
  }

  state_displayFn(value: any): string {
    // console.log('display with ', value);
    return value && typeof value === 'object' ? value.StateName : value;
  }

  city_displayFn(value: any): string {
    // console.log('display with ', value);
    return value && typeof value === 'object' ? value.CityName : value;
  }

  ///
  country_filterItem(val: string) {

    var tmpacntlist: any;
    tmpacntlist = this.lstcontries;

    if (tmpacntlist) {
      const filterValue = val.toLowerCase();
      return tmpacntlist.filter(item =>
        //  item.TranID == this.salesform.get('vouchertype').value.VTID &&
        item.CountryName.toLowerCase().indexOf(filterValue) === 0);
    }

    return tmpacntlist;
  }

  ///
  state_filterItem(val: string) {

    var tmpacntlist: any;
    tmpacntlist = this.lststates;

    if (tmpacntlist) {
      const filterValue = val.toLowerCase();
      return tmpacntlist.filter(item =>
        item.CountryID == this.fbcustadd.get('countryid').value &&
        item.StateName.toLowerCase().indexOf(filterValue) === 0);
    }

    return tmpacntlist;
  }

  ///
  city_filterItem(val: string) {

    var tmpacntlist: any;
    tmpacntlist = this.lstCities;

    if (tmpacntlist) {
      const filterValue = val.toLowerCase();
      return tmpacntlist.filter(item =>
        item.StateID == this.fbcustadd.get('stateid').value &&
        item.CityName.toLowerCase().indexOf(filterValue) === 0);
    }

    return tmpacntlist;
  }

  redirectPage(page: string, obj: any) {
    if (page == "view") {
      obj['cusstate'] = obj['StateName'];
      this.dialogRef.close(obj);
    }
  }

  close() {
    this.dialogRef.close();
  }

  saveCustomerData() {
    this.fbcustadd.updateValueAndValidity();
    if (this.fbcustadd.valid && confirm("Please confirm.")) {
      this.customersaving = true;
      this.invservice.InvoiceDataService('api/customer/save/', this.fbcustadd.value)
        .subscribe(data => {
          this.customersaving = false;
          if (data) {
            console.log(data);
            data['Address'] = data['DAdrs'];
            data['cusstate'] = data['StateName'];
            this.dialogRef.close(data);
          }
          else {

          }
        },
          err => {
            this.message.error("Error while communicating with server. Please try again");
            this.sessiondata.handleError(err);
            this.customersaving = false;
          });
    }
  }
}
