import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostDemandedTimeComponent } from './most-demanded-time.component';

describe('MostDemandedTimeComponent', () => {
  let component: MostDemandedTimeComponent;
  let fixture: ComponentFixture<MostDemandedTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostDemandedTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostDemandedTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
