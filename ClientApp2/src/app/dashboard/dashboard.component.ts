import { Component, ViewChild, OnInit, } from '@angular/core';
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { AlertService, InventoryService, LocalDataService, ExcelService } from '../_services/index';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  card1;
  card2;
  card3;

  displayedColumns: string[] = ['project', 'date', 'progress'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  rows = [];

  // Shared chart options
  globalChartOptions: any = {
    responsive: true,
    legend: {
      display: false,
      position: 'bottom'
    }
  };

  // Bar
  barChartLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July'];
  barChartType = 'bar';
  barChartLegend = false;
  barChartData: any[] = [{
    data: [12500, 8000, 9000, 7500, 3000, 8500, 4500],
    label: 'Parakkat',
    borderWidth: 0
  }, {
    data: [5000, 14000, 4000, 2000, 600, 2500, 1550],
    label: 'Kalyani',
    borderWidth: 0
  }, {
    data: [300, 4000, 400, 200, 60, 250, -155],
    label: 'Discount/Gift Card',
    borderWidth: 0
  }];
  barChartOptions: any = Object.assign({
    scaleShowVerticalLines: false,
    tooltips: {
      mode: 'index',
      intersect: false
    },
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          defaultFontColor: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        },
        stacked: false,
        ticks: {
          beginAtZero: true
        }
      }],
      yAxes: [{
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          defaultFontColor: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        },
        stacked: false
      }]
    }
  }, this.globalChartOptions);

  // Bubble Chart
  bubbleChartData: Array<any> = [{
    data: [{
      x: 6,
      y: 5,
      r: 15,
    }, {
      x: 5,
      y: 4,
      r: 10,
    }, {
      x: 8,
      y: 4,
      r: 6,
    }, {
      x: 8,
      y: 4,
      r: 6,
    }, {
      x: 5,
      y: 14,
      r: 14,
    }, {
      x: 5,
      y: 6,
      r: 8,
    }, {
      x: 4,
      y: 2,
      r: 10,
    }],
    label: 'Series A',
    borderWidth: 1
  }];
  bubbleChartType = 'bubble';

  // combo chart
  comboChartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July'];
  chartColors: Array<any> = [{ // grey
    backgroundColor: '#7986cb',
    borderColor: '#3f51b5',
    pointBackgroundColor: '#3f51b5',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }, { // dark grey
    backgroundColor: '#eeeeee',
    borderColor: '#e0e0e0',
    pointBackgroundColor: '#e0e0e0',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(77,83,96,1)'
  }, { // grey
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }];
  comboChartLegend = true;
  ComboChartData: Array<any> = [
    {
      data: [60, 50, 80, 80, 50, 50, 40],
      label: 'Sale',
      borderWidth: 1,
      type: 'line',
      fill: false
    }, {
      data: [50, 40, 40, 20, 60, 20, -50],
      label: 'Sale Return',
      borderWidth: 1,
      type: 'line',
      fill: false
    }, {
      data: [5, 4, 4, 2, 6, 2, 5],
      label: 'Purchase',
      borderWidth: 1,
      type: 'line',
      fill: false
    }, {
      data: [57, 48, 48, 28, 68, 28, 58],
      label: 'Purchase',
      borderWidth: 1,
      type: 'line',
      fill: false
    }, {
      data: [120, 110, 130, 125, 135, 140, 150],
      label: 'Total',
      borderWidth: 1,
      type: 'bar'
    }, {
      data: [120, 110, 130, 125, 135, 140, 150],
      label: 'Total 2',
      borderWidth: 1,
      type: 'bar'
    }];
  ComboChartOptions: any = Object.assign({
    animation: false,
    tooltips: {
      mode: 'index',
      intersect: false
    },
    scales: {
      xAxes: [{
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        }
      }],
      yAxes: [{
        gridLines: {
          color: 'rgba(0,0,0,0.02)',
          zeroLineColor: 'rgba(0,0,0,0.02)'
        },
        ticks: {
          beginAtZero: true,
          suggestedMax: 9,
        }
      }]
    }
  }, this.globalChartOptions);

  // Doughnut
  doughnutChartColors: any[] = [{
    backgroundColor: [   '#cb2431', '#061565', '#dac404', '#4caf50', '#0688c5',
    '#003f5c','#2f4b7c','#665191','#a05195','#d45087','#f95d6a','#ff7c43','#ffa600'
   ]
  }];
  doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  doughnutChartData: number[] = [350, 450, 100];
  doughnutChartType = 'doughnut';
  doughnutOptions: any = Object.assign({
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  }, this.globalChartOptions);

  // Pie
  pieChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'SALE'];
  pieChartData: number[] = [300, 500, 100, 350];
  pieChartType = 'pie';

  // newsfeed
  messages: Object[] = [{
    from: 'Ali Connors',
    message: 'I will be in your neighborhood',
    photo: 'assets/images/face3.jpg',
    subject: 'Brunch this weekend?',
  }, {
    from: 'Trevor Hansen',
    message: 'Wish I could but we have plans',
    photo: 'assets/images/face6.jpg',
    subject: 'Brunch this weekend?',
  }, {
    from: 'Sandra Adams',
    message: 'Do you have Paris recommendations instead?',
    photo: 'assets/images/face4.jpg',
    subject: 'Brunch this weekend?',
  },];

  constructor(
    private invservice: InventoryService,
    public sessiondata: LocalDataService,
    private message: AlertService,
    private excelService: ExcelService
  ) {
    //this.fetch((data) => { this.rows = data; });
  }

  userAccess: any = {};
  showdashboard: boolean = false;
  showloading: boolean = true;
  chart_overall: any = [];

  chart_fy_sale_label: Array<any> = ['Jan'];
  chart_fy_sale_data: Array<any> = [{ data: [0], label: 'Sale', borderWidth: 1, type: 'line', fill: false }];

  chart_month_sale_label: Array<any> = ['Jan'];
  chart_month_sale_data: Array<any> = [{ data: [0], label: 'Sale', borderWidth: 1, type: 'line', fill: false }];

  chart_fy_total_label: Array<any> = ['Jan'];
  chart_fy_total_data: Array<any> = [2];

  chart_month_total_label: Array<any> = ['Jan'];
  chart_month_total_data: Array<any> = [2];

  chart_itemcode_label: Array<any> = ['Jan'];
  chart_itemcode_data: Array<any> = [2];

  chart_itemcategory_label: Array<any> = ['Jan'];
  chart_itemcategory_data: Array<any> = [2];

  chart_saleman_label: any = ['Jan'];
  chart_saleman_data: any = [2];

  ngOnInit() {
    this.userAccess = this.sessiondata.getUserAccess("DASHBOARD");
    this.loadItem();
  }

  loadItem() {
    this.showdashboard = false;
    this.showloading = true;

    this.invservice.InvoiceDataService('api/reports/reportdata/', { ReportCode: 'Dashboard' })
      .subscribe(data => {
        if (data) {
          let ret = { label: [], data: [] };
          // push our inital complete list 
          this.chart_overall = data['TableData'].Table;

          //this.getComboChartData(data['TableData'].Table1, 'FY');

          //ret = this.getPieChartData(data['TableData'].Table2);
          this.chart_fy_total_label = ret.label;
          this.chart_fy_total_data = ret.data;
         // console.log( this.chart_fy_total_label, this.chart_fy_total_data);
          this.getComboChartData(data['TableData'].Table1, 'Monthly');

          ret = this.getPieChartData(data['TableData'].Table2);
          this.chart_month_total_label = ret.label;
          this.chart_month_total_data = ret.data;

          ret = this.getPieChartData(data['TableData'].Table3);
          this.chart_itemcode_label = ret.label;
          this.chart_itemcode_data = ret.data;

          ret = this.getPieChartData(data['TableData'].Table4);
          this.chart_itemcategory_label = ret.label;
          this.chart_itemcategory_data = ret.data;

          ret = this.getPieChartData(data['TableData'].Table5);
          this.chart_saleman_label = ret.label;
          this.chart_saleman_data = ret.data;

          this.showdashboard = true;
          this.showloading = false;

        }
        else {
          this.message.error("No Data Available. Please try again");
          this.showdashboard = false;
          this.showloading = false;
        }
      },
        err => {
          this.message.error("Error while communicating with server. Please try again");
          this.sessiondata.handleError(err);
          this.showdashboard = false;
          this.showloading = false;
        });

  }

  getPieChartData(dt) {
    var pieChartLabels = [];
    var pieChartData = [];
    dt.forEach(obj => {
      pieChartLabels.push(obj.InvType);
      pieChartData.push(obj.Amount);
    });
    return { label: pieChartLabels, data: pieChartData };
  }

  getComboChartData(dt, type) {
    let data = [], label = [];

    if (dt.length > 0) {

      var columnsIn = dt[0];
      // loop through every key in the object
      for (var key in columnsIn) {
        if (key != 'InvDate') {

          data.push({
            data: [],
            label: key,
            borderWidth: 1,
            type: key != 'Total' ? 'line' : 'bar',
            fill: false
          });
        }
        // console.log(key); // here is your column name you are looking for + its value
      }
      //comboChartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July'];
      dt.forEach(obj => {
        label.push(obj['InvDate']);

        data.forEach(dtl => {
          dtl.data.push(obj[dtl.label] == undefined ? 0 : obj[dtl.label]);

        });
      });


      if (type == "FY") {
        this.chart_fy_sale_label = label;
        this.chart_fy_sale_data = data;
      }
      else if (type == "Monthly") {
        this.chart_month_sale_label = label;
        this.chart_month_sale_data = data;
      }
    }

  }

  // project table
  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/projects.json`);
    req.onload = () => {
      cb(JSON.parse(req.response));
    };
    req.send();
  }
}
