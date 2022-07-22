import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedpostsComponent } from './likedposts.component';

describe('LikedpostsComponent', () => {
  let component: LikedpostsComponent;
  let fixture: ComponentFixture<LikedpostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LikedpostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LikedpostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
