import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User, Role, Serviceline, MasterDropdown, GridFilterType, GridFilterPeriod, GridDescription } from '../_models';
import { PlSummary } from '../models';
import { D } from '@angular/cdk/keycodes';

const users: User[] = [
    {
        id: 147852, username: '147852', firstName: 'Admin', role:
            Role.Admin,isProxy:true,
        roles: [
            { roleid: 'RH001', rolename: 'Account Manager', roletype: 'VT' },
            { roleid: 'RH002', rolename: 'SLM', roletype: 'HZ' }
        ]
    },
    {
        id: 369852, username: '369852', firstName: 'RHMS', role: Role.Admin,isProxy:false,
        roles: [
            { roleid: 'RH003', rolename: 'Delivery Patner', roletype: 'VT' },
            { roleid: 'RH002', rolename: 'SLM', roletype: 'VT' }
        ]
    }
];

const servicelinesArr: Serviceline[] = [
    { horzid: 8, HorzName: 'QEA' }, { horzid: 85, HorzName: 'ADM' }, { horzid: 25, HorzName: 'CIS' }, { horzid: 88, HorzName: 'EAS' },
];

const pnlSummarylist: PlSummary[] = [
    {

        head: 'Total FY 2021 (A+B)',
        showcap: false,
        data: [{ desc: 'Rev $', value: 11986545123.32, status: '' }, { desc: 'Cost $', value: 11986545123.32, status: '' }, { desc: 'CP %', value: 23.32, status: '' }]
    },
    {

        head: 'YTD Actuals (A)',
        showcap: false,
        data: [{ desc: 'Rev $', value: 11986545123.32, status: '' }, { desc: 'Cost $', value: 11986545123.32, status: '' }, { desc: 'CP %', value: 23.32, status: '' }]
    },
    {

        head: 'Forecast (C+D)',
        showcap: false,
        data: [{ desc: 'Rev $', value: 11986545123.32, status: '' }, { desc: 'Cost $', value: 11986545123.32, status: '' }, { desc: 'CP %', value: 23.32, status: '' }]
    },
    {

        head: 'System Predictoin (C)',
        showcap: false,
        data: [{ desc: 'Rev $', value: 11986545123.32, status: '' }, { desc: 'Cost $', value: 11986545123.32, status: '' }, { desc: 'CP %', value: 23.32, status: '' }]
    },
    {

        head: 'Adjustment (DB)',
        showcap: true,
        data: [{ desc: 'Rev $', value: 11986545123.32, status: 'green' }, { desc: 'Cost $', value: 11986545123.32, status: 'amber' }, { desc: 'CP %', value: 23.32, status: '' }],
        cap: [{ desc: 'Revenue', value: 30.32 }, { desc: 'Cost', value: 25.32 }]
    }
];

const ddlBucketType: MasterDropdown[] = [
    { id: '1', value: 'Most Likely ( ML+BL)', isdefault: true },
    { id: '2', value: 'Backlog (BL)', isdefault: false },
    { id: '3', value: 'upside (UP)', isdefault: false },
];

const gridMasterFilterType: Array<GridFilterType> = [
    { typeid: 'D', name: 'Default', showytd: true, showfy: true, showyear: true, showfx: true, maxmonth: 6 },
    { typeid: 'M', name: 'Monthly', showytd: false, showfy: false, showyear: true, showfx: true, maxmonth: 8 },
    { typeid: 'Q', name: 'Quarterly', showytd: false, showfy: false, showyear: true, showfx: true, maxmonth: 4 },
    // { typeid: 'Y', name: 'Quarterly', showytd: false, showfy: false, showyear: false, showfx: false, maxmonth: 4 },
];

const gridMasterFilterYear: Array<MasterDropdown> = [
    { id: '2020', value: '2020' },
    { id: '2021', value: '2021' },
    { id: '2022', value: '2022' }
];

const gridMasterFilterFx: Array<MasterDropdown> = [
    { id: 'Fx', value: 'Costant', isdefault: true },
    { id: 'R', value: 'Reported', isdefault: false }
];
const gridMasterFilterDol: Array<MasterDropdown> = [
    { id: '1000', value: '$K', isdefault: true },
    { id: '1000000', value: 'Mn', isdefault: false },
    { id: '100000000', value: 'Bn', isdefault: false },
];

const gridFilterDefaults: any = { filterType: 'D', year: '2021', fx: 'Fx', dol: '1000' };

const gridMasterDataV2 = {
    filtertype: gridMasterFilterType,
    year: gridMasterFilterYear,
    fx: gridMasterFilterFx,
    dol: gridMasterFilterDol,
    default: gridFilterDefaults
};

const gridMDescription: Array<GridDescription> = [
    { descid: 1, desc: 'Forecast', type: 'H', format: '' },
    { descid: 2, desc: 'Rev $', type: 'D', format: '$' },
    { descid: 3, desc: 'Cost $', type: 'D', format: '$' },
    { descid: 4, desc: 'CP %', type: 'D', format: '%' },
    { descid: 5, desc: 'Adjustment', type: 'H', format: '' },
    { descid: 6, desc: 'Rev $', type: 'D', format: '$' },
    { descid: 7, desc: 'Cost $', type: 'D', format: '$' },
    { descid: 8, desc: 'CP %', type: 'D', format: '%' }
]




const gridFilterPeriods: Array<GridFilterPeriod> = [
    {
        filtertype: 'D',
        periods: [
            { id: 202000, name: 'YTD 2020', rw: 0, type: 'A', year: 2020 },
            { id: 202001, name: 'Jan 2020', rw: 1, type: 'M', year: 2020 },
            { id: 202002, name: 'Feb 2020', rw: 2, type: 'M', year: 2020 },
            { id: 202003, name: 'Mar 2020', rw: 3, type: 'M', year: 2020 },
            { id: 202004, name: 'Apr 2020', rw: 4, type: 'M', year: 2020 },
            { id: 202005, name: 'May 2020', rw: 5, type: 'M', year: 2020 },
            { id: 202006, name: 'Jun 2020', rw: 6, type: 'M', year: 2020 },
            { id: 202007, name: 'Jul 2020', rw: 7, type: 'M', year: 2020 },
            { id: 202008, name: 'Aug 2020', rw: 8, type: 'M', year: 2020 },
            { id: 202009, name: 'Sep 2020', rw: 9, type: 'M', year: 2020 },
            { id: 202010, name: 'Oct 2020', rw: 10, type: 'M', year: 2020 },
            { id: 202011, name: 'Nov 2020', rw: 11, type: 'M', year: 2020 },
            { id: 202012, name: 'Dec 2020', rw: 12, type: 'M', year: 2020 },
            { id: 202013, name: 'FY 2020', rw: 13, type: 'F', year: 2020 },

            { id: 202100, name: 'YTD 2021', rw: 0, type: 'A', year: 2021 },
            { id: 202101, name: 'Jan 2021', rw: 1, type: 'M', year: 2021 },
            { id: 202102, name: 'Feb 2021', rw: 2, type: 'M', year: 2021 },
            { id: 202103, name: 'Mar 2021', rw: 3, type: 'M', year: 2021 },
            { id: 202104, name: 'Apr 2021', rw: 4, type: 'M', year: 2021 },
            { id: 202105, name: 'May 2021', rw: 5, type: 'M', year: 2021 },
            { id: 202106, name: 'Jun 2021', rw: 6, type: 'M', year: 2021 },
            { id: 202107, name: 'Jul 2021', rw: 7, type: 'M', year: 2021 },
            { id: 202108, name: 'Aug 2021', rw: 8, type: 'M', year: 2021 },
            { id: 202109, name: 'Sep 2021', rw: 9, type: 'M', year: 2021 },
            { id: 202110, name: 'Oct 2021', rw: 10, type: 'M', year: 2021 },
            { id: 202111, name: 'Nov 2021', rw: 11, type: 'M', year: 2021 },
            { id: 202112, name: 'Dec 2021', rw: 12, type: 'M', year: 2021 },
            { id: 20213, name: 'FY 2020', rw: 13, type: 'F', year: 2021 },

            { id: 202200, name: 'YTD 2022', rw: 0, type: 'A', year: 2022 },
            { id: 202201, name: 'Jan 2022', rw: 1, type: 'M', year: 2022 },
            { id: 202202, name: 'Feb 2022', rw: 2, type: 'M', year: 2022 },
            { id: 202203, name: 'Mar 2022', rw: 3, type: 'M', year: 2022 },
            { id: 202204, name: 'Apr 2022', rw: 4, type: 'M', year: 2022 },
            { id: 202205, name: 'May 2022', rw: 5, type: 'M', year: 2022 },
            { id: 202206, name: 'Jun 2022', rw: 6, type: 'M', year: 2022 },
            { id: 202207, name: 'Jul 2022', rw: 7, type: 'M', year: 2022 },
            { id: 202208, name: 'Aug 2022', rw: 8, type: 'M', year: 2022 },
            { id: 202209, name: 'Sep 2022', rw: 9, type: 'M', year: 2022 },
            { id: 202210, name: 'Oct 2022', rw: 10, type: 'M', year: 2022 },
            { id: 202211, name: 'Nov 2022', rw: 11, type: 'M', year: 2022 },
            { id: 202212, name: 'Dec 2022', rw: 12, type: 'M', year: 2022 },
            { id: 202213, name: 'FY 2022', rw: 13, type: 'F', year: 2022 }
        ]
    },
    {
        filtertype: 'M',
        periods: [
           
            { id: 202001, name: 'Jan 2020', rw: 1, type: 'M', year: 2020 },
            { id: 202002, name: 'Feb 2020', rw: 2, type: 'M', year: 2020 },
            { id: 202003, name: 'Mar 2020', rw: 3, type: 'M', year: 2020 },
            { id: 202004, name: 'Apr 2020', rw: 4, type: 'M', year: 2020 },
            { id: 202005, name: 'May 2020', rw: 5, type: 'M', year: 2020 },
            { id: 202006, name: 'Jun 2020', rw: 6, type: 'M', year: 2020 },
            { id: 202007, name: 'Jul 2020', rw: 7, type: 'M', year: 2020 },
            { id: 202008, name: 'Aug 2020', rw: 8, type: 'M', year: 2020 },
            { id: 202009, name: 'Sep 2020', rw: 9, type: 'M', year: 2020 },
            { id: 202010, name: 'Oct 2020', rw: 10, type: 'M', year: 2020 },
            { id: 202011, name: 'Nov 2020', rw: 11, type: 'M', year: 2020 },
            { id: 202012, name: 'Dec 2020', rw: 12, type: 'M', year: 2020 }, 
            
            { id: 202101, name: 'Jan 2021', rw: 1, type: 'M', year: 2021 },
            { id: 202102, name: 'Feb 2021', rw: 2, type: 'M', year: 2021 },
            { id: 202103, name: 'Mar 2021', rw: 3, type: 'M', year: 2021 },
            { id: 202104, name: 'Apr 2021', rw: 4, type: 'M', year: 2021 },
            { id: 202105, name: 'May 2021', rw: 5, type: 'M', year: 2021 },
            { id: 202106, name: 'Jun 2021', rw: 6, type: 'M', year: 2021 },
            { id: 202107, name: 'Jul 2021', rw: 7, type: 'M', year: 2021 },
            { id: 202108, name: 'Aug 2021', rw: 8, type: 'M', year: 2021 },
            { id: 202109, name: 'Sep 2021', rw: 9, type: 'M', year: 2021 },
            { id: 202110, name: 'Oct 2021', rw: 10, type: 'M', year: 2021 },
            { id: 202111, name: 'Nov 2021', rw: 11, type: 'M', year: 2021 },
            { id: 202112, name: 'Dec 2021', rw: 12, type: 'M', year: 2021 },
           
            { id: 202201, name: 'Jan 2022', rw: 1, type: 'M', year: 2022 },
            { id: 202202, name: 'Feb 2022', rw: 2, type: 'M', year: 2022 },
            { id: 202203, name: 'Mar 2022', rw: 3, type: 'M', year: 2022 },
            { id: 202204, name: 'Apr 2022', rw: 4, type: 'M', year: 2022 },
            { id: 202205, name: 'May 2022', rw: 5, type: 'M', year: 2022 },
            { id: 202206, name: 'Jun 2022', rw: 6, type: 'M', year: 2022 },
            { id: 202207, name: 'Jul 2022', rw: 7, type: 'M', year: 2022 },
            { id: 202208, name: 'Aug 2022', rw: 8, type: 'M', year: 2022 },
            { id: 202209, name: 'Sep 2022', rw: 9, type: 'M', year: 2022 },
            { id: 202210, name: 'Oct 2022', rw: 10, type: 'M', year: 2022 },
            { id: 202211, name: 'Nov 2022', rw: 11, type: 'M', year: 2022 },
            { id: 202212, name: 'Dec 2022', rw: 12, type: 'M', year: 2022 },

        ]
    },
    {
        filtertype: 'Q',
        periods: [
           
            { id: 202001, name: 'Q1 2020', rw: 1, type: 'M', year: 2020 },
            { id: 202002, name: 'Q2 2020', rw: 2, type: 'M', year: 2020 },
            { id: 202003, name: 'Q3 2020', rw: 3, type: 'M', year: 2020 },
            { id: 202004, name: 'Q4 2020', rw: 4, type: 'M', year: 2020 }, 
            
            { id: 202101, name: 'Q1 2021', rw: 1, type: 'M', year: 2021 },
            { id: 202102, name: 'Q2 2021', rw: 2, type: 'M', year: 2021 },
            { id: 202103, name: 'Q3 2021', rw: 3, type: 'M', year: 2021 },
            { id: 202104, name: 'Q4 2021', rw: 4, type: 'M', year: 2021 },
           
           
            { id: 202201, name: 'Q1 2022', rw: 1, type: 'M', year: 2022 },
            { id: 202202, name: 'Q2 2022', rw: 2, type: 'M', year: 2022 },
            { id: 202203, name: 'Q3 2022', rw: 3, type: 'M', year: 2022 },
            { id: 202204, name: 'Q4 2022', rw: 4, type: 'M', year: 2022 }, 
        ]
    }

];


const tgridableDatav2 = [
    {
        DescID: 2, Data: [
        { PeriodID: 202100, Value: 1234678.2563 },
        { PeriodID: 202101, Value: 1234678.2563 },
        { PeriodID: 202102, Value: 2234678.2563 },
        { PeriodID: 202103, Value: 3234678.2563 },
        { PeriodID: 202104, Value: 6234678.2563 },
        { PeriodID: 202105, Value: 4234678.2563 },
        { PeriodID: -1, Value: 5234678.2563 }
    ]
    },
    {
        DescID: 3, Data: [
            { PeriodID: 202100, Value: 1234678.2563 },
        { PeriodID: 202101, Value: 1234678.2563 },
        { PeriodID: 202102, Value: 2234678.2563 },
        { PeriodID: 202103, Value: 3234678.2563 },
        { PeriodID: 202104, Value: 6234678.2563 },
        { PeriodID: 202105, Value: 4234678.2563 },
        { PeriodID: -1, Value: 5234678.2563 }]
    },
    {
        DescID: 4, Data: [
        { PeriodID: 202100, Value: .2563343 },
        { PeriodID: 202101, Value: .82563343 },
        { PeriodID: 202102, Value: .32563343 },
        { PeriodID: 202103, Value: .22563343 },
        { PeriodID: 202104, Value: .32563343 },
        { PeriodID: 202105, Value: .52563343 },
        { PeriodID: 2020106, Value: .62563343 }]
    },
];



const pnlgridDatamaster = {
    filtertype: [
        { id: '1', value: 'Default', isdefault: true },
        { id: '2', value: 'Monthly', isdefault: false },
        { id: '3', value: 'Quarterly', isdefault: false },
    ],
    year: [
        { id: '2020', value: '2020', isdefault: false },
        { id: '2021', value: '2021', isdefault: true },
        { id: '2022', value: '2022', isdefault: false },
    ],
    fx: [
        { id: '1', value: 'Costant', isdefault: true },
        { id: '2', value: 'Reported', isdefault: false }
    ],
    dol: [
        { id: '1000', value: '$K', isdefault: true },
        { id: '1000000', value: 'Mn', isdefault: false },
        { id: '100000000', value: 'Bn', isdefault: false },
    ],
    header: [
        { PeriodID: 0, PeriodType: 'YTD', PeriodName: 'YTD 2021', Show: true },
        { PeriodID: 1, PeriodType: 'M', PeriodName: 'Jan 2021', Show: true },
        { PeriodID: 2, PeriodType: 'M', PeriodName: 'Feb 2021', Show: true },
        { PeriodID: 3, PeriodType: 'M', PeriodName: 'Mar 2021', Show: true },
        { PeriodID: 4, PeriodType: 'M', PeriodName: 'Apr 2021', Show: true },
        { PeriodID: 5, PeriodType: 'M', PeriodName: 'May 2021', Show: true },
        { PeriodID: 6, PeriodType: 'M', PeriodName: 'Jun 2021', Show: true },
        { PeriodID: 7, PeriodType: 'M', PeriodName: 'Jul 2021', Show: false },
        { PeriodID: 8, PeriodType: 'M', PeriodName: 'Aug 2021', Show: false },
        { PeriodID: 9, PeriodType: 'M', PeriodName: 'Sep 2021', Show: false },
        { PeriodID: 10, PeriodType: 'M', PeriodName: 'Oct 2021', Show: false },
        { PeriodID: 11, PeriodType: 'M', PeriodName: 'Nov 2021', Show: false },
        { PeriodID: 12, PeriodType: 'M', PeriodName: 'Dec 2021', Show: false },
        { PeriodID: -1, PeriodType: 'FY', PeriodName: 'FY 2021', Show: true }
    ],
    desc: [
        { DescID: 1, Desc: 'Forecast', Type: 'H', Format: '' },
        { DescID: 2, Desc: 'Rev $', Type: 'D', Format: '$' },
        { DescID: 3, Desc: 'Cost $', Type: 'D', Format: '$' },
        { DescID: 4, Desc: 'CP %', Type: 'D', Format: '%' },
        { DescID: 5, Desc: 'Adjustment', Type: 'H', Format: '' },
        { DescID: 6, Desc: 'Rev $', Type: 'D', Format: '$' },
        { DescID: 7, Desc: 'Cost $', Type: 'D', Format: '$' },
        { DescID: 8, Desc: 'CP %', Type: 'D', Format: '%' }
    ]
};

const tgridableData = [
    { DescID: 2, Data: [{ PeriodID: 0, Value: 1234678.2563 }, { PeriodID: 1, Value: 1234678.2563 }, { PeriodID: 2, Value: 1234678.2563 }, { PeriodID: 5, Value: 1234678.2563 }, { PeriodID: -1, Value: 1234678.2563 }] },
    { DescID: 3, Data: [{ PeriodID: 0, Value: 1234678.2563 }, { PeriodID: 1, Value: 1234678.2563 }, { PeriodID: 2, Value: 1234678.2563 }, { PeriodID: 5, Value: 1234678.2563 }] },
    { DescID: 4, Data: [{ PeriodID: 0, Value: .2563343 }, { PeriodID: 1, Value: .32563343 }, { PeriodID: 2, Value: .52563343 }, { PeriodID: 6, Value: .62563343 }] },
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/roles') && method === 'GET':
                    return userroles();
                case url.endsWith('/master/serviceline') && method === 'GET':
                    return servicelines();
                case url.endsWith('/pandl/summary') && method === 'POST':
                    return getPandlSummary();
                case url.endsWith('/master/buckettype') && method === 'POST':
                    return getMasterBucketType();
                case url.endsWith('/pandl/gridmaster') && method === 'POST':
                    return getGridmaster();
                case url.endsWith('/pandl/griddata') && method === 'POST':
                    return getGridData();
                case url.endsWith('/pandl2/gridmaster') && method === 'POST':
                    return getGridmasterv2();
                case url.endsWith('/pandl2/griddata') && method === 'POST':
                    return getGridDatav2();

                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }

        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username);
            console.log(body,user,username);
            if (!user) return error('Username or password is incorrect');

            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isproxy:user.isProxy,
                token: `fake-jwt-token.${user.id}`
            });
        }

        function userroles() {
            if (!isLoggedIn()) return unauthorized();

            // only admins can access other user records
            if (!isAdmin() && currentUser()?.id !== idFromUrl()) return unauthorized();

            const user = users.find(x => x.id === currentUser()?.id);
            return ok(user?.roles);
        }

        function servicelines() {
            if (!isLoggedIn()) return unauthorized();
            return ok(servicelinesArr);
        }

        function getPandlSummary() {
            if (!isLoggedIn()) return unauthorized();
            return ok(pnlSummarylist);
        }

        function getMasterBucketType() {
            if (!isLoggedIn()) return unauthorized();
            return ok(ddlBucketType);
        }

        function getGridmaster() {
            if (!isLoggedIn()) return unauthorized();
            return ok(pnlgridDatamaster);
        }

        function getGridmasterv2() {
            if (!isLoggedIn()) return unauthorized();
           
            return ok(gridMasterDataV2);
        }

        function getGridDatav2() {
            if (!isLoggedIn()) return unauthorized();
          
            return ok({
                desc: gridMDescription,
                header: gridFilterPeriods.find(f => f.filtertype == body.filterType)?.periods?.filter(f => f.year == body.year),
                data: tgridableDatav2
            });
        }

        function getGridData() {
            if (!isLoggedIn()) return unauthorized();
            return ok(tgridableData);
        }

        function getUsers() {
            if (!isAdmin()) return unauthorized();
            return ok(users);
        }

        function getUserById() {
            if (!isLoggedIn()) return unauthorized();

            // only admins can access other user records
            if (!isAdmin() && currentUser()?.id !== idFromUrl()) return unauthorized();

            const user = users.find(x => x.id === idFromUrl());
            return ok(JSON.stringify(users));
        }

        // helper functions

        function ok(body: any) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'unauthorized' } });
        }

        function error(message: string) {
            return throwError({ status: 400, error: { message } });
        }

        function isLoggedIn() {
            const authHeader = headers.get('Authorization') || '';
            return authHeader.startsWith('Bearer fake-jwt-token');
        }

        function isAdmin() {
            return isLoggedIn() && currentUser()?.role === Role.Admin;
        }

        function currentUser() {
            if (!isLoggedIn()) return;
            const id = parseInt((headers.get('Authorization') || '').split('.')[1]);
            return users.find(x => x.id === id);
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};