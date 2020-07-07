import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UriFactory, UriBuilder } from '../../http/uri-builder';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address } from './address.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private httpClient: HttpClient, private uriFactory: UriFactory) {
  }

  get(address: string): Observable<Address> {
    const url = this.getControllerUri().join(address).build();

    return this.httpClient.get<Address>(url);
  }

  private getControllerUri(): UriBuilder {
    return this.uriFactory
        .createBuilder(environment.backendApi)
        .join('explorer')
        .join('address');
  }
}
