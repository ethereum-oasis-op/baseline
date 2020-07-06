import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestBlocksOverviewComponent } from './latest-blocks-overview.component';

describe('LatestBlocksOverviewComponent', () => {
  let component: LatestBlocksOverviewComponent;
  let fixture: ComponentFixture<LatestBlocksOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestBlocksOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestBlocksOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
