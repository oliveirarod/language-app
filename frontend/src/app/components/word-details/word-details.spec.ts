import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordDetails } from './word-details';

describe('WordDetails', () => {
  let component: WordDetails;
  let fixture: ComponentFixture<WordDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
