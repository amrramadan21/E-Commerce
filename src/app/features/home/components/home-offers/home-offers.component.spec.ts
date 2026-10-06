import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOffersComponent } from './home-offers.component';

describe('HomeOffersComponent', () => {
  let component: HomeOffersComponent;
  let fixture: ComponentFixture<HomeOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeOffersComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
