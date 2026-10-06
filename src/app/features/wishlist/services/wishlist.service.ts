import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { App_Apis } from '../../../core/constants/app-apis';

export interface IWishlistProduct {
  _id: string;
  id: string;
  title: string;
  imageCover: string;
  price: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  slug: string;
  category: { name: string };
  brand?: { name: string };
}

export interface IWishlistResponse {
  status: string;
  message: string;
  data: IWishlistProduct[];
}

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly http = inject(HttpClient);

  wishlistIds = signal<Set<string>>(new Set());
  wishlistProducts = signal<IWishlistProduct[]>([]);

  getWishlist() {
    return this.http.get<IWishlistResponse>(App_Apis.wishlist.base);
  }

  addToWishlist(productId: string) {
    return this.http.post<IWishlistResponse>(App_Apis.wishlist.base, { productId });
  }

  removeFromWishlist(productId: string) {
    return this.http.delete<IWishlistResponse>(App_Apis.wishlist.item(productId));
  }

  toggleWishlist(productId: string) {
    if (this.wishlistIds().has(productId)) {
      return this.removeFromWishlist(productId);
    } else {
      return this.addToWishlist(productId);
    }
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistIds().has(productId);
  }

  loadWishlist() {
    this.getWishlist().subscribe({
      next: (response) => {
        const ids = new Set(response.data.map((p) => p._id));
        this.wishlistIds.set(ids);
        this.wishlistProducts.set(response.data);
      },
      error: () => {
        this.wishlistIds.set(new Set());
        this.wishlistProducts.set([]);
      },
    });
  }
}
