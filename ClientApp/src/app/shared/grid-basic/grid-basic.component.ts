import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GridFilterType, InputData } from 'src/app/_models';
import { MasterDataService } from 'src/app/_services';

@Component({
  selector: 'app-grid-basic',
  templateUrl: './grid-basic.component.html',
  styleUrls: ['./grid-basic.component.scss']
})
export class GridBasicComponent implements OnInit {


  @Input() gridFilter!: GridFilterType[];
  @Input() gridinput!:InputData;
   


  gridMaster: any = {};
  gridData: any = {};

  //ddlPeriodval="";
  //ddlyearVal="";  
  //rdFxVal=""
  //rdCurval:number=1000; 
  fbGridSearch!: FormGroup;
  gridloading: boolean = false;
  filterDtls: any;
  displaycurrency: number = 1000;
  displaymonths: number = 6;
  minpriod = 1;
  maxperiod = 12;
  startperiod = 1;
  endperiod = 6;


  constructor(private fb: FormBuilder,
    private sessionservice: MasterDataService) {

  }

  ngOnInit() {
    console.log('OnInit Grid');

    this.fbGridSearch = this.fb.group({
      ddlGridFilter: ['', Validators.required],
      ddlGridYear: ['', Validators.required],
      rdgfx: ['', Validators.required],
      rdgCurrency: ['', Validators.required]
    });


    //
     this.ngOnChangesEvents();
   // this.updateLoading();
  }


  ngOnChangesEvents() {
    
    this.fbGridSearch.get("ddlGridFilter")!.valueChanges.subscribe(val => {
      
      if (!this.gridloading && val) { 
        this.displaymonths=val.maxmonth;
        this.startperiod=1;
        this.endperiod=val.maxmonth;
        this.bindData("gridfilter");
      }
    });

    this.fbGridSearch.get("ddlGridYear")!.valueChanges.subscribe(val => {
      if (!this.gridloading && val) {
        this.bindData("year");
      }
    });

    this.fbGridSearch.get("rdgfx")!.valueChanges.subscribe(val => {
      if (!this.gridloading &&  val) {
        this.bindData("rdgfx");
      }
    });

    this.fbGridSearch.get("rdgCurrency")!.valueChanges.subscribe(val => {
      if (!this.gridloading &&  val) {
        this.displaycurrency = val;
      }
    });

  }

  get f() { return this.fbGridSearch }

  get filterValue() {
    this.fbGridSearch.updateValueAndValidity();
    return this.fbGridSearch.value;
  }

  bindGrid()
  {
    console.log('grid',this.gridinput);
    this.bindMaster();
  }


  bindMaster() {
    this.gridloading=true;
    this.sessionservice.getPandLgridmasterV2({ horzid: '0' }).subscribe(s => {

      this.gridMaster = s;
  
      if (this.gridMaster) {
        this.fbGridSearch.patchValue({
          ddlGridFilter: this.gridMaster.filtertype.find((r: any) => r.typeid == this.gridMaster.default.filterType),
          ddlGridYear: this.gridMaster.default.year,
          rdgfx: this.gridMaster.default.fx,
          rdgCurrency: this.gridMaster.default.dol
        });
      }
       
      this.gridloading = false;
      
      let obj = this.filterValue;
      this.displaymonths = obj.ddlGridFilter.maxmonth;
      this.bindData('First');

    });
  }

  bindData(event: string) {
   
    if (this.fbGridSearch.valid) {
      let obj = this.filterValue;
      // obj.rdgCurrency 
      //obj.rdgfx  
      this.gridloading = true;
      this.sessionservice.getPandLGridDataV2({ horzid: '0', filterType: obj.ddlGridFilter.typeid, year: obj.ddlGridYear }).subscribe(s => {
        this.gridData = s; 
        this.setColumnsMonths(); 
        this.gridloading = false;
      });
    }
  }

  updateLoading() {
    setTimeout((r: any) => {
      this.gridloading = false;
    }, 1500);
  }

  nextPeriod() {
    this.gridloading = true;
    if (this.endperiod < this.maxperiod) {
      this.startperiod = this.startperiod + this.displaymonths + 1;
      this.endperiod = this.startperiod + this.displaymonths;
    }

    if (this.endperiod > this.maxperiod) {
      this.startperiod = this.maxperiod - this.displaymonths + 1;
      this.endperiod = this.maxperiod;
    }   

    this.setColumnsMonths();
    
    this.updateLoading()
  }

  prevPeriod() {
    this.gridloading = true;
    if (this.startperiod > this.minpriod) {
      this.startperiod = this.startperiod - this.displaymonths;
      this.endperiod = this.startperiod + this.displaymonths - 1;
    }

    if (this.startperiod < this.minpriod) {
      this.startperiod = this.minpriod;
      this.endperiod = this.minpriod + this.displaymonths;
    }

    this.setColumnsMonths();

   
    this.updateLoading();
  }

  setColumnsMonths()
  {
    this.gridData.header = this.gridData.header.map((i: any) => { 
      if (i.type == 'M' && i.rw >= this.startperiod && i.rw <= this.endperiod) {        
        i.show = true;
      }
      else if (i.type == 'M') { 
        i.show = false
      }
      else 
      {
        i.show = true;
      }
      return i; 
    });
  }

   

  getTableData(descid: number, periodid: number, prop: string) {
    var obj = this.gridData.data.find((f: any) => f.DescID == descid)?.Data.find((r: any) => r.PeriodID == periodid);  
    if (obj && obj[prop]) { 
      return obj[prop];
    }
    else {
      return 0;
    }


  }


}
