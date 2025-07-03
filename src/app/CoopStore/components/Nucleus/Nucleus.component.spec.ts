/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NucleusComponent } from './Nucleus.component';

describe('NucleusComponent', () => {
  let component: NucleusComponent;
  let fixture: ComponentFixture<NucleusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NucleusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NucleusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
