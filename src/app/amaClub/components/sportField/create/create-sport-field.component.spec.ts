import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSportFieldComponent } from './create-sport-field.component';

describe('CreatSportFieldComponent', () => {
  let component: CreateSportFieldComponent;
  let fixture: ComponentFixture<CreateSportFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSportFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSportFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
