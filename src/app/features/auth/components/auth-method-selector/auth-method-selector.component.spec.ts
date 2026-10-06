import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthMethodSelectorComponent } from './auth-method-selector.component';

describe('AuthMethodSelectorComponent', () => {
  let component: AuthMethodSelectorComponent;
  let fixture: ComponentFixture<AuthMethodSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthMethodSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthMethodSelectorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
