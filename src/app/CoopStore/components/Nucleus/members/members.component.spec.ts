/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NucleusMembersComponent } from './members.component';

describe('MembersComponent', () => {
  let component: NucleusMembersComponent;
  let fixture: ComponentFixture<NucleusMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NucleusMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NucleusMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
