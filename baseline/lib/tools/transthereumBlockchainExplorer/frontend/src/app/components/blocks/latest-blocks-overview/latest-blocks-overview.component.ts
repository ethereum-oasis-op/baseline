import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { Block } from 'src/app/core/api/blocks/block.interfaces';
import { BlockService } from 'src/app/core/api/blocks/block.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-latest-blocks-overview',
  templateUrl: './latest-blocks-overview.component.html',
  styleUrls: ['./latest-blocks-overview.component.scss']
})
export class LatestBlocksOverviewComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  dataSource: Block[];

  constructor(private blockService: BlockService) { }

  ngOnInit(): void {
    this.subscription = timer(0, 10000).pipe(
      switchMap(() => this.blockService.getLatest())
    ).subscribe(
      response => this.dataSource = response,
      error => console.log('error: ', error)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
