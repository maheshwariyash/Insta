import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenpostsComponent } from './hiddenposts.component';

describe('HiddenpostsComponent', () => {
  let component: HiddenpostsComponent;
  let fixture: ComponentFixture<HiddenpostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiddenpostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenpostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
