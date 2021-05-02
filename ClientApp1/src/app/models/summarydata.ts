export class SummaryData {
    desc?: string;
    value?: number; 
    status?:string;
   
  }
  
  export class PlSummary {
    head?: string;
    data?: SummaryData[]; 
    showcap?:boolean;
    cap?:SummaryData[];
  }

  export class EntityList
  {
    entityid?:string;
    entityname?:string;
    commitstatus?:number;
    revenuecoverage?:number;
    notification?:boolean;
  }