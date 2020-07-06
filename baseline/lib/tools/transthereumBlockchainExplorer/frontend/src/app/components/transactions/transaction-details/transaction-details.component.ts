import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from 'src/app/core/api/transactions/transaction.service';
import { Transaction } from 'src/app/core/api/transactions/transaction.interfaces';
import { applyDecimals } from 'src/app/shared/helpers/balance.helper';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {
  transactionHash: string = null;
  from: string = null;
  to: string = null;
  quantity: string = null;
  blockHeight: number = null;
  timeStamp: string = null;
  status: string = null;
  inputParameters: any = null;

  constructor(private router: Router, private route: ActivatedRoute, private transactionService: TransactionService) {
  }

  ngOnInit(): void {
    this.initialize();
    this.loadData();
  }

  initialize(): void {
    this.transactionHash = this.route.snapshot.paramMap.get('transactionHash');
  }

  loadData(): void {
    this.transactionService.get(this.transactionHash).subscribe(
      (response: Transaction) => this.patchValue(response),
      error => this.onError(error)
    );
  }

  patchValue(data: Transaction): void {
    this.timeStamp = data.timeStamp;
    this.from = data.from;
    this.to = data.to;
    this.quantity = applyDecimals(data.quantity,18);
    this.blockHeight = data.blockHeight;
    this.timeStamp = data.timeStamp;
    this.status = data.status;

    if (data.inputParameters) {
      // tslint:disable-next-line: max-line-length
      data.inputParameters.assetToken.amount = applyDecimals(data.inputParameters.assetToken.amount, data.inputParameters.assetToken.decimalPlaces);
      // tslint:disable-next-line: max-line-length
      data.inputParameters.stableToken.amount = applyDecimals(data.inputParameters.stableToken.amount, data.inputParameters.stableToken.decimalPlaces);
      this.inputParameters = data.inputParameters;
    }
  }

  onError(error) {
    this.router.navigate(['404']);
  }

  get statusName(): string {
    if (!this.status) {
      return '';
    }

    return this.status === '1' ? 'Success' : 'Failure';
  }

  get direction(): string {
    if (!this.inputParameters) {
      return '';
    }
    const assetToken = this.inputParameters.assetToken;

    return `${this.inputParameters.direction === 'Buy' ? 'Buying' : 'Selling'} ${ assetToken.symbol }: ${ assetToken.amount }`;
  }
}
