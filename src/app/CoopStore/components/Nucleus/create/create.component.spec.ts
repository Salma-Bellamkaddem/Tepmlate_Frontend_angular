/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { NucleusCreateComponent } from './create.component';

describe('NucleusCreateComponent', () => {
  let component: NucleusCreateComponent;
  let fixture: ComponentFixture<NucleusCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NucleusCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NucleusCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
