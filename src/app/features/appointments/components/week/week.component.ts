import { Component, computed, effect, inject } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { Week } from '../calendar/calendar.component';
import { NgClass } from '@angular/common';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';
import { DateTime } from 'luxon';
import { AlertService } from '@app/shared/services/alert.service';
@Component({
  selector: 'app-week',
  imports: [NgClass],
  templateUrl: './week.component.html',
  styleUrl: './week.component.scss',
})
export class WeekComponent {
  private appointmentsService = inject(AppointmentsService);
  private scheduleService = inject(ScheduleService);
  private alertService = inject(AlertService);
  weekSelected = computed<Week[]>(() =>
    this.appointmentsService.signalWeekSelected()
  );

  dayActive(day: Week) {
    this.appointmentsService.signalDateSelected.set(day);
    this.appointmentsService.signalDateFromWeek.set(day);
  }

  whatDay() {
    return this.appointmentsService.signalDateSelected()?.dayName;
  }

  isDayHoliday(day: Week) {
    const holiday = this.scheduleService.signalHolidays().find(holiday => {
      return this.scheduleService.isBetweenDates(day.date, holiday.startDate, holiday.endDate);
    });
    return !!holiday;
  }
}
