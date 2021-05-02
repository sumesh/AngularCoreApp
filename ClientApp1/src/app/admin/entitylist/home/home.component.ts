import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { EntityList } from 'src/app/models';

 

@Component({
  selector: 'app-entitylist',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  summarylist: Array<EntityList>=[]
   
  
   

  constructor() { 
  }

  
  ngOnDestroy(): void {     
  }

  ngOnInit() {
    this.summarylist = [
      {
        entityid:'1234567',
        entityname: 'Account 1',
        commitstatus:0,
        revenuecoverage:40,        
        notification:true     
      },
      {
        
        entityid:'2234567',
        entityname: 'Account 2',
        commitstatus:0,
        revenuecoverage:40,        
        notification:false         
      },
      {
        
        entityid:'3234567',
        entityname: 'Account 3',
        commitstatus:0,
        revenuecoverage:40,        
        notification:false  
      },
      {
        
        entityid:'4234567',
        entityname: 'Account 4',
        commitstatus:0,
        revenuecoverage:40,        
        notification:false  
      },
      {
        
        entityid:'5234567',
        entityname: 'Account 5',
        commitstatus:0,
        revenuecoverage:40,        
        notification:false  
      }       
    ];
  }
}
