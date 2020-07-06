import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestTransactionsOverviewComponent } from './latest-transactions-overview.component';

describe('LatestTransactionsOverviewComponent', () => {
  let component: LatestTransactionsOverviewComponent;
  let fixture: ComponentFixture<LatestTransactionsOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestTransactionsOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestTransactionsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
