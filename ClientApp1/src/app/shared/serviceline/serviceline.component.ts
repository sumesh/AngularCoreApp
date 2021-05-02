import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
import { Serviceline } from 'src/app/_models';
import { MasterDataService } from 'src/app/_services';

@Component({
  selector: 'app-serviceline',
  templateUrl: './serviceline.component.html',
  styleUrls: ['./serviceline.component.scss']
})
export class ServicelineComponent implements OnInit {
  @Input() all: boolean=true;
  @Input() isMultple: boolean=false;
  @Input() servicelineID: string="0";
  @Input() servicelineIDs: string[]=[];

  selectAll = false;

  @Output() servicelineChanges = new EventEmitter<string|string[]>();
  
   
  servicelines!:Serviceline[];

  constructor( private masterdata: MasterDataService) {}

  ngOnInit() {

      this.getServiceline();
  }

  getServiceline()
  {
    //console.log("Serviceline loading");
    this.masterdata.getServicelines().subscribe(s => {       
        this.servicelines = s;
      });
  }

  ddlChangeEvent()
  {    
    this.servicelineChanges.emit(this.servicelineID); 
  }

  ddlChangeEventMulti()
  {
    this.servicelineChanges.emit(this.servicelineIDs); 
  }

  toggleAllSelection() {
    this.selectAll = !this.selectAll;
    if (this.selectAll == true) {
        //console.log(this.servicelineIDs , this.servicelines.map(m=>m.horzid!.toString()))
      this.servicelineIDs = this.servicelines.map(m=>m.horzid!.toString());
      this.servicelineIDs.push("0");
    } else {
      this.servicelineIDs = [];
    }
  }
}
