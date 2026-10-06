import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService, IWishlistProduct } from '../../services/wishlist.service';
import { CartService } from '../../../cart/services/cart.service';
import { LoadingDataSpinnerComponent } from '../../../../shared/components/loading-data-spinner/loading-data-spinner.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-wishlist-page',
  imports: [CurrencyPipe, RouterLink, LoadingDataSpinnerComponent, PageHeaderComponent],
  templateUrl: './wishlist-page.component.html',
  styleUrl: './wishlist-page.component.css',
})
export class WishlistPageComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);

  isLoading = signal(true);
  wishlistProducts = signal<IWishlistProduct[]>([]);
  addingToCartId = signal<string | null>(null);
  removingFromWishlistId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading.set(true);
    this.wishlistService.getWishlist().subscribe({
      next: (response) => {
        this.wishlistProducts.set(response.data);
        const ids = new Set(response.data.map((p) => p._id));
        this.wishlistService.wishlistIds.set(ids);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  removeFromWishlist(product: IWishlistProduct): void {
    this.removingFromWishlistId.set(product._id);
    this.wishlistService.removeFromWishlist(product._id).subscribe({
      next: (response) => {
        const ids = new Set(response.data.map((p) => p._id));
        this.wishlistService.wishlistIds.set(ids);
        this.wishlistProducts.set(response.data);
        this.removingFromWishlistId.set(null);
        this.toastr.success('Removed from wishlist');
      },
      error: (error: HttpErrorResponse) => {
        this.removingFromWishlistId.set(null);
        this.toastr.error(error.error?.message || 'Failed to remove from wishlist');
      },
    });
  }

  addToCart(product: IWishlistProduct): void {
    this.addingToCartId.set(product._id);
    this.cartService.addToCart(product._id, product).subscribe({
      next: (response) => {
        this.cartService.numOfCartItems.set(response.numOfCartItems);
        this.addingToCartId.set(null);
        this.toastr.success('Added to cart!', 'Success');
      },
      error: (error: HttpErrorResponse) => {
        this.addingToCartId.set(null);
        this.toastr.error(error.error?.message || 'Failed to add to cart');
      },
    });
  }
}
