import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { PlSummary } from 'src/app/models';

 

@Component({
  selector: 'app-wbbudget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit, OnDestroy { 

  constructor() { 
  }

  
  ngOnDestroy(): void {     
  }

  ngOnInit() { 
  }
}
