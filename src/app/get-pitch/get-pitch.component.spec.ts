import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetPitchComponent } from './get-pitch.component';

describe('GetPitchComponent', () => {
  let component: GetPitchComponent;
  let fixture: ComponentFixture<GetPitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetPitchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetPitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
