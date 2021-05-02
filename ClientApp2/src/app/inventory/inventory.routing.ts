import { Routes } from '@angular/router';
import { AuthGuard } from '../_guard/index';

import { SalesComponent } from './sales/save/sales.component';
import { SaleListComponent } from './sales/list/salelist.component';
import { SaleViewComponent } from './sales/view/saleview.component';
import { SaleReturnComponent } from './salesreturn/save/salereturn.component'
import { SaleReturnListComponent } from './salesreturn/list/salereturnlist.component'
import { SaleReturnViewComponent } from './salesreturn/view/salereturnview.component'
import { SaleOrderComponent } from './salesorder/save/saleorder.component';
import { SaleOrderListComponent } from './salesorder/list/saleorderlist.component';
import { SaleOrderViewComponent } from './salesorder/view/saleorderview.component';
 
import { PurchaseComponent } from './purchase/save/purchase.component';
import { PurchaseListComponent } from './purchase/list/purchaselist.component';
import { PurchaseViewComponent } from './purchase/view/purchaseview.component';

import { PurchaseReturnComponent } from './purchasereturn/save/purchasereturn.component';
import { PurchaseReturnListComponent } from './purchasereturn/list/purchasereturnlist.component';
import { PurchaseReturnViewComponent } from './purchasereturn/view/purchasereturnview.component';


import { JobCardViewComponent } from './jobcard/view/jobcardview.component';
import { JobCardComponent } from './jobcard/save/jobcard.component';
import { JobCardListComponent } from './jobcard/list/jobcardlist.component';

import { ServiceComponent } from './service/save/service.component';
import { ServiceListComponent } from './service/list/servicelist.component';
import { ServiceViewComponent } from './service/view/serviceview.component';

import { DeliveryOutViewComponent } from './deliveryout/view/deliveryoutview.component';
import { DeliveryOutComponent } from './deliveryout/save/deliveryout.component';
import { DeliveryOutListComponent } from './deliveryout/list/deliveryoutlist.component';

import { DeliveryInViewComponent } from './deliveryin/view/deliveryinview.component';
import { DeliveryInComponent } from './deliveryin/save/deliveryin.component';
import { DeliveryInListComponent } from './deliveryin/list/deliveryinlist.component';


import { ExpenseViewComponent } from './expense/view/expenseview.component';
import { ExpenseComponent } from './expense/save/expense.component';
import { ExpenseListComponent } from './expense/list/expenselist.component';

 
import { SaleInvoiceComponent} from './invoice/sales/saleinvoice.component';
import { GalleryListComponent } from './gallery/list/gallerylist.component';

export const InventoryRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    // canActivateChild : [AuthGuard],
    data: {
      // breadcrumb: 'Stock'
    },
    children: [
      {
        path: 'sales',
        // component: SalesComponent,
        data: {
          breadcrumb: 'Sale'
        },
        children: [
          {
            path: '',
            component: SalesComponent,
            data: {
              breadcrumb: 'Save'
            }
          }, {
            path: 'list',
            component: SaleListComponent,
            data: {
              breadcrumb: 'Search'
            }
          }, {
            path: 'view',
            component: SaleViewComponent,
            data: {
              breadcrumb: 'View'
            }
          }]
      }, {
        path: 'salesreturn',
        // component: SalesComponent,
        data: {
          breadcrumb: 'Sale Return'
        },
        children: [{
          path: '',
          component: SaleReturnComponent,
          data: {
            breadcrumb: 'Save'
          }
        }, {
          path: 'view',
          component: SaleReturnViewComponent,
          data: {
            breadcrumb: 'View'
          }
        }, {
          path: 'list',
          component: SaleReturnListComponent,
          data: {
            breadcrumb: 'Search'
          }
        }]
      }
      , {
        path: 'salesorder',
        //component: SaleOrderComponent,
        data: {
          breadcrumb: 'Sale Order'
        },
        children: [{
          path: '',
          component: SaleOrderComponent,
          data: {
            breadcrumb: 'Save'
          }
        }, {
          path: 'list',
          component: SaleOrderListComponent,
          data: {
            breadcrumb: 'Search'
          }
        }, {
          path: 'view',
          component: SaleOrderViewComponent,
          data: {
            breadcrumb: 'View'
          }
        }]
      }
      , {
        path: 'purchase',
        //component: PurchaseComponent,
        data: {
          breadcrumb: 'Purchase'
        },
        children: [{
          path: '',
          component: PurchaseComponent,
          data: {
            breadcrumb: 'Save'
          }
        }, {
          path: 'view',
          component: PurchaseViewComponent,
          data: {
            breadcrumb: 'View'
          }
        }, {
          path: 'list',
          component: PurchaseListComponent,
          data: {
            breadcrumb: 'Search'
          }
        }]
      } , {
        path: 'purchasereturn',
        //component: PurchaseComponent,
        data: {
          breadcrumb: 'Purchase Return'
        },
        children: [{
          path: '',
          component: PurchaseReturnComponent,
          data: {
            breadcrumb: 'Save'
          }
        }, {
          path: 'view',
          component: PurchaseReturnViewComponent,
          data: {
            breadcrumb: 'View'
          }
        }, {
          path: 'list',
          component: PurchaseReturnListComponent,
          data: {
            breadcrumb: 'Search'
          }
        }]
      },
      {
        path: 'jobcard',
        // component: SalesComponent,
        data: {
          breadcrumb: 'Job Card'
        },
        children: [
          {
            path: '',
            component: JobCardComponent,
            data: {
              breadcrumb: 'Save'
            }
          }, {
            path: 'list',
            component: JobCardListComponent,
            data: {
              breadcrumb: 'Search'
            }
          }, {
            path: 'view',
            component: JobCardViewComponent,
            data: {
              breadcrumb: 'View'
            }
          }]
      },
      {
        path: 'service',
        // component: SalesComponent,
        data: {
         breadcrumb: 'Service'
        },
        children: [
          {
            path: '',
            component: ServiceComponent,
            data: {
              breadcrumb: 'Save'
            }
          }, {
            path: 'list',
            component: ServiceListComponent,
            data: {
              breadcrumb: 'Search'
            }
          }, {
            path: 'view',
            component: ServiceViewComponent,
            data: {
              breadcrumb: 'View'
            }
          }]
      },
      {
        path: 'gallery',
        // component: SalesComponent,
        data: {
         breadcrumb: 'Gallery'
        },
        children: [
          {
            path: '',
            component: GalleryListComponent,
            data: {
              breadcrumb: 'List'
            }
          } ]
      }
      ,
      {
        path: 'deliveryin',
        // component: SalesComponent,
        data: {
         breadcrumb: 'Delivery In'
        },
        children: [
          {
            path: '',
            component: DeliveryInComponent,
            data: {
              breadcrumb: 'Save'
            }
          }, {
            path: 'list',
            component: DeliveryInListComponent,
            data: {
              breadcrumb: 'Search'
            }
          }, {
            path: 'view',
            component: DeliveryInViewComponent,
            data: {
              breadcrumb: 'View'
            }
          }]
      },
      {
        path: 'deliveryout',
        // component: SalesComponent,
        data: {
         breadcrumb: 'Delivery Out'
        },
        children: [
          {
            path: '',
            component: DeliveryOutComponent,
            data: {
              breadcrumb: 'Save'
            }
          }, {
            path: 'list',
            component: DeliveryOutListComponent,
            data: {
              breadcrumb: 'Search'
            }
          }, {
            path: 'view',
            component: DeliveryOutViewComponent,
            data: {
              breadcrumb: 'View'
            }
          }]
      }
      , {
        path: 'expense',
        // component: SalesComponent,
        data: {
         breadcrumb: 'Expense'
        },
        children: [
          {
            path: '',
            component: ExpenseComponent,
            data: {
              breadcrumb: 'Save'
            }
          }, {
            path: 'list',
            component: ExpenseListComponent,
            data: {
              breadcrumb: 'Search'
            }
          }, {
            path: 'view',
            component: ExpenseViewComponent,
            data: {
              breadcrumb: 'View'
            }
          }]
      }
      
      , {
        path: 'search',
        //component: SaleOrderComponent,
        data: {
          breadcrumb: 'Invoice Search'
        },
        children: [{
          path: '',
          component: SaleInvoiceComponent,
          data: {
            breadcrumb: 'Search'
          }
        } ]
      }
    ]
  }
];