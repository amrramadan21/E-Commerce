import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMainSliderComponent } from './home-main-slider.component';

describe('HomeMainSliderComponent', () => {
  let component: HomeMainSliderComponent;
  let fixture: ComponentFixture<HomeMainSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeMainSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeMainSliderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
