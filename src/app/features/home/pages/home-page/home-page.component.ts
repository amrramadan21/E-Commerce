import { Component } from '@angular/core';
import { HomeCategoriesComponent } from '../../components/home-categories/home-categories.component';
import { HomeProductsComponent } from '../../components/home-products/home-products.component';
import { HomeWebsiteInfoBannerComponent } from '../../components/home-website-info-banner/home-website-info-banner.component';
import { HomeOffersComponent } from '../../components/home-offers/home-offers.component';
import { HomeMainSliderComponent } from '../../components/home-main-slider/home-main-slider.component';
import { HomeContactUsComponent } from '../../components/home-contact-us/home-contact-us.component';

@Component({
  selector: 'app-home-page',
  imports: [
    HomeCategoriesComponent,
    HomeProductsComponent,
    HomeWebsiteInfoBannerComponent,
    HomeOffersComponent,
    HomeMainSliderComponent,
    HomeContactUsComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {}