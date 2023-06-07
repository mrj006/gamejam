import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamejamComponent } from './gamejam.component';

describe('GamejamComponent', () => {
  let component: GamejamComponent;
  let fixture: ComponentFixture<GamejamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamejamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamejamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
