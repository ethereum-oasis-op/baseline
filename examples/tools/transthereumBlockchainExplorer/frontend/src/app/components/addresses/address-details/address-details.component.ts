import { Component, OnInit } from '@angular/core';
import { TokenBalance, Address } from 'src/app/core/api/addresses/address.interfaces';
import { Transaction } from 'src/app/core/api/transactions/transaction.interfaces';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AddressService } from 'src/app/core/api/addresses/address.service';
import { applyDecimals } from 'src/app/shared/helpers/balance.helper';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.scss']
})
export class AddressDetailsComponent implements OnInit {
  address: string;
  balances: TokenBalance[] = [];
  transactions: Transaction[] = [];

  dataLoaded = false;

  constructor(private router: Router, private route: ActivatedRoute, private addressService: AddressService) {
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.route.params.subscribe((params: Params) => {
      this.dataLoaded = false;
      this.address = params.address;
      this.loadData();
    });
  }

  loadData(): void {
    this.addressService.get(this.address).subscribe(
      (response: Address) => this.patchValue(response),
      error => this.onError(error)
    );
  }

  patchValue(data: Address): void {
    this.address = data.address;
    data.transactions.forEach(t => {
      t.quantity = applyDecimals(t.quantity, 18);
    });
    data.balances.forEach(b => {
      b.amount = applyDecimals(b.amount, b.decimalPlaces);
    });

    this.balances = data.balances;
    this.transactions = data.transactions;
    this.dataLoaded = true;
  }

  onError(error) {
    this.router.navigate(['404']);
  }
}
