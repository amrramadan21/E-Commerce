import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  imports: [PageHeaderComponent, RouterLink],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent {
  private readonly authService = inject(AuthService);
  currentUser = this.authService.currentUser;
  
  breadCrumbs = [{ name: 'Profile', url: ['/profile'] }];
}
