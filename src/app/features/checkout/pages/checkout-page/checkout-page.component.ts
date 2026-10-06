import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService, ICart } from '../../../cart/services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CurrencyPipe } from '@angular/common';
import { LoadingDataSpinnerComponent } from '../../../../shared/components/loading-data-spinner/loading-data-spinner.component';

@Component({
  selector: 'app-checkout-page',
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    CurrencyPipe,
    RouterLink,
    LoadingDataSpinnerComponent,
  ],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css',
})
export class CheckoutPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly checkoutService = inject(CheckoutService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  activePaymentMethod = signal<'online' | 'cash'>('cash');
  cartId = this.activatedRoute.snapshot.paramMap.get('id')!;
  
  cartData = signal<ICart | null>(null);
  isLoading = signal(true);
  isSubmitting = signal(false);

  billingDetailsForm = this.fb.group({
    details: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading.set(true);
    this.cartService.getUserCart().subscribe({
      next: (response) => {
        this.cartData.set(response.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toastr.error('Failed to load order summary');
      },
    });
  }

  onBillingDetailSubmit(): void {
    if (this.billingDetailsForm.invalid) {
      this.toastr.warning('Please fill in all required shipping details correctly', 'Validation Error');
      return;
    }
    this.isSubmitting.set(true);

    if (this.activePaymentMethod() === 'cash') {
      this.checkoutService.cashPayment(this.cartId, this.billingDetailsForm.value).subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          this.toastr.success('Order placed successfully!', 'Success');
          this.cartService.numOfCartItems.set(0);
          this.router.navigateByUrl('/allorders');
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.toastr.error(error.error?.message || 'Failed to place order. Please try again.');
        },
      });
    } else {
      this.checkoutService.onlinePayment(this.cartId, this.billingDetailsForm.value).subscribe({
        next: (response) => {
          this.isSubmitting.set(false);
          this.toastr.info('Redirecting to payment gateway...', 'Payment Redirect');
          window.location.assign(response.session.url);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.toastr.error(error.error?.message || 'Failed to initialize online payment.');
        },
      });
    }
  }
}