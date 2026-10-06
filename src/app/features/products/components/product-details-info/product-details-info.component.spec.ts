import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsInfoComponent } from './product-details-info.component';

describe('ProductDetailsInfoComponent', () => {
  let component: ProductDetailsInfoComponent;
  let fixture: ComponentFixture<ProductDetailsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsInfoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
