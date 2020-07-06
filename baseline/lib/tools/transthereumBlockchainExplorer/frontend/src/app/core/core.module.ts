import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UriFactory } from './http/uri-builder';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [UriFactory]
})
export class CoreModule { }
