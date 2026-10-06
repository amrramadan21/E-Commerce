import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { App_Apis } from '../../../core/constants/app-apis';
import { isPlatformBrowser } from '@angular/common';
import { Stored_Keys } from '../../../core/constants/stored-keys';
import { of, Observable } from 'rxjs';
import { switchMap } from 'rxjs';

export interface ICartItem {
  _id: string;
  count: number;
  price: number;
  product: {
    _id: string;
    id: string;
    title: string;
    imageCover: string;
    category: { name: string };
    brand: { name: string };
    ratingsAverage: number;
    slug: string;
  };
}

export interface ICart {
  _id: string;
  cartOwner: string;
  products: ICartItem[];
  totalCartPrice: number;
  totalAfterDiscount?: number;
}

export interface ICartResponse {
  status: string;
  numOfCartItems: number;
  data: ICart;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly platform = inject(PLATFORM_ID);

  numOfCartItems = signal<number>(0);
  cartData = signal<ICart | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platform) && !this.hasToken()) {
      const items = this.getGuestCartItems();
      this.numOfCartItems.set(items.reduce((acc, item) => acc + item.count, 0));
    }
  }

  private hasToken(): boolean {
    if (isPlatformBrowser(this.platform)) {
      return !!localStorage.getItem(Stored_Keys.token);
    }
    return false;
  }

  private getGuestCartItems(): ICartItem[] {
    if (!isPlatformBrowser(this.platform)) return [];
    const cartStr = localStorage.getItem('guest_cart');
    return cartStr ? JSON.parse(cartStr) : [];
  }

  private saveGuestCartItems(items: ICartItem[]): void {
    if (!isPlatformBrowser(this.platform)) return;
    localStorage.setItem('guest_cart', JSON.stringify(items));
    const totalCount = items.reduce((acc, item) => acc + item.count, 0);
    this.numOfCartItems.set(totalCount);
  }

  getUserCart(): Observable<ICartResponse> {
    if (this.hasToken()) {
      return this.http.get<ICartResponse>(App_Apis.cart.base);
    } else {
      const items = this.getGuestCartItems();
      const totalCartPrice = items.reduce((acc, item) => acc + (item.price * item.count), 0);
      const response: ICartResponse = {
        status: 'success',
        numOfCartItems: items.reduce((acc, item) => acc + item.count, 0),
        data: {
          _id: 'guest',
          cartOwner: 'guest',
          products: items,
          totalCartPrice: totalCartPrice
        }
      };
      this.numOfCartItems.set(response.numOfCartItems);
      this.cartData.set(response.data);
      return of(response);
    }
  }

  addToCart(productId: string, product?: any): Observable<ICartResponse> {
    if (this.hasToken()) {
      return this.http.post<ICartResponse>(App_Apis.cart.base, { productId });
    } else {
      const items = this.getGuestCartItems();
      const existingItem = items.find(item => item.product._id === productId);
      if (existingItem) {
        existingItem.count += 1;
      } else {
        if (product) {
          items.push({
            _id: productId,
            count: 1,
            price: product.price,
            product: {
              _id: product._id,
              id: product.id || product._id,
              title: product.title,
              imageCover: product.imageCover,
              category: product.category || { name: '' },
              brand: product.brand || { name: '' },
              ratingsAverage: product.ratingsAverage || 0,
              slug: product.slug || ''
            }
          });
        }
      }
      this.saveGuestCartItems(items);
      const totalCartPrice = items.reduce((acc, item) => acc + (item.price * item.count), 0);
      const response: ICartResponse = {
        status: 'success',
        numOfCartItems: items.reduce((acc, item) => acc + item.count, 0),
        data: {
          _id: 'guest',
          cartOwner: 'guest',
          products: items,
          totalCartPrice: totalCartPrice
        },
        message: 'Product added successfully to guest cart'
      };
      this.cartData.set(response.data);
      return of(response);
    }
  }

  updateCartItemCount(productId: string, count: number): Observable<ICartResponse> {
    if (this.hasToken()) {
      return this.http.put<ICartResponse>(App_Apis.cart.item(productId), { count });
    } else {
      const items = this.getGuestCartItems();
      const existingItem = items.find(item => item.product._id === productId);
      if (existingItem) {
        existingItem.count = count;
      }
      this.saveGuestCartItems(items);
      const totalCartPrice = items.reduce((acc, item) => acc + (item.price * item.count), 0);
      const response: ICartResponse = {
        status: 'success',
        numOfCartItems: items.reduce((acc, item) => acc + item.count, 0),
        data: {
          _id: 'guest',
          cartOwner: 'guest',
          products: items,
          totalCartPrice: totalCartPrice
        }
      };
      this.cartData.set(response.data);
      return of(response);
    }
  }

  removeCartItem(productId: string): Observable<ICartResponse> {
    if (this.hasToken()) {
      return this.http.delete<ICartResponse>(App_Apis.cart.item(productId));
    } else {
      let items = this.getGuestCartItems();
      items = items.filter(item => item.product._id !== productId);
      this.saveGuestCartItems(items);
      const totalCartPrice = items.reduce((acc, item) => acc + (item.price * item.count), 0);
      const response: ICartResponse = {
        status: 'success',
        numOfCartItems: items.reduce((acc, item) => acc + item.count, 0),
        data: {
          _id: 'guest',
          cartOwner: 'guest',
          products: items,
          totalCartPrice: totalCartPrice
        }
      };
      this.cartData.set(response.data);
      return of(response);
    }
  }

  clearCart() {
    if (this.hasToken()) {
      return this.http.delete<{ message: string }>(App_Apis.cart.base);
    } else {
      this.saveGuestCartItems([]);
      this.cartData.set(null);
      return of({ message: 'success' });
    }
  }

  applyCoupon(couponName: string) {
    return this.http.put<ICartResponse>(App_Apis.cart.applyCoupon, { couponName });
  }

  syncGuestCart(): Observable<any> {
    if (!isPlatformBrowser(this.platform)) return of(null);
    const items = this.getGuestCartItems();
    if (items.length === 0) return of(null);

    // Clear guest cart from localStorage immediately to avoid repeat runs
    localStorage.removeItem('guest_cart');

    let obs$ = of(null) as Observable<any>;
    for (const item of items) {
      obs$ = obs$.pipe(
        switchMap(() => this.http.post<ICartResponse>(App_Apis.cart.base, { productId: item.product._id }).pipe(
          switchMap((res) => {
            if (item.count > 1) {
              return this.http.put<ICartResponse>(App_Apis.cart.item(item.product._id), { count: item.count });
            }
            return of(res);
          })
        ))
      );
    }

    return obs$.pipe(
      switchMap(() => this.getUserCart())
    );
  }
}
