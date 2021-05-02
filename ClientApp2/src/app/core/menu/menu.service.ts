import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

const MENUITEMS = [
  {
    state: '/',
    name: 'HOME',
    type: 'link',
    icon: 'home'
  },
  {
    state: 'sale',
    name: 'Sale',
    type: 'sub', 
    icon: 'business_center', 
    children: [
      { state: 'salesorder', name: 'Sale Order' }, 
      { state: 'sales', name: 'Sale' },
      { state: 'salesreturn', name: 'Sale Return' },
     
      //{ state: 'serviceorder', name: 'SERVICE ORDER' },
      
      //{ state: 'servicedelivery', name: 'SERVICE DELIVERY' }
    ]
  },
  {
    state: 'purchase',
    name: 'Purchase',
    type: 'sub',
    icon: 'shopping_cart', 
    children: [     
      { state: 'purchase', name: 'Purchase' } ,
      { state: 'purchasereturn', name: 'Purchase Return' }      
    ]
  }, 
  {
    state: 'service',
    name: 'Service',
    type: 'sub',
    icon: 'bug_report', 
    children: [
      { state: 'jobcard', name: 'Job Card' }  ,
      { state: 'service', name: 'Service Invoice' }  
    ]
  }, 
  {
    state: 'delivery',
    name: 'Delivery Note',
    type: 'sub',
    icon: 'store', 
    children: [
      { state: 'deliveryin', name: 'Delivery In' }  ,
      { state: 'deliveryout', name: 'Delivery Out' }  
    ]
  },
  {
    state: 'accounts',
    name: 'Accounts',
    type: 'sub',
    icon: 'attach_money', 
    children: [
      { state: 'expense', name: 'Reciepts/Payments' }         
    ]
  },
  {
    state: 'reports',
    name: 'Reports',
    type: 'sub',
    icon: 'insert_chart', 
    children: [
      { state: 'stock', name: 'Stock' }  ,
      { state: 'stockbydate', name: 'Stock By Date' }  ,
      { state: 'dailystatement', name: 'Daily Statement' }  ,
      { state: 'stockmovement', name: 'Stock Movement' }  ,
      { state: 'reportmaster', name: 'Report Master' }  ,
      { state: 'stockcheck', name: 'Stock Check' }  
    ]
  },
  {
    state: 'products',
    name: 'Products',
    type: 'sub',
    icon: 'image', 
    children: [
      { state: 'gallery', name: 'Gallery' }  ,
     
    ]
  },
  // {
  //   state: 'apps',
  //   name: 'APPS',
  //   type: 'sub',
  //   icon: 'apps',
  //   badge: [
  //     {type: 'red', value: '5'}
  //   ],
  //   children: [
  //     {state: 'calendar', name: 'CALENDAR'},
  //     {state: 'media', name: 'MEDIA'},
  //     {state: 'messages', name: 'MESSAGES'},
  //     {state: 'social', name: 'SOCIAL'},
  //     {state: 'chat', name: 'CHAT'}
  //   ]
  // },
  // {
  //   state: 'widgets',
  //   name: 'WIDGETS',
  //   type: 'link',
  //   icon: 'photo'
  // },
  // {
  //   state: 'material',
  //   name: 'MATERIAL',
  //   type: 'sub',
  //   icon: 'equalizer',
  //   badge: [
  //     {type: 'purple', value: '10'}
  //   ],
  //   children: [
  //     {state: 'autocomplete', name: 'AUTOCOMPLETE'},
  //     {state: 'button', name: 'BUTTON'},
  //     {state: 'button-toggle', name: 'BUTTONTOGGLE'},
  //     {state: 'card', name: 'CARDS'},
  //     {state: 'checkbox', name: 'CHECKBOX'},
  //     {state: 'chips', name: 'CHIPS'},
  //     {state: 'datepicker', name: 'DATEPICKER'},
  //     {state: 'dialog', name: 'DIALOG'},
  //     {state: 'drawer', name: 'DRAWER'},
  //     {state: 'expansion', name: 'EXPANSION'},
  //     {state: 'grid-list', name: 'GRID'},
  //     {state: 'input', name: 'INPUT'},
  //     {state: 'list', name: 'LISTS'},
  //     {state: 'menu', name: 'MENU'},
  //     {state: 'progress-bar', name: 'PROGRESSBAR'},
  //     {state: 'progress-spinner', name: 'PROGRESSSPINNER'},
  //     {state: 'radio', name: 'RADIO'},
  //     {state: 'ripple', name: 'RIPPLE'},
  //     {state: 'select', name: 'SELECT'},
  //     {state: 'slide-toggle', name: 'SLIDETOGGLE'},
  //     {state: 'slider', name: 'SLIDER'},
  //     {state: 'snack-bar', name: 'SNACKBAR'},
  //     {state: 'stepper', name: 'STEPPER'},
  //     {state: 'table', name: 'TABLE'},
  //     {state: 'tabs', name: 'TABS'},
  //     {state: 'toolbar', name: 'TOOLBAR'},
  //     {state: 'tooltip', name: 'TOOLTIP'},
  //     {state: 'typography', name: 'TYPOGRAPHY'}
  //   ]
  // },
  // {
  //   state: 'forms',
  //   name: 'FORMS',
  //   type: 'sub',
  //   icon: 'looks_3',
  //   children: [
  //     // {state: 'editor', name: 'EDITOR'},
  //     {state: 'validation', name: 'VALIDATION'},
  //     {state: 'upload', name: 'UPLOAD'},
  //     {state: 'tree', name: 'TREE'},
  //   ]
  // },
  // {
  //   state: 'tables',
  //   name: 'DATATABLE',
  //   type: 'sub',
  //   icon: 'format_line_spacing',
  //   badge: [
  //     {type: 'blue-grey', value: '8'
  //     }
  //   ],
  //   children: [
  //     {state: 'fullscreen', name: 'FULLSCREEN'},
  //     {state: 'editing', name: 'EDITING'},
  //     {state: 'filter', name: 'FILTER'},
  //     {state: 'paging', name: 'PAGING'},
  //     {state: 'sorting', name: 'SORTING'},
  //     {state: 'pinning', name: 'PINNING'},
  //     {state: 'selection', name: 'SELECTION'},
  //   ]
  // },
  // {
  //   state: 'ecommerce',
  //   name: 'ECOMMERCE',
  //   type: 'sub',
  //   icon: 'looks_3',
  //   badge: [
  //     {type: 'red', value: 'new'
  //     }
  //   ],
  //   children: [
  //     {state: 'products', name: 'PRODUCTS'},
  //     {state: 'compact', name: 'COMPACT'},
  //     {state: 'detail', name: 'DETAIL'},
  //   ]
  // },
  // {
  //   state: 'taskboard',
  //   name: 'TASKBOARD',
  //   type: 'link',
  //   icon: 'view_column',
  // },
  // {
  //   state: 'charts',
  //   name: 'CHARTS',
  //   type: 'link',
  //   icon: 'show_chart',
  // },
  // {
  //   state: 'maps',
  //   name: 'MAPS',
  //   type: 'sub',
  //   icon: 'navigation',
  //   children: [
  //     {state: 'google', name: 'GOOGLE'},
  //     {state: 'leaflet', name: 'LEAFLET'}
  //   ]
  // },
  // {
  //   state: 'dragndrop',
  //   name: 'DND',
  //   type: 'link',
  //   icon: 'show_chart',
  // },
  // {
  //   state: 'pages',
  //   name: 'PAGES',
  //   type: 'sub',
  //   icon: 'pages',
  //   children: [
  //     {state: 'invoice', name: 'INVOICE'},
  //     {state: 'timeline', name: 'TIMELINE'},
  //     {state: 'user', name: 'USER'},
  //     {state: 'blank', name: 'BLANK'},
  //     {state: 'pricing', name: 'PRICING'},
  //   ]
  // },
  // {
  //   state: 'session',
  //   name: 'SESSION',
  //   type: 'sub',
  //   icon: 'face',
  //   children: [
  //     {state: '404', name: '404'},
  //     {state: 'error', name: 'ERROR'},
  //     {state: 'signin', name: 'SIGNIN'},
  //     {state: 'signup', name: 'SIGNUP'},
  //     {state: 'forgot', name: 'FORGOT'},
  //     {state: 'lockscreen', name: 'LOCKSCREEN'},
  //   ]
  // },
  {
    state: 'http://sumeshparakkat.blogspot.com',
    name: 'DOCS',
    type: 'extTabLink',
    icon: 'local_library'
  }
];

@Injectable()
export class MenuService {
  getAll(): Menu[] {
    return MENUITEMS;
  }

  add(menu: Menu) {
    //MENUITEMS.push(menu);
  }
}
