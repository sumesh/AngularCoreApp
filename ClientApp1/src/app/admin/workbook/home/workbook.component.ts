import { Component, OnInit } from '@angular/core';

class NavLink {
  constructor(public path: string, public label: string) {}
}
@Component({
  selector: 'app-workbook',
  templateUrl: './workbook.component.html',
  styleUrls: ['./workbook.component.scss']
})
export class WorkbookComponent implements OnInit {
  navLinks: NavLink[] = [];
  constructor() {}
  ngOnInit() {
    this.navLinks = [
      new NavLink('wbbudget', 'Budget Details'),
      new NavLink('wbcost', 'Cost Details'),
      new NavLink('wbresourceplan', 'Resource Plan')  
    ];
  }
}
