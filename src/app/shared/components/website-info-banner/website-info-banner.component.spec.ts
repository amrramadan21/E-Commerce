import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteInfoBannerComponent } from './website-info-banner.component';

describe('WebsiteInfoBannerComponent', () => {
  let component: WebsiteInfoBannerComponent;
  let fixture: ComponentFixture<WebsiteInfoBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteInfoBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteInfoBannerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
