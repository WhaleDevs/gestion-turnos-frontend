import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorRouteNotExistComponent } from './error-route-not-exist.component';

describe('ErrorRouteNotExistComponent', () => {
  let component: ErrorRouteNotExistComponent;
  let fixture: ComponentFixture<ErrorRouteNotExistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorRouteNotExistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorRouteNotExistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
