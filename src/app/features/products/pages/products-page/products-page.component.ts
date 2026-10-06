import { ViewportScroller } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingDataSpinnerComponent } from '../../../../shared/components/loading-data-spinner/loading-data-spinner.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { IProduct } from '../../interfaces/IAllProductsResponse';
import { ProductsService } from '../../services/products.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products-page',
  imports: [
    PageHeaderComponent,
    NgxPaginationModule,
    LoadingDataSpinnerComponent,
    ProductCardComponent,
  ],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.css',
})
export class ProductsPageComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);

  allProducts = signal<IProduct[] | null>(null);

  pageTitle = 'All Products';
  pageDescription = 'Explore our complete product collection';
  breadCrumbs = [];

  limit = 10;
  page = 1;
  totalProducts = 0;

  category = '';
  brand = '';

  constructor() {
    this.page = +(this.activatedRoute.snapshot.queryParamMap.get('page') ?? 1);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.page = +(params.get('page') ?? 1);
      this.category = params.get('category') ?? '';
      this.brand = params.get('brand') ?? '';
      this.getAllProducts();
    });
  }

  getAllProducts(): void {
    this.allProducts.set(null); // Show loading spinner
    const filter: any = {
      limit: this.limit,
      page: this.page,
    };
    if (this.category) {
      filter.category = this.category;
    }
    if (this.brand) {
      filter.brand = this.brand;
    }

    this.productsService.getAllProducts(filter).subscribe({
      next: (response) => {
        this.totalProducts = response.results;
        this.allProducts.set(response.data);
      },
      error: () => {
        this.allProducts.set([]);
        this.toastr.error('Failed to load products. Please try again.');
      },
    });
  }

  changePage(page: number): void {
    this.page = page;
    this.getAllProducts();
    this.viewportScroller.scrollToPosition([0, 0], { behavior: 'smooth' });
    this.router.navigate([], {
      queryParams: {
        page: this.page,
      },
      queryParamsHandling: 'merge',
    });
  }
}