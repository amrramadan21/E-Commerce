import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetPasswordPageComponent } from './forget-password-page.component';

describe('ForgetPasswordPageComponent', () => {
  let component: ForgetPasswordPageComponent;
  let fixture: ComponentFixture<ForgetPasswordPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgetPasswordPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgetPasswordPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
