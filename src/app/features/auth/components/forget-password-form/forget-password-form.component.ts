import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Stored_Keys } from '../../../../core/constants/stored-keys';

type Step = 'email' | 'verify' | 'reset';

@Component({
  selector: 'app-forget-password-form',
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password-form.component.html',
  styleUrl: './forget-password-form.component.css',
})
export class ForgetPasswordFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentStep = signal<Step>('email');
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  userEmail = signal('');

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  codeForm = this.fb.group({
    resetCode: ['', [Validators.required, Validators.minLength(6)]],
  });

  resetForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  onEmailSubmit(): void {
    if (this.isLoading() || this.emailForm.invalid) return;
    this.errorMessage.set('');
    this.isLoading.set(true);
    const email = this.emailForm.value.email!;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.userEmail.set(email);
        this.isLoading.set(false);
        this.successMessage.set(`A reset code was sent to ${email}`);
        this.currentStep.set('verify');
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Email not found');
      },
    });
  }

  onCodeSubmit(): void {
    if (this.isLoading() || this.codeForm.invalid) return;
    this.errorMessage.set('');
    this.isLoading.set(true);
    const code = this.codeForm.value.resetCode!;

    this.authService.verifyResetCode(code).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Code verified! Enter your new password.');
        this.currentStep.set('reset');
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Invalid or expired code');
      },
    });
  }

  onResetSubmit(): void {
    if (this.isLoading() || this.resetForm.invalid) return;
    this.errorMessage.set('');
    this.isLoading.set(true);
    const newPassword = this.resetForm.value.newPassword!;

    this.authService.resetPassword(this.userEmail(), newPassword).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        localStorage.setItem(Stored_Keys.token, response.token);
        this.authService.refreshToken.update((v) => v + 1);
        this.authService.decodeToken();
        this.router.navigateByUrl('/');
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Failed to reset password');
      },
    });
  }
}
