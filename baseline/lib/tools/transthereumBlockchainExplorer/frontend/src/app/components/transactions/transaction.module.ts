import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { LatestTransactionsOverviewComponent } from './latest-transactions-overview/latest-transactions-overview.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [TransactionDetailsComponent, LatestTransactionsOverviewComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [LatestTransactionsOverviewComponent]
})
export class TransactionModule { }
