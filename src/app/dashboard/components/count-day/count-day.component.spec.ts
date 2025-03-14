import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountDayComponent } from './count-day.component';

describe('CountDayComponent', () => {
  let component: CountDayComponent;
  let fixture: ComponentFixture<CountDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
