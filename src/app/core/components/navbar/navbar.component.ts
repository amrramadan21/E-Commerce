import { Icon } from 'flowbite-angular/icon';
import { bars } from 'flowbite-angular/icon/outline/general';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarToggle,
} from 'flowbite-angular/navbar';

import { Component, inject, OnInit, PLATFORM_ID, signal, computed } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { CartService } from '../../../features/cart/services/cart.service';
import { WishlistService } from '../../../features/wishlist/services/wishlist.service';
import { CategoriesService } from '../../../features/categories/services/categories.service';
import { ICategory } from '../../../features/categories/interfaces/IGetAllCategories';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  imports: [Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarToggle, Icon, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [provideIcons({ bars })],
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly platform = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  userToken = this.authService.userToken;
  currentUser = this.authService.currentUser;
  userName = computed(() => this.currentUser()?.name || 'User');

  numOfCartItems = this.cartService.numOfCartItems;
  wishlistCount = computed(() => this.wishlistService.wishlistIds().size);

  categoriesList = signal<ICategory[]>([]);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platform) && this.userToken()) {
      this.getUserCart();
      this.wishlistService.loadWishlist();
    }
    this.getCategories();
  }

  getUserCart(): void {
    this.cartService.getUserCart().subscribe({
      next: (response) => {
        this.numOfCartItems.set(response.numOfCartItems);
      },
      error: (error: HttpErrorResponse) => {
        // Suppress or handle cart loading error
      },
    });
  }

  getCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (response) => {
        this.categoriesList.set(response.data.slice(0, 6)); // Top 6 categories
      },
      error: () => {},
    });
  }

  logout(): void {
    this.authService.logout();
    this.cartService.numOfCartItems.set(0);
    this.router.navigate(['/login']);
  }
}