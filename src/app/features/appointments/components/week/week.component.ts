import { Component, computed, inject } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { Week } from '../calendar/calendar.component';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-week',
  imports:[NgClass],
  templateUrl: './week.component.html',
  styleUrl: './week.component.scss'
})
export class WeekComponent {
  private appointmentsService = inject(AppointmentsService);
  weekSelected = computed<Week[]>(() => (this.appointmentsService.signalWeekSelected()));
  constructor() {}

  dayActive(day: Week) {
    this.appointmentsService.signalDateSelected.set(day);
    this.appointmentsService.signalDateFromWeek.set(day);
  }
  whatDay() {
    return this.appointmentsService.signalDateSelected()?.dayName;
  }
}
