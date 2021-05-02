import { Component, OnInit, OnDestroy,Inject } from '@angular/core';  
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-wbcod',
  templateUrl: './cod.component.html',
  styleUrls: ['./cod.component.scss']
})
export class CODComponent implements OnInit, OnDestroy { 
  costhead:string="total";
  costtype:string="all";
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  
  ngOnDestroy(): void {     
  }

  ngOnInit() { 
  }
}
