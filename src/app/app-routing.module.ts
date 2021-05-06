import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LineageTreeComponent } from 'src/app/component/tree/lineage/lineage-tree/lineage-tree.component'
import { BinaryTreeComponent } from 'src/app/component/tree/binary/binary-tree/binary-tree.component'
import { ElementsComponent } from './elements/elements.component'  //임시 삭제바람.

import { TransactionStatusComponent } from 'src/app/component/transaction-status/transaction-status.component';
import { UserSalesRewardSearchComponent } from 'src/app/component/user-sales-reward-search/user-sales-reward-search.component';
import { AllUserSalesComponent } from 'src/app/component/all-user-sales/all-user-sales.component'

const routes: Routes = [
  { path: 'com/transaction-status', component: TransactionStatusComponent },
  { path: 'com/user-sales-reward-search', component: UserSalesRewardSearchComponent},
  { path: 'com/all-user-sales', component: AllUserSalesComponent} ,

  { path: '', component: ElementsComponent },  //임시 삭제바람
  { path: 'com/marketing/lineageTree', component: LineageTreeComponent },
  { path: 'com/marketing/binaryTree', component: BinaryTreeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
