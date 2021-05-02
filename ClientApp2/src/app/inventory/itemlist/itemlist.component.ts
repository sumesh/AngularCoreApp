import {
  Component, OnInit, Input, Output, EventEmitter,
  ViewEncapsulation, ViewChild, ElementRef, AfterViewInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { CustomValidators } from 'ng2-validation';
import { AlertService, InventoryService, LocalDataService } from '../../_services/index';

@Component({
  moduleId: module.id,
  selector: 'app-itemlist',
  templateUrl: './itemlist.component.html',
  styleUrls: ['./itemlist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemListComponent implements OnInit, AfterViewInit {

  @Output() itemupdated: EventEmitter<any> = new EventEmitter();
  @Input("PageType") public currentPageType: string;
  @Input("ItemBrand") public itemBrand: string;
  @Input('group') public itemlistForm: FormGroup;
  @Input('enablekfcess') public enableKFcess: boolean;
  @Input('enableIgst') public enableIgst: boolean;
  @Input('enableTax') public enableTax: boolean;
  @ViewChild('inputitemcode') inputitemcode: ElementRef;
  @Input("DefaultValue") public currentPageDefaultValue: any;
  @Input()
  public myCallback() {
    //console.log('Parent Event');
    //this.setDiscountBeforeTax();
  }

  // @Input()
  // public addNewItemFocus () {
  //   this.inputitemcode.nativeElement.focus();
  // }

  stocklist: any;

  itemcode: FormControl;
  itemdatachange = 0;
  discountperchange = 0;
  discountchange = 0;
  filteredItem: any;

  // stocklist = [
  //   { itemid: '1', itemcode: 'Code 1', itemname: 'Items 1', price: 10, stockqty: 100, qty: 1, discount: 0, tax: 3, discountper: 0, uom: 'NOS', total: 0, grossamt: 0 },
  //   { itemid: '2', itemcode: 'Code 2', itemname: 'Items 2', price: 20, stockqty: 100, qty: 1, discount: 0, tax: 3, discountper: 0, uom: 'NOS', total: 0, grossamt: 0 },
  //   { itemid: '3', itemcode: 'Code 3', itemname: 'Items 3', price: 30, stockqty: 100, qty: 1, discount: 0, tax: 3, discountper: 0, uom: 'NOS', total: 0, grossamt: 0 },
  // ];


  constructor(private fb: FormBuilder,
    public sessiondata: LocalDataService) {

  }


  ngOnInit() {

    // this.myCallback = this.setDiscountBeforeTax;

    this.filteredItem = this.itemlistForm.get("itemcode").valueChanges
      .pipe(
        // startWith<string | User>(''),
        map(value => this.displayFn(value)),
        map(name => this.filterItem(name))
      );//Auto complete


    // this.filteredItem = this.itemlistForm.get("itemcode").valueChanges.pipe(
    //   // .startWith(null)
    //    map(val => this.displayFn(val)),
    //   map(name => this.filterItem(name));

    //Item select
    this.itemlistForm.get("itemcode").valueChanges.subscribe(val => {
      //console.log('Item List component', this.enableTax, this.enableIgst, this.enableKFcess);

      if (val && typeof val === 'object') {
        this.itemdatachange = 1;
        this.itemlistForm.patchValue(
          {
            ivid: val.InvDtlID ? val.InvDtlID : 0,
            itemname: val.Name,
            itemid: val.ItemID,
            tid: val.TID,
            qty: 1,
            price: val.Price,
            uom: val.Ucode,
            discount: 0,//val.DiscPer,
            discountper: 0,//val.DiscPer,
            total: 0,
            gst: this.enableTax ? (this.enableIgst ? val.GST : 0) : 0,
            sgst: this.enableTax ? (this.enableIgst ? 0 : val.SGST) : 0,
            cgst: this.enableTax ? (this.enableIgst ? 0 : val.CGST) : 0,
            gst_back: val.GST,
            sgst_back: val.SGST,
            cgst_back: val.CGST,
            kfcess: this.enableTax ? (this.enableKFcess ? val.KFcess : 0) : 0,
            kfcess_back: val.KFcess,
            grossamt: 0,
            mrp: val.MRP  ,
            weight:0
          });
        if (val.jcitem) {
          this.itemlistForm.patchValue(
            {
              qty: val.Qty,
              discount: val.Discount,
              discountper: parseFloat((val.Discount / (val.Qty * val.Price) * 100).toFixed(2))
            }
          );
        }

        this.itemlistForm.get("qty").clearValidators();
        if (this.currentPageType == "sales") {
          //console.log(val,"Sale");
          this.itemlistForm.get("qty").setValidators(Validators.compose([Validators.required, Validators.min(1), Validators.max(val.Qty), CustomValidators.number]));
        }
        else {
          // console.log(val,"Other");
          this.itemlistForm.get("qty").setValidators(Validators.compose([Validators.required, Validators.min(1), CustomValidators.number]));
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

    this.itemlistForm.get("weight").valueChanges.subscribe(item => {
      if (this.itemdatachange == 0) {
        this.discountchange = 1;
        this.setItemData();
      }
    });

    if (this.currentPageDefaultValue && typeof this.currentPageDefaultValue === 'object') {

      if (this.currentPageDefaultValue.jcitem) {
        this.itemlistForm.patchValue({
          itemcode: this.currentPageDefaultValue
        });
      }
    }
  }

  ngAfterViewInit() {
    this.inputitemcode.nativeElement.focus();
  }

  ///
  displayFn(value: any): string {
    // console.log('display with ', value);
    return value && typeof value === 'object' ? value.Code : value;
  }


  ///
  setItemData() {
    this.itemdatachange = this.itemdatachange + 1;
    if (this.itemdatachange == 1) {
      if (this.itemlistForm.valid) {
        this.itemlistForm.updateValueAndValidity();
        let obj = this.itemlistForm.getRawValue()

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

        // console.log("Item List Page", this.enableTax, this.enableIgst, this.enableKFcess);
        obj.grossamt = parseFloat((
          this.sessiondata.roundToTwo(obj.total * obj.gst / 100)
          + this.sessiondata.roundToTwo(obj.total * obj.sgst / 100)
          + this.sessiondata.roundToTwo(obj.total * obj.cgst / 100)
          + this.sessiondata.roundToTwo(obj.total * obj.kfcess / 100)
          + parseFloat(obj.total)).toFixed(2));

        // parseFloat( ( (obj.total * obj.sgst / 100) + (obj.total * obj.cgst / 100)
        // + (obj.total * obj.kfcess / 100) + parseFloat(obj.total)).toFixed(2));

        this.itemlistForm.patchValue(
          {
            discount: obj.discount,
            discountper: obj.discountper,
            total: parseFloat(obj.total),
            grossamt: parseFloat(obj.grossamt)
          }
        )
      }
      this.discountchange = 0;
      this.discountperchange = 0;
      this.itemdatachange = 0;
      this.itemupdated.emit(null);
    }
  }

  ///
  filterItem(val: string) {

   // console.log(this.currentPageType + 'itemlist');
    // console.log(this.stocklist);
    if (this.stocklist == null || this.stocklist == undefined) {
      this.stocklist = JSON.parse(localStorage.getItem(this.currentPageType + 'itemlist'))
    }

    // console.log(this.currentPageType);~

    if (this.stocklist) {
      const filterValue = val.toLowerCase();
      return this.stocklist.filter(item =>
        (((this.currentPageType == "sales" || this.currentPageType == "salereturn" || this.currentPageType == "purchasereturn")
          && item.Brd == this.itemBrand) || this.itemBrand == "All")
        && item.Code.toLowerCase().startsWith(filterValue));
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

