import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { map, startWith } from 'rxjs/operators';
import { AlertService, InventoryService, LocalDataService } from '../../_services/index';

@Component({
  moduleId: module.id,
  selector: 'app-jobitemlist',
  templateUrl: './jobitems.component.html',
  styleUrls: ['./jobitems.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JobItemsComponent implements OnInit {

  @Output() itemupdated: EventEmitter<any> = new EventEmitter();
  @Input("PageType") public currentPageType: string;
  @Input('group') public itemlistForm: FormGroup;
  @Input("DefaultValue") public currentPageDefaultValue: any;
  @Input("enablekfcess") public enableKFcess: boolean;
  @Input()
  public myCallback() {
    this.setDiscountBeforeTax();
  }

  stocklist: any;

  itemcode: FormControl;
  itemdatachange = 0;
  discountperchange = 0;
  discountchange = 0;
  filteredItem: any;

  constructor(private fb: FormBuilder,
    public sessiondata: LocalDataService) {

  }


  ngOnInit() {


    // this.myCallback = this.setDiscountBeforeTax;

    //Auto complete
    this.filteredItem = this.itemlistForm.get("itemcode").valueChanges
      .pipe(
        // .startWith(null)
        map(val => this.displayFn(val)),
        map(name => this.filterItem(name))
      );

    //Item select
    this.itemlistForm.get("itemcode").valueChanges.subscribe(val => {

      if (val && typeof val === 'object') {
        this.itemdatachange = 1;
        this.itemlistForm.patchValue(
          {
            itemname: val.Name,
            itemid: val.ItemID,
            tid: val.TID,
            qty: 1, // val.Qty,
            price: val.Price,
            uom: val.Ucode,
            discount: 0,//val.DiscPer,
            discountper: 0,//val.DiscPer,
            total: 0,
            gst: val.GST,
            sgst: val.SGST,
            cgst: val.CGST,
            kfcess: this.enableKFcess ? val.KFcess : 0,
            kfcess_back: val.KFcess,
            grossamt: 0,
            weight: 0,
            servicedesc: this.currentPageType == 'jobcard' ? 'Service' : '',
            mrp: val.MRP
          });
        if (val.jcitem) {
          this.itemlistForm.patchValue(
            {
              qty: val.Qty
            }
          );

          if (this.currentPageType != 'jobcard') {
            this.itemlistForm.get("price").disable();
          }
        }
        this.itemdatachange = 0;

        this.setItemData();
      }
    });

    this.itemlistForm.get("qty").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.setItemData();
      }
    });

    this.itemlistForm.get("price").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.setItemData();
      }
    });

    this.itemlistForm.get("discountper").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.discountperchange = 1;
        this.setItemData();
      }
    });

    this.itemlistForm.get("discount").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.discountchange = 1;
        this.setItemData();
      }
    });

    this.itemlistForm.get("gst").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.setItemData();
      }
    });

    this.itemlistForm.get("sgst").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.setItemData();
      }
    });

    this.itemlistForm.get("cgst").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.setItemData();
      }
    });

    this.itemlistForm.get("kfcess").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.setItemData();
      }
    });


    if (this.currentPageDefaultValue && typeof this.currentPageDefaultValue === 'object') {

      if (this.currentPageDefaultValue.jcitem) {
        this.itemlistForm.patchValue({
          itemcode: this.currentPageDefaultValue
        });

        if (this.currentPageType != 'jobcard') {
          this.itemlistForm.get("price").disable();
        } 
      }
    } 
  }


  ///
  displayFn(value: any): string {
    return value && typeof value === 'object' ? value.Code : value;
  }


  ///
  setItemData() {
    debugger;
    this.itemdatachange = this.itemdatachange + 1;
    if (this.itemdatachange == 1) {
      if (this.itemlistForm.valid) {
        this.itemlistForm.updateValueAndValidity();
        let obj = this.itemlistForm.getRawValue();

        obj.mrp = parseFloat((this.sessiondata.roundToTwo((obj.price) * obj.sgst / 100)
          + this.sessiondata.roundToTwo((obj.price) * obj.cgst / 100)
          + this.sessiondata.roundToTwo((obj.price) * obj.kfcess / 100)
          + this.sessiondata.roundToTwo(obj.price)).toFixed(2));

        if (this.discountperchange == 1) {
          if (!obj.discountper)
            obj.discountper = 0;
          obj.discount = parseFloat(((obj.qty * obj.price) * obj.discountper / 100).toFixed(2));
        }
        else if (this.discountchange == 1) {
          if (!obj.discount)
            obj.discount = 0;
          obj.discountper = parseFloat((obj.discount / (obj.qty * obj.price) * 100).toFixed(2));
        }

        obj.total = parseFloat(((obj.qty * obj.price) - obj.discount).toFixed(2));
        // obj.grossamt = parseFloat(((obj.total * obj.sgst / 100) + (obj.total * obj.cgst / 100)
        //   + (obj.total * obj.kfcess / 100) + parseFloat(obj.total)).toFixed(2));

        obj.grossamt = parseFloat((this.sessiondata.roundToTwo(obj.total * obj.sgst / 100)
          + this.sessiondata.roundToTwo(obj.total * obj.cgst / 100)
          + this.sessiondata.roundToTwo(obj.total * obj.kfcess / 100)
          + parseFloat(obj.total)).toFixed(2));

        this.itemlistForm.patchValue(
          {
            mrp: obj.mrp,
            discount: obj.discount,
            discountper: obj.discountper,
            total: parseFloat(obj.total),
            grossamt: parseFloat(obj.grossamt)
          }
        )

       // console.log(obj);
      }
      this.discountchange = 0;
      this.discountperchange = 0;
      this.itemdatachange = 0;
      this.itemupdated.emit(null);
    }
  }

  ///
  filterItem(val: string) {
    // console.log(this.stocklist);
    if (this.stocklist == null || this.stocklist == undefined) {
      this.stocklist = JSON.parse(localStorage.getItem(this.currentPageType + 'itemlist'))
    }

    if (val && this.stocklist) {
      const filterValue = val.toLowerCase();
      return this.stocklist.filter(item => item.Code.toLowerCase().startsWith(filterValue));
    }

    return this.stocklist;
  }

  /// val: number, type: string
  public setDiscountBeforeTax() {
    //console.log("Child Call back", this);
    // this.itemlistForm.patchValue({
    //   discountper: val,
    // })
    // this.discountperchange = 1;
    // this.setItemData();
  }
}

