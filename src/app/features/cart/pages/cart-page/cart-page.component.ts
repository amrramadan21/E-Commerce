import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService, ICart, ICartItem } from '../../services/cart.service';
import { LoadingDataSpinnerComponent } from '../../../../shared/components/loading-data-spinner/loading-data-spinner.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, RouterLink, LoadingDataSpinnerComponent, PageHeaderComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css',
})
export class CartPageComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);

  isLoading = signal(true);
  cartData = signal<ICart | null>(null);
  couponCode = signal('');
  couponLoading = signal(false);
  updatingItemId = signal<string | null>(null);
  removingItemId = signal<string | null>(null);

  userToken = this.authService.userToken;

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading.set(true);
    this.cartService.getUserCart().subscribe({
      next: (response) => {
        this.cartData.set(response.data);
        this.cartService.numOfCartItems.set(response.numOfCartItems);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  updateQuantity(item: ICartItem, newCount: number): void {
    if (newCount < 1) {
      this.removeItem(item);
      return;
    }
    this.updatingItemId.set(item.product._id);
    this.cartService.updateCartItemCount(item.product._id, newCount).subscribe({
      next: (response) => {
        this.cartData.set(response.data);
        this.cartService.numOfCartItems.set(response.numOfCartItems);
        this.updatingItemId.set(null);
        this.toastr.success('Quantity updated', 'Cart');
      },
      error: (error: HttpErrorResponse) => {
        this.updatingItemId.set(null);
        this.toastr.error(error.error?.message || 'Failed to update quantity');
      },
    });
  }

  removeItem(item: ICartItem): void {
    this.removingItemId.set(item.product._id);
    this.cartService.removeCartItem(item.product._id).subscribe({
      next: (response) => {
        this.cartData.set(response.data);
        this.cartService.numOfCartItems.set(response.numOfCartItems);
        this.removingItemId.set(null);
        this.toastr.success('Item removed from cart');
      },
      error: (error: HttpErrorResponse) => {
        this.removingItemId.set(null);
        this.toastr.error(error.error?.message || 'Failed to remove item');
      },
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cartData.set(null);
        this.cartService.numOfCartItems.set(0);
        this.toastr.success('Cart cleared successfully');
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error.error?.message || 'Failed to clear cart');
      },
    });
  }

  applyCoupon(): void {
    if (!this.couponCode()) return;
    this.couponLoading.set(true);
    this.cartService.applyCoupon(this.couponCode()).subscribe({
      next: (response) => {
        this.cartData.set(response.data);
        this.couponLoading.set(false);
        this.toastr.success('Coupon applied successfully!', 'Discount Applied');
      },
      error: (error: HttpErrorResponse) => {
        this.couponLoading.set(false);
        this.toastr.error(error.error?.message || 'Invalid coupon code');
      },
    });
  }

  proceedToCheckout(): void {
    if (!this.userToken()) {
      const cartId = this.cartData()?._id;
      const redirect = cartId && cartId !== 'guest' ? `/checkout/${cartId}` : '/cart';
      this.toastr.info('Please log in to proceed to checkout', 'Login Required');
      this.router.navigate(['/login'], { queryParams: { redirectUrl: redirect } });
      return;
    }
    const cartId = this.cartData()?._id;
    if (cartId) {
      this.router.navigate(['/checkout', cartId]);
    }
  }

  get totalPrice(): number {
    const cart = this.cartData();
    return cart?.totalAfterDiscount ?? cart?.totalCartPrice ?? 0;
  }

  get hasDiscount(): boolean {
    return (
      !!this.cartData()?.totalAfterDiscount &&
      this.cartData()!.totalAfterDiscount! < this.cartData()!.totalCartPrice
    );
  }
}
