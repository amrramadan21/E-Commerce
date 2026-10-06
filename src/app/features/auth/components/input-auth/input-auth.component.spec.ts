import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputAuthComponent } from './input-auth.component';

describe('InputAuthComponent', () => {
  let component: InputAuthComponent;
  let fixture: ComponentFixture<InputAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputAuthComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
