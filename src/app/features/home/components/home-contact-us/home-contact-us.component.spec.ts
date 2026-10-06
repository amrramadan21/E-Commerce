import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeContactUsComponent } from './home-contact-us.component';

describe('HomeContactUsComponent', () => {
  let component: HomeContactUsComponent;
  let fixture: ComponentFixture<HomeContactUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeContactUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeContactUsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
