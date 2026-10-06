import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule, RxwebValidators } from '@rxweb/reactive-form-validators';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, RxReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  requiredMessage = 'This field is required';
  errorMessage = signal('');
  isLoading = signal<boolean>(false);

  registerForm = this.fb.group({
    name: ['', [RxwebValidators.required({ message: this.requiredMessage })]],
    email: [
      '',
      [
        RxwebValidators.required({ message: this.requiredMessage }),
        RxwebValidators.email({ message: 'Please enter a valid email address' }),
      ],
    ],
    password: [
      '',
      [
        RxwebValidators.required({ message: this.requiredMessage }),
        RxwebValidators.password({
          validation: {
            upperCase: true,
            lowerCase: true,
            specialCharacter: true,
            digit: true,
            minLength: 8,
          },
          message:
            'Password must contain uppercase, lowercase, digit, special character and be at least 8 characters',
        }),
      ],
    ],
    rePassword: [
      '',
      [
        RxwebValidators.required({ message: this.requiredMessage }),
        RxwebValidators.compare({ fieldName: 'password', message: 'Passwords do not match' }),
      ],
    ],
    phone: [
      '',
      [
        RxwebValidators.required({ message: this.requiredMessage }),
        RxwebValidators.pattern({
          expression: { phone: /^01[0125][0-9]{8}$/ },
          message: 'Please enter a valid Egyptian phone number',
        }),
      ],
    ],
  });

  score = signal(0);
  validationText = signal('Weak');

  ngOnInit(): void {
    this.registerForm.get('password')?.valueChanges.subscribe((value) => {
      let score = 0;
      const userInput = value as string;
      if (/[a-z]/.test(userInput)) score++;
      if (/[A-Z]/.test(userInput)) score++;
      if (/\d/.test(userInput)) score++;
      if (/[@$!%*?&]/.test(userInput)) score++;
      if (userInput?.length >= 8) score++;
      this.score.set(score);

      if (score < 2) this.validationText.set('Weak');
      else if (score <= 3) this.validationText.set('Good');
      else if (score === 4) this.validationText.set('Strong');
      else if (score === 5) this.validationText.set('Excellent');
    });
  }

  get strengthColor(): string {
    switch (this.score()) {
      case 0:
      case 1:
        return 'red';
      case 2:
        return 'orange';
      case 3:
        return 'yellow';
      case 4:
        return 'lightgreen';
      case 5:
        return 'green';
      default:
        return 'gray';
    }
  }

  onRegisterSubmit(): void {
    if (this.isLoading() || this.registerForm.invalid) return;
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastr.success(
          'Account created successfully! Please sign in.',
          'Welcome to FreshCart'
        );
        this.router.navigateByUrl('/login');
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.error?.message || 'Registration failed. Please try again.');
      },
    });
  }
}