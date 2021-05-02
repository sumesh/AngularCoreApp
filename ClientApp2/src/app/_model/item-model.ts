
export class ItemModel {
    itemid: string;
    itemname: string;
    itemcode: string;
    stockqty: number;
    qty: number;
    uom: string;
    tax: number;
    price: number;
    discount: number;
    discountper: number;
    total: number;
    grossamt: number;
}



export class InvoiceNumeber {
    InvSeries: string;
    InvPrefix: string;
    InvSufix: string;
    InvNo: string
    InvDisaply:string;
    getInvoiceNumber() {
        return this.InvSeries + this.InvPrefix + this.InvNo;
    }

}

export class SaleMasterData {
    InvNo: InvoiceNumeber;
    SaleMan: any;
    Branches:any;
    FInvNo: InvoiceNumeber;
    BillType:any;
    Finyear:any;
    TaxDtls:TaxCategory;
    States:CustomerDetails;
    WarrantyType:any;
}

export class TaxCategory
{
    SGST:number;
    CGST:number;
    IGST:number;
    KFcess:number;
}

export class CustomerDetails {
    phone: string;
    email: string;
    name: string;
    address: string;
    postalcode: string;
    gst: string;
    custid:string;
    cusstate: string;
    cusstatecode:string;
}

export class InvoiceModel {
    invtype:string;
    invoiceseries: string;
    invoicenumber: string;
    invoicedate: Date;
    saletype: string;
    billtype: string; 
    iscard: boolean;
    iscash: boolean;
    iscredit: boolean;
    salesmanid: string;
    //salesman: string;
    iswithwarranty: boolean;  
    warrantycardnum: string;
    reftype: string;
    refnum: string;
    customer: CustomerDetails;
    gst: number;
    cgst: number;
    kgst: number;
    items: Array<ItemModel>;
    discount: number;
    discountper: number;
}


