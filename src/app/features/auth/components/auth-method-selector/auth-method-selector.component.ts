import { Component, input } from '@angular/core';

@Component({
  selector: 'app-auth-method-selector',
  imports: [],
  templateUrl: './auth-method-selector.component.html',
  styleUrl: './auth-method-selector.component.css',
})
export class AuthMethodSelectorComponent {
  isTwoColumns = input(false);
}