import { Component, OnInit, OnDestroy } from '@angular/core';  
import {MatDialog} from '@angular/material/dialog';
import { PPMComponent } from '../ppm/ppm.component';
 
@Component({
  selector: 'app-wbresource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit, OnDestroy { 
  costhead:string="total";
  costtype:string="all";
  constructor(public dialog: MatDialog) {}

  openCODDialog() {
    const dialogRef = this.dialog.open(PPMComponent, {
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
