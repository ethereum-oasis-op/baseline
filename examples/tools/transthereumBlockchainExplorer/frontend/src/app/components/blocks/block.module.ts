import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockDetailsComponent } from './block-details/block-details.component';
import { LatestBlocksOverviewComponent } from './latest-blocks-overview/latest-blocks-overview.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BlockDetailsComponent, LatestBlocksOverviewComponent],
  imports: [CommonModule, RouterModule],
  exports: [LatestBlocksOverviewComponent]
})
export class BlockModule { }
