import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AlertService } from '../_services/index';

@Component({
    moduleId: module.id,
    selector: 'alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent {
    message: any;

    constructor(public snackBar: MatSnackBar,
        private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getMessage().subscribe(message => {
         // console.log(message);
            this.message =  message;
            if (this.message) {
                let bgcss = "mat-teal";
                if (this.message.type == "success") {
                    bgcss = "mat-teal";
                }
                else if (this.message.type == "error") {
                    bgcss = "mat-red";
                }
                else if (this.message.type == "warning") {
                    bgcss = "mat-purple";
                }

                this.snackBar.open(this.message.text, "", {
                    duration: 3000 ,
                     panelClass: [bgcss]
                });
                this.message = null;
            }
        });
    }


}