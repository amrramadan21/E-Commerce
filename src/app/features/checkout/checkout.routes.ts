import { Routes } from '@angular/router';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';

export const Checkout_Routes: Routes = [
  {
    path: ':id',
    component: CheckoutPageComponent,
  },
];