import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { Transaction } from 'src/app/core/api/transactions/transaction.interfaces';
import { TransactionService } from 'src/app/core/api/transactions/transaction.service';
import { switchMap } from 'rxjs/operators';
import { applyDecimals } from 'src/app/shared/helpers/balance.helper';

@Component({
  selector: 'app-latest-transactions-overview',
  templateUrl: './latest-transactions-overview.component.html',
  styleUrls: ['./latest-transactions-overview.component.scss']
})
export class LatestTransactionsOverviewComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  dataSource: Transaction[];

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.subscription = timer(0, 10000).pipe(
      switchMap(() => this.transactionService.getLatest())
    ).subscribe(
      response => {
        this.dataSource = response.sort((a, b) => (a.blockHeight > b.blockHeight) ? -1 : ((b.blockHeight > a.blockHeight) ? 1 : 0));
        this.dataSource.forEach(t => {
          t.quantity = applyDecimals(t.quantity, 18);
        })
      },
      error => console.log('error: ', error)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
