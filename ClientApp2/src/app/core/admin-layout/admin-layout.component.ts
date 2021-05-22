import { Component, ElementRef, NgZone, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import 'rxjs/add/operator/do';

//import { TranslateService } from '@ngx-translate/core'; 
import { PerfectScrollbarConfigInterface, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

const SMALL_WIDTH_BREAKPOINT = 960;

export interface BreadCrumb {
  label: string;
  url: string;
};

@Component({
  selector: 'app-layout', 
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  private _router: Subscription;

  // PageTitle: any;
  mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);
  url: string;
  sidePanelOpened: any;
  options = {
    collapsed: false,
    compact: false,
    boxed: false,
    dark: true,
    dir: 'ltr'
  };

  @ViewChild('sidemenu',{static: false}) sidemenu;
  @ViewChild(PerfectScrollbarDirective,{static: false}) directiveScroll!: PerfectScrollbarDirective;

 

  public config: PerfectScrollbarConfigInterface = {};

  constructor(
    private _element: ElementRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    zone: NgZone) {
    this.mediaMatcher.addListener(mql => zone.run(() =>
      this.mediaMatcher = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`))
    );
  }

  //   {
  //        this.mediaMatcher = mql;
  //   }));
  //}

  ngOnInit(): void {

    this.url = this.router.url;

    this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      document.querySelector('.app-inner > .mat-drawer-content > div').scrollTop = 0;
      this.url = event.url;
      this.runOnRouteChange();
    });

    //   this.breadcrumbs$ = this.router.events
    //   .filter(event => event instanceof NavigationEnd)
    //   .distinctUntilChanged()
    //   .map(event =>  this.buildBreadCrumb(this.activatedRoute.root));
    //Build your breadcrumb starting with the root route of your current activated route
  }

  ngOnDestroy(): void {
    this._router.unsubscribe();
  }

  runOnRouteChange(): void {
    if (this.isOver()) {
      this.sidemenu.close();
    }

    this.updatePS();
  }

  receiveOptions($event): void {
    console.log(event);
    this.options = $event;
  }

  isOver(): boolean {
    if (this.url === '/apps/messages' ||
      this.url === '/apps/calendar' ||
      this.url === '/apps/media' ||
      this.url === '/maps/leaflet' ||
      this.url === '/taskboard') {
      return true;
    } else {
      return this.mediaMatcher.matches;
    }
  }

  menuMouseOver(): void {
    if (this.mediaMatcher.matches && this.options.collapsed) {
      this.sidemenu.mode = 'over';
    }
  }

  menuMouseOut(): void {
    if (this.mediaMatcher.matches && this.options.collapsed) {
      this.sidemenu.mode = 'side';
    }
  }

  updatePS(): void {
    if (!this.mediaMatcher.matches && !this.options.compact) {
      setTimeout(() => {
        this.directiveScroll.update();
      }, 350);
    }
  }

  // // buildBreadCrumb(route: ActivatedRoute, url: string = '',
  // //   breadcrumbs: Array<BreadCrumb> = []): Array<BreadCrumb> {
  // //   //If no routeConfig is avalailable we are on the root path
  // //   console.log(route.routeConfig);

  // //     const label = route.routeConfig ? route.routeConfig.data['breadcrumb'] : 'Home';
  // //     const path = route.routeConfig ? route.routeConfig.path : '';
  // //     //In the routeConfig the complete path is not available, 
  // //     //so we rebuild it each time
  // //     const nextUrl = `${url}${path}/`;
  // //     const breadcrumb = {
  // //       label: label,
  // //       url: nextUrl
  // //     };
  // //     const newBreadcrumbs = [...breadcrumbs, breadcrumb];
  // //     if (route.firstChild) {
  // //       //If we are not on our current path yet, 
  // //       //there will be more children to look after, to build our breadcumb
  // //       return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
  // //     }
  // //     return newBreadcrumbs;

  // // }
}
