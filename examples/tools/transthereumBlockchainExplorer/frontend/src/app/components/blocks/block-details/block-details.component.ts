import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockService } from 'src/app/core/api/blocks/block.service';
import { Block } from 'src/app/core/api/blocks/block.interfaces';

@Component({
  selector: 'app-block-details',
  templateUrl: './block-details.component.html',
  styleUrls: ['./block-details.component.scss']
})
export class BlockDetailsComponent implements OnInit {
  blockHeight: number = null;
  timeStamp: number = null;
  blockHash: string = null;
  transactionCount: number = null;

  constructor(private router: Router, private route: ActivatedRoute, private blockService: BlockService) {
  }

  ngOnInit(): void {
    this.initialize();
    this.loadData();
  }

  initialize(): void {
    this.blockHeight = Number(this.route.snapshot.paramMap.get('blockHeight'));
  }

  loadData(): void {
    this.blockService.get(this.blockHeight).subscribe(
      (response: Block) => this.patchValue(response),
      error => this.onError(error)
    );
  }

  patchValue(data: Block): void {
    this.timeStamp = data.timeStamp;
    this.blockHash = data.blockHash;
    this.transactionCount = data.transactionCount;
  }

  onError(error) {
    this.router.navigate(['404']);
  }
}
