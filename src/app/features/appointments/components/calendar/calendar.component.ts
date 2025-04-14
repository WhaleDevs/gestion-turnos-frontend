import { Component, computed, effect, inject, linkedSignal, model, signal } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {DateAdapter, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DateTime } from 'luxon';
import { AppointmentsService } from '../../services/appointments.service';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';

export interface Week {
  date: string;
  dayNumber: string;
  dayName: string;
  status:boolean;
}

@Component({
  selector: 'app-calendar',
  providers: [provideNativeDateAdapter()],
  imports: [MatCardModule, MatDatepickerModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent {
  private dateAdapter = inject(DateAdapter<Date>);
  private appointmentsService = inject(AppointmentsService);
  private scheduleService = inject(ScheduleService); 
  dateSelected = model<Date | null>(null);
  isLoading = signal(true); 

  constructor() { 
    this.dateAdapter.setLocale('es');
    this.dateAdapter.getFirstDayOfWeek = () => 1;

    effect(() => {
      this.dateSelected.set(new Date(this.appointmentsService.signalDateFromWeek()?.date ?? ''));
    });
    
    effect(() => {
      if (!this.scheduleService.isLoading() && this.appointmentsService.signalDayStatusFalse().length >= 0) {
        this.isLoading.set(false);
        this.initializeDate();
      }
    });

    effect(() => { 
      if (!this.isLoading()) {
        this.findWeekFromDateSelected();
        this.setDaySelected();
      }
    });
  }

  private initializeDate() {
    let currentDate = DateTime.now().setLocale('es');
    this.dateSelected.set(currentDate.toJSDate());
  }

  findWeekFromDateSelected() {
    const date = this.dateSelected();
    if(!date) return;
    const startOfWeek = DateTime.fromJSDate(date).setLocale('es').startOf('week');
    const week: Week[] = [];
    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.plus({ days: i });
      week.push({
        date: day.toFormat('yyyy-MM-dd'),
        dayName: day.weekdayLong?.toLocaleUpperCase() ?? '',
        dayNumber: day.toFormat('d'),
        status: !this.appointmentsService.signalDayStatusFalse().includes(day.weekdayLong?.toLocaleUpperCase() ?? '')
      });
    }
    this.appointmentsService.signalWeekSelected.set(week);
    this.appointmentsService.getAppointmentsBetweenDates(this.scheduleService.signalScheduleConfigResponse().id, week[0].date, week[6].date).subscribe();
    return week;
  }

  setDaySelected() {
    const day = this.dateSelected();
    if (!day) return;
    let startOfWeek = DateTime.fromJSDate(day).setLocale('es');
    let dayWeek: Week = {
      date: startOfWeek.toFormat('yyyy-MM-dd'),
      dayNumber: startOfWeek.toFormat('d'),
      dayName: startOfWeek.weekdayLong?.toLocaleUpperCase() ?? '',
      status: !this.appointmentsService.signalDayStatusFalse().includes(startOfWeek.weekdayLong?.toLocaleUpperCase() ?? '')
    };
    this.appointmentsService.signalDateSelected.set(dayWeek);
  }
  
}
