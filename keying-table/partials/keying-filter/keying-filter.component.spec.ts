import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyingFilterComponent } from './keying-filter.component';

describe('KeyingFilterComponent', () => {
  let component: KeyingFilterComponent;
  let fixture: ComponentFixture<KeyingFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyingFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
