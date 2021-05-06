import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DecimalPipe} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { MaterialModule } from './material/material.module'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GoogleChartsModule } from 'angular-google-charts';
import { PinchZoomModule } from 'ngx-pinch-zoom';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { UserInfoService } from './service/jung/user-info.service';
import { UserPorductMyService } from './service/jung/user-porduct-my.service';

import { ElementsComponent } from './elements/elements.component';

import { LineageTreeComponent } from './component/tree/lineage/lineage-tree/lineage-tree.component';
import { BinaryTreeComponent } from './component/tree/binary/binary-tree/binary-tree.component'



import { BlackService } from 'src/app/service/jiyeon/BlackService';

import { TransactionStatusComponent } from 'src/app/component/transaction-status/transaction-status.component';
import { UserSalesRewardSearchComponent } from 'src/app/component/user-sales-reward-search/user-sales-reward-search.component'
import { AllUserSalesComponent } from 'src/app/component/all-user-sales/all-user-sales.component'
import { NgbdSortableHeader } from 'src/app/component/all-user-sales/sortable.directive';

@NgModule({
  declarations: [
    AppComponent,
    TransactionStatusComponent,
    ElementsComponent,
    LineageTreeComponent,
    BinaryTreeComponent,
    UserSalesRewardSearchComponent,
    AllUserSalesComponent,
    NgbdSortableHeader
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbModule,
    
    MaterialModule,

    GoogleChartsModule,
    PinchZoomModule,
    DragDropModule,
  ],
  providers: [
    UserInfoService,
    UserPorductMyService,
    BlackService,
    DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
