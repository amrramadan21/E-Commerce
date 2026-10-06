import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOrdersPageComponent } from './all-order-page.component';

describe('AllOrdersPageComponent', () => {
  let component: AllOrdersPageComponent;
  let fixture: ComponentFixture<AllOrdersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllOrdersPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllOrdersPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
