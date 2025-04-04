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
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas: 
      'calendar week'
      'calendar appointments';
    gap: var(--gap-l);
    padding: var(--padding-m);
    border-radius: var(--border-radius-m);
    box-shadow: var(--shadow-elevation-medium);
    background-color: var(--background-light);
    width: 100%;
    height: 100%;
    @media screen and (max-width: 1200px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto 1fr;
      grid-template-areas: 
        'calendar week'
        'appointments appointments';
      gap: var(--gap-m);
    }

    @media screen and (max-width: 768px) {
      grid-template-columns: .5fr auto;
    }


    @media screen and (max-width: 576px) {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      grid-template-areas: 
        'calendar'
        'appointments';
      gap: var(--gap-m);
    }
  }

  .calendar {
    grid-area: calendar;
    @media screen and (max-width: 768px) {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }

  .week {
    grid-area: week;
    @media screen and (max-width: 576px) {
      display: none;
    }
  }

  .appointments {
    grid-area: appointments;
    
  }
  `
})
export class AppointmentsComponent {
  constructor() { }
}
