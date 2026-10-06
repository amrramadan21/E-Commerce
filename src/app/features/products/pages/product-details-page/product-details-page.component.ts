import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductDetailsComponent } from '../../components/product-details/product-details.component';
import { ProductDetailsInfoComponent } from '../../components/product-details-info/product-details-info.component';
import { ProductDetailsRelatedProdComponent } from '../../components/product-details-related-prod/product-details-related-prod.component';
import { BreadCrumbsComponent } from '../../../../shared/components/bread-crumbs/bread-crumbs.component';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../interfaces/IAllProductsResponse';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details-page',
  imports: [
    ProductDetailsComponent,
    ProductDetailsInfoComponent,
    ProductDetailsRelatedProdComponent,
    BreadCrumbsComponent,
  ],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.css',
})
export class ProductDetailsPageComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);

  productId = '';
  productDetails = signal<IProduct | null>(null);
  isLoading = signal(true);

  constructor() {
    this.activatedRoute.paramMap.subscribe((data) => {
      const id = data.get('id');
      if (id) {
        this.productId = id;
        this.getProductDetails();
      }
    });
  }

  ngOnInit(): void {
    // Relying on paramMap subscription in constructor to avoid duplicate calls
  }

  getProductDetails(): void {
    this.isLoading.set(true);
    this.productsService.getProductById(this.productId).subscribe({
      next: (response) => {
        this.productDetails.set(response.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toastr.error('Failed to load product details. Please try again.');
      },
    });
  }
}