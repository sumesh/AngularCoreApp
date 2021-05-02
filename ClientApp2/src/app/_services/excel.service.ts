import { Injectable } from '@angular/core';
 
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

  constructor() { } 

  public exportAsExcelFile(json: any[], excelFileName: string): void {
   

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
 
    XLSX.writeFile(workbook, excelFileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  public exportAsExcelFile_MultiSheet(json: any, excelFileName: string): void {
    let wbsheets={},sheetname=[];
    for (var key in json)
    {
    const worksheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json[key]);
    wbsheets[key]=worksheet1;
    sheetname.push(key);
    }
     
    const workbook: XLSX.WorkBook = { Sheets: wbsheets, SheetNames: sheetname };
 
    XLSX.writeFile(workbook, excelFileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
 

}