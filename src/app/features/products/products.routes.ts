import { Routes } from '@angular/router';
import { ProductsPageComponent } from './pages/products-page/products-page.component';
import { ProductDetailsPageComponent } from './pages/product-details-page/product-details-page.component';

export const Products_Routes: Routes = [
  {
    path: '',
    component: ProductsPageComponent,
  },
  {
    path: ':id/:slug',
    component: ProductDetailsPageComponent,
  },
  {
    path: ':id',
    component: ProductDetailsPageComponent,
  },
];