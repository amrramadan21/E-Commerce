import { Routes } from '@angular/router';
import { NotFoundPageComponent } from './features/static/not-found-page/not-found-page.component';
import { GuestLayoutComponent } from './core/layouts/guest-layout/guest-layout.component';
import { Auth_Routes } from './features/auth/auth.routes';
import { Products_Routes } from './features/products/products.routes';
import { Home_routes } from './features/home/home.routes';
import { Checkout_Routes } from './features/checkout/checkout.routes';
import { Brand_Routes } from './features/brands/brands.routes';
import { Categorise_Routes } from './features/categories/categories.routes';
import { Cart_Routes } from './features/cart/cart.routes';
import { Wishlist_Routes } from './features/wishlist/wishlist.routes';
import { authGuard } from './core/guards/auth.guard';
import { loggedGuard } from './core/guards/logged.guard';
import { AllOrdersPageComponent } from './features/checkout/pages/all-order-page/all-order-page.component';
import { ProfilePageComponent } from './features/static/profile-page/profile-page.component';

export const routes: Routes = [
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      {
        path: '',
        children: Home_routes,
      },
      {
        path: 'products',
        children: Products_Routes,
      },
      {
        path: 'brands',
        children: Brand_Routes,
      },
      {
        path: 'categories',
        children: Categorise_Routes,
      },
      {
        path: 'cart',
        children: Cart_Routes,
      },
      {
        path: 'wishlist',
        canActivate: [authGuard],
        children: Wishlist_Routes,
      },
      {
        path: 'checkout',
        canActivate: [authGuard],
        children: Checkout_Routes,
      },
      {
        path: 'allorders',
        canActivate: [authGuard],
        component: AllOrdersPageComponent,
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        component: ProfilePageComponent,
      },
      {
        path: '',
        canActivate: [loggedGuard],
        children: Auth_Routes,
      },
    ],
  },

  {
    path: 'not-found',
    component: NotFoundPageComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];