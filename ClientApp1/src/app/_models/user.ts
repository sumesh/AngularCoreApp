import { Role, Roles } from "./role";

export class User {
    id?: number;
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: Role;
    token?: string;
    roles?: Roles[];
    isProxy?:boolean;
}


export class Session {
    Identity?: User
    Role?: Roles;
}

export class InputData {
    roleid?: string;
    horzid?: string;
    subhorzid?: string;
    entitytype?: string;
    entityid?: string;
    buckettype?: string;
    filterType?:string;    
    year?:number;
}

export class MasterDropdown {
    id?: string;
    value?: string;
    isdefault?: boolean;
}

export class GridFilterType {
    typeid?: string;
    name?: string;
    showytd?: boolean;
    showfy?: boolean;
    showyear?: boolean;
    showfx?: boolean;
    maxmonth?: number;
    pagination?:number;
}


export class GridFilterPeriod {
    filtertype?: string;
    periods?: MasterPeriod[]
}

export class MasterPeriod {
    rw?: number;
    id?: number;
    name?: string;
    year?: number;
    type?: string;
}

export class GridDescription {
    descid?: number;
    desc?: string;
    type?: string;
    format?: string;
}



