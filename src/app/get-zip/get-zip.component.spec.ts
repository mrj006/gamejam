import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetZipComponent } from './get-zip.component';

describe('GetZipComponent', () => {
  let component: GetZipComponent;
  let fixture: ComponentFixture<GetZipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetZipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetZipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
