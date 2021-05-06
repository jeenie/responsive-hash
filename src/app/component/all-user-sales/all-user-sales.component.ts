import { Component, Directive, EventEmitter, Input, Output, PipeTransform, QueryList, ViewChild, ViewChildren, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Typeahead
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

//auto-complement
import {BehaviorSubject, merge, Observable, of, Subject} from 'rxjs';
import {debounceTime, delay, distinctUntilChanged, filter, map, startWith, switchMap, tap} from 'rxjs/operators';

// search form
import { FormControl } from '@angular/forms';

import { DecimalPipe } from '@angular/common';

import {SortColumn, SortDirection, SortEvent} from './sortable.directive';

//Service
import { BlackService } from '../../service/jiyeon/BlackService'

//VO List
import { UserProductVO } from 'src/app/model/jiyeon/UserProductVO';
import { UserSalesVO } from 'src/app/model/jiyeon/UserSalesVO';
import { UserInfoVO } from 'src/app/model/jiyeon/UserInfoVO';
import { UserProductSimpleVO } from 'src/app/model/jiyeon/UserProductSimpleVO';
import { UserSalesRewardVO } from 'src/app/model/jiyeon/UserSalesRewardVO';


interface SearchResult {
    allUserSalesList: UserSalesVO[];
    total: number;
}

interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(allUserSalesData: UserSalesVO[], column: SortColumn, direction: string): UserSalesVO[] {
    if (direction === '' || column === '') {
      return allUserSalesData;
    } else {
      return [...allUserSalesData].sort((a, b) => {
        let res = compare(a.userId, b.userId);;
                if(column == 'userId') {
                    res = compare(a.userId, b.userId);
                } else if(column == 'totalCoin') {
                    res = compare(a.totalCoin, b.totalCoin);
                } else {
                    res = compare(a.totalUsd, b.totalUsd)
                }
            
                return direction === 'asc' ? res : -res;
      });
    }
}

function matches(userSales: UserSalesVO, term: string, pipe: PipeTransform) {
    return userSales.userId.toLowerCase().includes(term.toLowerCase())
      || pipe.transform(userSales.totalCoin).includes(term)
      || pipe.transform(userSales.totalUsd).includes(term);
}

const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

@Directive({
    selector: 'th[sortable]',
    host: {
      '[class.asc]': 'direction === "asc"',
      '[class.desc]': 'direction === "desc"',
      '(click)': 'rotate()'
    }
})
export class NgbdSortableHeader {

    @Input() sortable: SortColumn = '';
    @Input() direction: SortDirection = '';
    @Output() sort = new EventEmitter<SortEvent>();
  
    rotate() {
      this.direction = rotate[this.direction];
      this.sort.emit({column: this.sortable, direction: this.direction});
    }
  }


@Component({
    selector: 'app-user-sales-reward-search',
    templateUrl: './all-user-sales.component.html',
    styleUrls: ['./all-user-sales.component.css']
})

@Injectable({providedIn: 'root'})
export class AllUserSalesComponent{
    userInfoList: UserInfoVO[]=[];
    userProductList: UserProductVO[];
    userProductInfoList: UserProductSimpleVO[] = [];
    ratio = [0.05,0.04,0.03,0.02,0.01];

    userSalesRealData: UserSalesVO[] = [];
    //userSalesRealDataPagination: Observable<UserSalesVO[]>;

    allUserSalesList: Observable<UserSalesVO[]>;
    allUserSalesListTotal$: Observable<number>;
    

    userSalesAllList: UserSalesRewardVO[] = [];
    userRewardRealDataPagination:UserSalesRewardVO[] = [];

    totalCoin!:number;
    totalUsd!:number;

    options: string[] = [];
    filteredOptions: Observable<string[]> | undefined;

    allTotalUsd=0;
    allTotalCoin=0;

    userIdList: string[] =[];

    // sort
    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader> | any;
    @ViewChildren(NgbdSortableHeader) rewardHeaders: QueryList<NgbdSortableHeader> | any;

    //pagination
    collectionSize=0
    rewardCollectionSize = 0;

    // search
    model: any;
    
    @ViewChild('instance', {static: true}) instance: NgbTypeahead | any;
    focus$ = new Subject<string>();
    click$ = new Subject<string>();

    search = (text$: Observable<string>) => {
        const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
        const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
        const inputFocus$ = this.focus$;
    
        return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
          map(term => (term === '' ? this.userIdList
            : this.userIdList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
        );
    }

    filter = new FormControl('');

    searchUserId(text: string, pipe: PipeTransform): UserSalesVO[] {
        return this.userSalesAllList.filter(userSale => {
          const term = text.toLowerCase();
          return userSale.userId.toLowerCase().includes(term)
              || pipe.transform(userSale.totalCoin).includes(term)
              || pipe.transform(userSale.totalUsd).includes(term);
        });
    }

    private _loading$ = new BehaviorSubject<boolean>(true);
    private _search$ = new Subject<void>();
    private _allUserSalesList$ = new BehaviorSubject<UserSalesVO[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    private _state: State = {
        page: 1,
        pageSize: 20,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    

    constructor(private http: HttpClient, private BlackService: BlackService, private pipe: DecimalPipe) {
        
        this.userProductList =[];
        this.getUserProductList();
        this.getUserInfoList();
        
        this.totalCoin = 0;
        this.totalUsd = 0;

        this._search$.pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._search()),
            delay(200),
            tap(() => this._loading$.next(false))
        ).subscribe(result => {
            this._allUserSalesList$.next(result.allUserSalesList);
            this._total$.next(result.total);
        });
      
        this._search$.next();

        
        
        this.allUserSalesList = this.allUserSalesList$;
        this.allUserSalesListTotal$ =this.total$;
    }

    get allUserSalesList$() { return this._allUserSalesList$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }
    get searchTerm() { return this._state.searchTerm; }
    
    set page(page: number) { this._set({page}); }
    set pageSize(pageSize: number) { this._set({pageSize}); }
    set searchTerm(searchTerm: string) { this._set({searchTerm}); }
    set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
    set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    private _search(): Observable<SearchResult> {
        const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
    
        // 1. sort
        let allUserSalesList = sort(this.userSalesRealData, sortColumn, sortDirection);
    
        // 2. filter
        const total = allUserSalesList.length;
    
        // 3. paginate
        allUserSalesList = allUserSalesList.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of({allUserSalesList, total});
    }

    // service 에서 사용자 정보 불러오기
    getUserInfoList() {
        this.BlackService.getUserInfoJson().subscribe(response =>{
            let JsonArray: any[];
            JsonArray = Object.values(response);

            //userInfoList 생성
            for(let i = 0; i < JsonArray.length; i++) {
                var item = new UserInfoVO(JsonArray[i]['USER_ID'], JsonArray[i]['USER_NAME'], JsonArray[i]['USER_PHONE'], JsonArray[i]['USER_EMAIL'], JsonArray[i]['USER_PHONE_CN'], JsonArray[i]['REC_USER'], JsonArray[i]['REC_DIR'], JsonArray[i]['USER_L'], JsonArray[i]['USER_R'], JsonArray[i]['REG_DATE']);
                this.userInfoList.push(item);
            }  
            this.makeNewUserProductList();
            this.getUserId();
        })
    }
    
    getUserId() {
        for(let i = 0; i <this.userInfoList.length; i++) {
            this.userIdList.push(this.userInfoList[i].USER_ID);
        }
        this.userIdList.sort((a: string, b: string) => {
            return b > a? -1:1;
        })
        //console.log("사용자 아이디 목록")
        //console.log(this.userIdList)
    }

    getUserProductList() {
        this.BlackService.getUserProductJson().subscribe(response =>{
            let JsonArray: any[];
            JsonArray = Object.values(response);

            //userInfoList 생성
            for(let i = 0; i < JsonArray.length; i++) {
                var item = new UserProductVO(JsonArray[i]['PT_CODE'], JsonArray[i]['USER_ID'], JsonArray[i]['PRODUCT_CD'], JsonArray[i]['PRODUCT_TYPE'], JsonArray[i]['PRODUCT_STATE'], JsonArray[i]['PRODUCT_THS'], new Date(JsonArray[i]['AP_DATE']), JsonArray[i]['GD_DATE'], JsonArray[i]['ST_COIN'], JsonArray[i]['CRT_USD'], JsonArray[i]['AUTO_SHIP'], new Date(JsonArray[i]['REG_DATE']), JsonArray[i]['REG_USER'], new Date(JsonArray[i]['UP_DATE']), JsonArray[i]['UP_USER'], JsonArray[i]['USE_FLAG']);
                this.userProductList.push(item);
            }
            this.sumUserSales(this.userProductList);
            
        })
    }

    sumUserSales(list: UserProductVO[]) {
        let userSalesAllData = [];
        let sumCoin = 0;
        let sumUsd = 0;
        for(let i=0; i<list.length; i++) {
            let id = list[i].USER_ID;
            sumCoin = 0;
            sumUsd = 0;
            for(let j=0; j <list.length; j++) {
                if(id === list[j].USER_ID && list[j].PRODUCT_STATE == 'G') {
                    var num : number =+ list[j].ST_COIN;
                    sumCoin += num;

                    var num2 : number =+ list[j].CRT_USD;
                    sumUsd += num2;
                }
            }
            //console.log(sumCoin);
            //console.log(sumUsd);

            var item = new UserSalesVO(id, sumCoin, sumUsd);
            userSalesAllData.push(item);
        }        

        userSalesAllData.sort((a:UserSalesVO, b:UserSalesVO) => {
            return a.userId < b.userId ? -1: 1;
        })
        //userSalesAllData = userSalesAllData.filter((thing, i, arr) => arr.findIndex(t=> t.userId === thing.userId));

        for(let i = 0; i < userSalesAllData.length - 1; i++) {
            if(userSalesAllData[i].userId != userSalesAllData[i+1].userId) {
                this.userSalesRealData.push(userSalesAllData[i]);
            }
        }

        //this.dataSource.data = this.userSalesRealData;
        
        
        this.userSalesRealData.sort((a:UserSalesVO, b:UserSalesVO) => {
            return b.totalCoin - a.totalCoin ;
        })
        let userSalesBest = [];

        for(let i = 0; i< 10; i++ ) {
            userSalesBest.push(this.userSalesRealData[i])
        }

        //this.dataSource2.data = userSalesBest;


        // 전체 매출
        this.totalCoin = 0;
        this.totalUsd =0;
        for(let i = 0; i < this.userSalesRealData.length; i++) {
            var num : number =+ this.userSalesRealData[i].totalCoin;
            this.totalCoin += num;
            var num2 : number =+ this.userSalesRealData[i].totalUsd;
            this.totalUsd += num2;
        }
        //console.log(this.totalUsd)

        this.options = this.getFilterObject(this.userSalesRealData);
        //console.log(this.userSalesRealData.length)
        this.userSalesRealData.sort((a:UserSalesVO, b:UserSalesVO) => {
            return a.userId < b.userId? -1:1;
        })
        //this.refreshUserSalesData();
    }

    /*
    // 여기부터 수정 악악악
    refreshUserSalesData() {
        this.collectionSize = this.userSalesRealData.length;
        //console.log(this.userSalesRealData);
        this.userSalesRealDataPagination = this.userSalesRealData.map((userSales, i) => ({id: i+1, ...userSales}))
        .slice((this.page - 1) * this.pageSize, (this.page -1) * this.pageSize + this.pageSize);
        //console.log(this.userSalesRealDataPagination);

    }
    */

    

    onSort({column, direction}: SortEvent) {
        // resetting other headers
    this.headers.forEach((header: { sortable: string; direction: string; }) => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });
  
      this.sortColumn = column;
      this.sortDirection = direction;
        
    }

    getFilterObject(fullobj: UserSalesVO[]) {
        const uniqChk: string[] = [];
        fullobj.filter((obj) => {
            if(!uniqChk.includes(obj.userId)) {
                uniqChk.push(obj.userId);
            }
            return obj;
        });

        return uniqChk.sort((a: string, b: string) => {
            return (b.toLowerCase() > a.toLowerCase() ? -1: 1);
        });
    }

    makeNewUserProductList() {
        for(let i = 0; i < this.userInfoList.length; i++) {
            
            //console.log(this.userInfoList[i].USER_ID)
            for(let j = 0; j < this.userProductList.length; j++) {
                //console.log(this.userProductList[j].USER_ID)
                if(this.userInfoList[i].USER_ID == this.userProductList[j].USER_ID) {
                    //console.log(this.userInfoList[i].USER_ID)
                    var item = new UserProductSimpleVO(this.userProductList[j].PT_CODE,
                                                       this.userInfoList[i].USER_ID, 
                                                       this.userProductList[j].PRODUCT_TYPE, 
                                                       this.userProductList[j].PRODUCT_STATE, 
                                                       this.userProductList[j].PRODUCT_THS, 
                                                       this.userProductList[j].ST_COIN, 
                                                       this.userProductList[j].CRT_USD, 
                                                       this.userProductList[j].REG_DATE, 
                                                       this.userInfoList[i].REC_USER);
                    this.userProductInfoList.push(item);
                }   
            }
        }
        //console.log(this.userProductInfoList);
        this.makeUserRelation(this.userProductInfoList);
    }

    makeUserRelation(list:UserProductSimpleVO[]) {
        let child =[]; //UserProductSimpleVO : 세대별 생성후 relationArray로 push
        let relationArray = []; // UserProductSimpleVO [][] : 1~5세대 생성
        let allRelationArray = [];

        var bigCoin =0;
        var bigUsd =0;

        for(let i = 0; i < list.length; i++) {
            child = [];
            for(let j = 0; j < list.length; j++) {
                if(list[i].USER_ID === list[j].REG_USER) {

                    child.push(list[j]);
                } 
            }
            relationArray.push(child);

            for(let h = 1; h < 5; h++) {
                child= [];
                for(let j = 0; j < relationArray[h-1].length; j++) {
                    for(let k =0; k < list.length; k++) {
                        if(relationArray[h-1][j].USER_ID === list[k].REG_USER) {
                            child.push(list[k]);
                        }
                    }
                }
                // ptcode로 소트하고
                // 옆에랑 다르면 push
                let childs=[]
                child.sort((a:UserProductSimpleVO, b:UserProductSimpleVO)=> {
                    return a.PT_CODE < b.PT_CODE? -1: 1;
                })
                for(let i =0; i <child.length; i++) {
                    if(i==child.length-1) {
                        childs.push(child[i])
                    }else {
                        if(child[i].PT_CODE != child[i+1].PT_CODE) {
                            childs.push(child[i])
                        }
                    }
                }
                //childs.push(child[child.length-1])
                relationArray.push(childs);
            }
            
            var ratio = [0.05, 0.04, 0.03, 0.02, 0.01];

            bigCoin = 0;
            bigUsd = 0;
            var sumCoin=0;
            var sumUsd=0;
            for(let l=0; l<relationArray.length; l++) { // 5번
                sumCoin=0;
                sumUsd=0;
                for(let m=0; m<relationArray[l].length; m++) { // 각 세대 별로
                    var num: number = + relationArray[l][m].ST_COIN;
                    sumCoin+= num;
                    var num2: number = + relationArray[l][m].CRT_USD;
                    sumUsd+= num2;
                }
                
                bigCoin += sumCoin * ratio[l]
                bigUsd += sumUsd * ratio[l]
            }
            this.userSalesAllList.push(new UserSalesRewardVO(list[i].USER_ID, bigCoin, bigUsd, relationArray));
            relationArray = [];
        }
        this.userSalesAllList.sort((a:UserSalesRewardVO, b:UserSalesRewardVO) => {
            return b.totalUsd - a.totalUsd;
        })

        
          
        this.userSalesAllList = this.userSalesAllList.filter((thing, i, arr) => arr.findIndex(t => t.userId === thing.userId) === i)
        this.userSalesAllList.sort((a:UserSalesRewardVO, b:UserSalesRewardVO) => {
            return a.userId < b.userId ? -1: 1;
        })
        //this.dataSource.data = this.userSalesAllList;
        

        this.allTotalUsd = 0;
        this.allTotalCoin = 0;
        for(let a=0; a < this.userSalesAllList.length; a++) {
            var num: number = + this.userSalesAllList[a].totalUsd
            this.allTotalUsd +=num;
            var num2: number = + this.userSalesAllList[a].totalCoin
            this.allTotalCoin+=num2;
        }

        console.log(this.allTotalUsd);
        console.log(this.allTotalCoin);

        this.userSalesAllList.sort((a:UserSalesRewardVO, b:UserSalesRewardVO) => {
            return b.totalCoin - a.totalCoin ;
        })

        let userRewardBest = [];
        for(let i = 0; i< 10; i++ ) {
            userRewardBest.push(this.userSalesAllList[i])
        }
        //this.dataSource2.data = userRewardBest;
        this.options = this.getFilterObject(this.userSalesAllList);

        console.log(this.userSalesAllList);


        this.userSalesAllList.sort((a:UserSalesRewardVO, b:UserSalesRewardVO) => {
            return b.userId > a.userId? -1:1 ;
        })
        this.refreshUserRewardData()

    }

    onRewardSort({column, direction}: SortEvent) {

        // resetting other headers
        this.rewardHeaders.forEach((header: { sortable: string; direction: string; }) => {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });

        // sorting countries
        if (direction === '' || column === '') {
            this.userSalesAllList = this.userSalesAllList;
        } else {
            this.userSalesAllList = [...this.userSalesAllList].sort((a, b) => {
                let res = compare(a.userId, b.userId);;
                if(column == 'userId') {
                    res = compare(a.userId, b.userId);
                } else if(column == 'totalCoin') {
                    res = compare(a.totalCoin, b.totalCoin);
                } else {
                    res = compare(a.totalUsd, b.totalUsd)
                }
            
                return direction === 'asc' ? res : -res;
            });
        }
    }

    refreshUserRewardData() {
        this.rewardCollectionSize = this.userSalesAllList.length;
        //console.log(this.userSalesRealData);
        this.userRewardRealDataPagination = this.userSalesAllList.map((userSales, i) => ({id: i+1, ...userSales}))
        .slice((this.page - 1) * this.pageSize, (this.page -1) * this.pageSize + this.pageSize);
        //console.log(this.userSalesRealDataPagination);

    }

    submit() {
        
        this._search$.pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._searchId()),
            delay(200),
            tap(() => this._loading$.next(false))
        ).subscribe(result => {
            console.log(result.allUserSalesList);
            this._allUserSalesList$.next(result.allUserSalesList);
            this._total$.next(result.total);
        });
        
        
        
    }

    _searchId() {
        console.log(this._state)
        const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
    
        // 1. sort
        let allUserSalesList = sort(this.userSalesRealData, sortColumn, sortDirection);
    
        // 2. filter
        allUserSalesList = allUserSalesList.filter(country => matches(country, searchTerm, this.pipe));
        const total = allUserSalesList.length;
    
        // 3. paginate
        allUserSalesList = allUserSalesList.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

        console.log(allUserSalesList)
        return of({allUserSalesList, total});
    }
}