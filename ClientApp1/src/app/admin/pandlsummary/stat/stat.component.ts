import { Component, OnInit, Input,OnDestroy } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Observable, Subscription } from 'rxjs';
import { PlSummary } from 'src/app/models';



@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit, OnDestroy {
  @Input() summary!: PlSummary[]; 
  displaycount = 6;
  screensize = 'sm'; 
  private readonly mediaWatcher: Subscription;

  constructor(media: MediaObserver) {
    //this.media$ = media.asObservable();
    this.mediaWatcher = media.asObservable().subscribe((change: MediaChange[]) => {
     
      if (change && change.length > 0)
        if (this.screensize == change[0].mqAlias) return;
      this.screensize = change[0].mqAlias;
      if (this.screensize === 'sm') {
        this.displaycount = 1;
      } else if (this.screensize === 'xs') {
        this.displaycount = 0;
      }
      else {
        this.displaycount = 6;
      }

    });
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.mediaWatcher.unsubscribe();
  }

  displayDetails() {
    if (this.displaycount == 6 && this.screensize === 'sm') {
      this.displaycount = 1;
    } else if (this.displaycount == 6 && this.screensize === 'xs') {
      this.displaycount = 0;
    }
    else {
      this.displaycount = 6;
    }
  }
}
