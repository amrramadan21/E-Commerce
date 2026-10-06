import { Component, inject, OnInit, signal } from '@angular/core';
import { LoadingDataSpinnerComponent } from '../../../../shared/components/loading-data-spinner/loading-data-spinner.component';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { IProduct } from '../../../products/interfaces/IAllProductsResponse';
import { ProductsService } from '../../../products/services/products.service';

@Component({
  selector: 'app-home-products',
  imports: [LoadingDataSpinnerComponent, ProductCardComponent],
  templateUrl: './home-products.component.html',
  styleUrl: './home-products.component.css',
})
export class HomeProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  allProducts = signal<null | IProduct[]>(null);

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.productsService.getAllProducts({ limit: 8 }).subscribe({
      next: (response) => {
        console.log(response);
        this.allProducts.set(response.data);
      },
    });
  }
}