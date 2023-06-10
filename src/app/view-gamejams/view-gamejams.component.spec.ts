import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGamejamsComponent } from './view-gamejams.component';

describe('ViewGamejamsComponent', () => {
  let component: ViewGamejamsComponent;
  let fixture: ComponentFixture<ViewGamejamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGamejamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewGamejamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
