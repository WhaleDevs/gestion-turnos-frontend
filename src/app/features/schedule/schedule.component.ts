import { Component, inject } from '@angular/core';
import { ScheduleService } from './services/schedule.service';
import { ListDaysComponent } from './components/list-days/list-days.component';

enum EScheduleComponents {
  FormSchedule = 'form-schedule',
  EditSchedule = 'edit-schedule',
}

@Component({
  imports: [ListDaysComponent],
  selector: 'app-schedule',
  template: `
  @if (scheduleComponentActive === optionsComponent.FormSchedule ) {
    <app-list-days></app-list-days>
  }
  @if (scheduleComponentActive === optionsComponent.EditSchedule) {}
  `,
})

export class ScheduleComponent {

  private scheduleService = inject(ScheduleService);
  scheduleComponentActive: string = '';
  optionsComponent = EScheduleComponents;

  ngOnInit() {
    this.scheduleService.$scheduleComponentActive.subscribe((component) => {
      this.scheduleComponentActive = component;
    });
  }

}
