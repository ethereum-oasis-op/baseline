import { Injectable } from '@angular/core';

export class UriBuilder {
  constructor(private uri: string) {}

  public join(path: string): UriBuilder {
    this.uri = `${this.uri}/${path}`;
    return this;
  }

  public build() {
    return this.uri;
  }
}

@Injectable()
export class UriFactory {
  createBuilder(uri: string) {
    return new UriBuilder(uri);
  }
}
