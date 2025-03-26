import { Component } from '@angular/core';
import { CalendarComponent } from "./components/calendar/calendar.component";
import { ListAppointmentsComponent } from './components/list-appointments/list-appointments.component';
import { WeekComponent } from './components/week/week.component';

@Component({
  selector: 'app-appointments',
  imports: [CalendarComponent, ListAppointmentsComponent, WeekComponent],
  template: `
  <section class="appointments-container">
    <app-calendar class="calendar"></app-calendar>
    <app-week class="week"></app-week>
    <app-list-appointments class="appointments"></app-list-appointments>
  </section>
  `,
  styles: `
  .appointments-container {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: auto 1fr;
    grid-template-areas: 
      'calendar week'
      'calendar appointments';
    gap: 16px;
    padding: 16px;
    border-radius: 16px;
  }

  .calendar {
    grid-area: calendar;
  }

  .week {
    grid-area: week;
  }

  .appointments {
    grid-area: appointments;
  }
  `
})
export class AppointmentsComponent {
}
