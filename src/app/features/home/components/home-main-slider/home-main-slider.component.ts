import { isPlatformBrowser } from '@angular/common';
import { Component, inject, NO_ERRORS_SCHEMA, OnInit, PLATFORM_ID } from '@angular/core';
// import { register } from 'swiper/element/bundle';

// register();

@Component({
  selector: 'app-home-main-slider',
  imports: [],
  templateUrl: './home-main-slider.component.html',
  schemas: [NO_ERRORS_SCHEMA],
  styleUrl: './home-main-slider.component.css',
})
export class HomeMainSliderComponent implements OnInit {
  private readonly platform = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platform)) {
      console.log(this.platform);
      console.log('this.platform');
      import('swiper/element/bundle').then((m) => m.register());
    }
  }
}