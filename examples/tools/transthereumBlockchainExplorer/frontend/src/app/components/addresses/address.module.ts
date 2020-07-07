import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddressDetailsComponent],
  imports: [CommonModule, BrowserModule, RouterModule, SharedModule]
})
export class AddressModule { }
