import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UriFactory, UriBuilder } from '../../http/uri-builder';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Block } from './block.interfaces';

@Injectable({providedIn: 'root'})
export class BlockService {

  constructor(private httpClient: HttpClient, private uriFactory: UriFactory) {
  }

  get(blockHeight: number): Observable<Block> {
    const url = this.getControllerUri().join(blockHeight.toString()).build();

    return this.httpClient.get<Block>(url);
  }

  getLatest(): Observable<Block[]> {
    const url = this.getControllerUri().join('latest5').build();

    return this.httpClient.get<Block[]>(url);
  }

  private getControllerUri(): UriBuilder {
    return this.uriFactory
        .createBuilder(environment.backendApi)
        .join('explorer')
        .join('blocks');
  }
}
