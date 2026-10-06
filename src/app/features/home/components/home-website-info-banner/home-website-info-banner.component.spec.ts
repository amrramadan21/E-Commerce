import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeWebsiteInfoBannerComponent } from './home-website-info-banner.component';

describe('HomeWebsiteInfoBannerComponent', () => {
  let component: HomeWebsiteInfoBannerComponent;
  let fixture: ComponentFixture<HomeWebsiteInfoBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeWebsiteInfoBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeWebsiteInfoBannerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
