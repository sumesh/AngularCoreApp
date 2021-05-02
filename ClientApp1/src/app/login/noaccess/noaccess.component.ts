import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/_services';

@Component({
  selector: 'app-noaccess',
  templateUrl: './noaccess.component.html',
  styleUrls: ['./noaccess.component.scss']
})
export class NoAccessComponent implements OnInit {

  

  constructor() {
    
  }


  ngOnInit() { 
    
  } 
}
