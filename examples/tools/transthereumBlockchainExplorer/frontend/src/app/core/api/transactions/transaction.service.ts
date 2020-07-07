import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UriFactory, UriBuilder } from '../../http/uri-builder';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Transaction } from './transaction.interfaces';

@Injectable({providedIn: 'root'})
export class TransactionService {

  constructor(private httpClient: HttpClient, private uriFactory: UriFactory) {
  }

  get(transactionHash: string): Observable<Transaction> {
    const url = this.getControllerUri().join(transactionHash).build();

    return this.httpClient.get<Transaction>(url);
  }

  getLatest(): Observable<Transaction[]> {
    const url = this.getControllerUri().join('latest').build();

    return this.httpClient.get<Transaction[]>(url);
  }

  private getControllerUri(): UriBuilder {
    return this.uriFactory
        .createBuilder(environment.backendApi)
        .join('explorer')
        .join('transactions');
  }
}
