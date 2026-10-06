import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { WebsiteInfoBannerComponent } from '../../../shared/components/website-info-banner/website-info-banner.component';

@Component({
  selector: 'app-guest-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, WebsiteInfoBannerComponent],
  templateUrl: './guest-layout.component.html',
  styleUrl: './guest-layout.component.css',
})
export class GuestLayoutComponent {}
