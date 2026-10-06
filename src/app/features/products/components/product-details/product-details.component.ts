import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { IProduct } from '../../interfaces/IAllProductsResponse';
import { CartService } from '../../../cart/services/cart.service';
import { WishlistService } from '../../../wishlist/services/wishlist.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);

  productDetails = input<IProduct | null>(null);

  isCartLoading = signal(false);
  isWishlistLoading = signal(false);

  userToken = this.authService.userToken;
  wishlistIds = this.wishlistService.wishlistIds;

  isInWishlist(prod: IProduct): boolean {
    return this.wishlistIds().has(prod._id);
  }

  onAddToCart(prod: IProduct): void {
    if (this.isCartLoading()) return;

    this.isCartLoading.set(true);
    this.cartService.addToCart(prod._id, prod).subscribe({
      next: (response) => {
        this.isCartLoading.set(false);
        this.cartService.numOfCartItems.set(response.numOfCartItems);
        this.toastr.success(response.message || 'Added to cart!', 'Success');
      },
      error: (error: HttpErrorResponse) => {
        this.isCartLoading.set(false);
        this.toastr.error(error.error?.message || 'Failed to add to cart');
      },
    });
  }

  onToggleWishlist(prod: IProduct): void {
    if (!this.userToken()) {
      this.toastr.warning('Please login to save items to your wishlist', 'Login Required');
      return;
    }
    if (this.isWishlistLoading()) return;

    this.isWishlistLoading.set(true);
    const isCurrentlyInWishlist = this.isInWishlist(prod);

    const action$ = isCurrentlyInWishlist
      ? this.wishlistService.removeFromWishlist(prod._id)
      : this.wishlistService.addToWishlist(prod._id);

    action$.subscribe({
      next: (response) => {
        const ids = new Set(response.data.map((p: any) => p._id));
        this.wishlistService.wishlistIds.set(ids);
        this.isWishlistLoading.set(false);
        if (isCurrentlyInWishlist) {
          this.toastr.info('Removed from wishlist');
        } else {
          this.toastr.success('Added to wishlist!', '❤️ Saved');
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isWishlistLoading.set(false);
        this.toastr.error(error.error?.message || 'Failed to update wishlist');
      },
    });
  }
}