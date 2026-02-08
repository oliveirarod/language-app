import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWords } from './my-words';

describe('MyWords', () => {
  let component: MyWords;
  let fixture: ComponentFixture<MyWords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyWords]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyWords);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
