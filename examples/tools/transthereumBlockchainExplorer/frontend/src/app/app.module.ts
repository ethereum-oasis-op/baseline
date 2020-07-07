import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './_layouts/layout.module';
import { CoreModule } from './core/core.module';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { AddressModule } from './components/addresses/address.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, CoreModule, LayoutModule, DashboardModule, AddressModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
