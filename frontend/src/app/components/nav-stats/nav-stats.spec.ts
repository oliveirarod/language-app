import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavStats } from './nav-stats';

describe('NavStats', () => {
  let component: NavStats;
  let fixture: ComponentFixture<NavStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavStats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
