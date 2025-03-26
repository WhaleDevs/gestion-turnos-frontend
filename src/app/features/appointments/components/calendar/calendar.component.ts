import { Component, computed, effect, inject, model } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {DateAdapter, provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { AppointmentsService } from '../../services/appointments.service';

@Component({
  selector: 'app-calendar',
  providers: [provideNativeDateAdapter()],
  imports: [MatCardModule, MatDatepickerModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  private appointmentsService = inject(AppointmentsService);
  private dateAdapter = inject(DateAdapter<Date>);
  selected = model<Date | null>(new Date());

  constructor() { 
    this.dateAdapter.setLocale('es');
    this.dateAdapter.getFirstDayOfWeek = () => 1;

    effect(() => {
      this.selected.set(new Date(this.appointmentsService.signalDateSelected() + "T00:00:00"));
    })


    effect(() => {
      console.log(this.selected());
      this.appointmentsService.setSignalDateSelected(this.formatDate(this.selected()));
      this.returnWeekSelected();
      const [start, end, ...days] = this.appointmentsService.signalWeekSelected();
      if(start !== '' && end !== '') {
        this.appointmentsService.getAppointmentsBetweenDates(1).subscribe(appointments => {
          console.log('Appointments between dates:\n', start, '\n', end);
          console.log(appointments);
        });
      }
    })
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

  returnWeekSelected(): void {
    const selectedDate = this.selected();
    if (!selectedDate) {
      this.appointmentsService.signalWeekSelected.set(['', '', '', '', '', '', '']);
      return;
    }
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - selectedDate.getDay() + (selectedDate.getDay() === 0 ? -6 : 1));
    const days = [start];
    for (let i = 1; i < 7; i++) {
      const nextDay = new Date(start);
      nextDay.setDate(start.getDate() + i);
      days.push(nextDay);
    }
    this.appointmentsService.signalWeekSelected.set(days.map(day => this.formatDate(day)) as [string, string, string, string, string, string, string]);
  }

}
