import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlockModule } from '../blocks/block.module';
import { TransactionModule } from '../transactions/transaction.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, SharedModule, BlockModule, TransactionModule]
})
export class DashboardModule { }
