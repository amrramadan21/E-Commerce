import { Component } from '@angular/core';
import { ForgetPasswordFormComponent } from '../../components/forget-password-form/forget-password-form.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forget-password-page',
  imports: [ForgetPasswordFormComponent, RouterLink],
  templateUrl: './forget-password-page.component.html',
  styleUrl: './forget-password-page.component.css',
})
export class ForgetPasswordPageComponent {}
