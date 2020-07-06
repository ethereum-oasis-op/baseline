import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layouts/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionDetailsComponent } from './components/transactions/transaction-details/transaction-details.component';
import { BlockDetailsComponent } from './components/blocks/block-details/block-details.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AddressDetailsComponent } from './components/addresses/address-details/address-details.component';

const routes: Routes = [
  { path: '', component: LayoutComponent,
    children:
    [
      { path: '', component: DashboardComponent },
      { path: 'block/:blockHeight', component: BlockDetailsComponent },
      { path: 'transaction/:transactionHash', component: TransactionDetailsComponent },
      { path: 'address/:address', component: AddressDetailsComponent },
      { path: '404', component: NotFoundComponent},
      { path: '**', redirectTo: '/404'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
