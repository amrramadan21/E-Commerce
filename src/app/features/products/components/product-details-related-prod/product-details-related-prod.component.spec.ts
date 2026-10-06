import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsRelatedProdComponent } from './product-details-related-prod.component';

describe('ProductDetailsRelatedProdComponent', () => {
  let component: ProductDetailsRelatedProdComponent;
  let fixture: ComponentFixture<ProductDetailsRelatedProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsRelatedProdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsRelatedProdComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
