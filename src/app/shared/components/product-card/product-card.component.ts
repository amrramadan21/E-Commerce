import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IProduct } from '../../../features/products/interfaces/IAllProductsResponse';
import { AuthService } from '../../../features/auth/services/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);

  userToken = this.authService.userToken;
  wishlistIds = this.wishlistService.wishlistIds;

  prod = input.required<IProduct>();

  isCartLoading = signal(false);
  isWishlistLoading = signal(false);

  isInWishlist(): boolean {
    return this.wishlistIds().has(this.prod()._id);
  }

  onAddToCart(prod: IProduct): void {
    if (this.isCartLoading()) return;

    this.isCartLoading.set(true);
    this.cartService.addToCart(prod._id, prod).subscribe({
      next: (response) => {
        this.isCartLoading.set(false);
        this.cartService.numOfCartItems.set(response.numOfCartItems);
        this.toastrService.success(response.message || 'Added to cart!', 'Success', {
          positionClass: 'toast-top-right',
        });
      },
      error: (error: HttpErrorResponse) => {
        this.isCartLoading.set(false);
        this.toastrService.error(error.error?.message || 'Failed to add to cart');
      },
    });
  }

  onToggleWishlist(prod: IProduct): void {
    if (!this.userToken()) {
      this.toastrService.info('Please log in to save items to your wishlist', 'Login Required');
      this.router.navigate(['/login'], {
        queryParams: { redirectUrl: this.router.url },
      });
      return;
    }
    if (this.isWishlistLoading()) return;

    this.isWishlistLoading.set(true);
    const isCurrentlyInWishlist = this.isInWishlist();

    const action$ = isCurrentlyInWishlist
      ? this.wishlistService.removeFromWishlist(prod._id)
      : this.wishlistService.addToWishlist(prod._id);

    action$.subscribe({
      next: (response) => {
        const ids = new Set(response.data.map((p: any) => p._id));
        this.wishlistService.wishlistIds.set(ids);
        this.isWishlistLoading.set(false);
        if (isCurrentlyInWishlist) {
          this.toastrService.info('Removed from wishlist');
        } else {
          this.toastrService.success('Added to wishlist!', '❤️ Saved');
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isWishlistLoading.set(false);
        this.toastrService.error(error.error?.message || 'Failed to update wishlist');
      },
    });
  }
}