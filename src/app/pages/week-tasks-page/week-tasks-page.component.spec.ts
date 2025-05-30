import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekTasksPageComponent } from './week-tasks-page.component';

describe('WeekTasksPageComponent', () => {
  let component: WeekTasksPageComponent;
  let fixture: ComponentFixture<WeekTasksPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekTasksPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekTasksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
