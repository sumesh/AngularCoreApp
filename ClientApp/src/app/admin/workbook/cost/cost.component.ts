import { Component, OnInit, OnDestroy } from '@angular/core';  
import {MatDialog} from '@angular/material/dialog';
import { CODComponent } from '../cod/cod.component';

@Component({
  selector: 'app-wbcost',
  templateUrl: './cost.component.html',
  styleUrls: ['./cost.component.scss']
})
export class CostComponent implements OnInit, OnDestroy { 
  costhead:string="total";
  costtype:string="all";
  constructor(public dialog: MatDialog) {}

  openCODDialog() {
    const dialogRef = this.dialog.open(CODComponent, {
      width: '100%',
      data: {
        entity: 'bu'
      }});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  
  ngOnDestroy(): void {     
  }

  ngOnInit() { 
  }
}
