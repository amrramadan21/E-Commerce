import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService, IAuthResponse } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Stored_Keys } from '../../../../core/constants/stored-keys';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  // injected services
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);

  redirectUrl = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl');

  errorMessage = signal('');

  isLoading = signal<boolean>(false);

  loginForm = this.fb.group({
    email: [''],
    password: [''],
  });

  onLoginSubmit(): void {
    if (this.isLoading()) return;

    this.errorMessage.set('');
    this.isLoading.set(true);
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.onSuccessResponse(response);
      },
      error: (error: HttpErrorResponse) => {
        this.onFailedResponse(error);
      },
    });
  }

  onSuccessResponse(response: IAuthResponse): void {
    this.isLoading.set(false);
    localStorage.setItem(Stored_Keys.token, response.token);
    this.authService.refreshToken.update((value) => value + 1);
    this.authService.decodeToken();

    let targetUrl = this.redirectUrl || '/';
    if (targetUrl.startsWith('//') || targetUrl.startsWith('/')) {
      targetUrl = targetUrl.replace(/^\/+/, '/');
    } else {
      targetUrl = '/' + targetUrl;
    }

    this.cartService.syncGuestCart().subscribe({
      next: () => {
        this.router.navigateByUrl(targetUrl);
      },
      error: () => {
        this.router.navigateByUrl(targetUrl);
      },
    });
  }

  onFailedResponse(error: HttpErrorResponse): void {
    this.errorMessage.set(error.error?.message || 'Login failed. Please try again.');
    this.isLoading.set(false);
  }
}