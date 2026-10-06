import { Component, inject, OnInit, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { BrandsService, IBrand } from '../../services/brands.service';
import { LoadingDataSpinnerComponent } from '../../../../shared/components/loading-data-spinner/loading-data-spinner.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brands-page',
  imports: [PageHeaderComponent, LoadingDataSpinnerComponent, RouterLink],
  templateUrl: './brands-page.component.html',
  styleUrl: './brands-page.component.css',
})
export class BrandsPageComponent implements OnInit {
  private readonly brandsService = inject(BrandsService);

  breadCrumbs = [{ name: 'Brands', url: ['/brands'] }];
  pageTitle = 'Top Brands';
  pageDescription = 'Shop from your favorite brands';

  allBrands = signal<IBrand[] | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands(): void {
    this.isLoading.set(true);
    this.brandsService.getAllBrands({ limit: 40 }).subscribe({
      next: (response) => {
        this.allBrands.set(response.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}