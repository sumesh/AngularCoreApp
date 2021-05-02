import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  @Input() bgClass!: string;
  @Input() icon!: string;
  @Input() count!: number;
  @Input() label!: string;
  @Input() data!: number;

  ddlPeriodval="1";
  ddlyearVal="2021";  
  rdFxVal="1"
  rdCurval="1";

  constructor() {}

  ngOnInit() {}
}
