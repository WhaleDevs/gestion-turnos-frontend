import { Component } from '@angular/core';
import { CalendarComponent } from "./components/calendar/calendar.component";
import { ListAppointmentsComponent } from './components/list-appointments/list-appointments.component';
import { WeekComponent } from './components/week/week.component';
import { SelectManagerComponent } from '../managers/components/select-manager/select-manager.component';

@Component({
  selector: 'app-appointments',
  imports: [CalendarComponent, ListAppointmentsComponent, WeekComponent, SelectManagerComponent],
  template: `
<section class="appointments-container">
  <app-select-manager 
    class="manager"
    section="turnos"
    title="Agenda de turnos"
    description="Selecciona a un miembro del personal para ver sus turnos, también puedes ver tus turnos seleccionando 'Mis turnos'.">
  </app-select-manager>
  <app-calendar class="calendar"></app-calendar>
  <app-week class="week"></app-week>
  <app-list-appointments class="appointments"></app-list-appointments>
</section>

  `,
  styles: `.appointments-container {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto 1fr;
    grid-template-areas: 
      'manager manager'
      'calendar week'
      'calendar appointments';
    gap: var(--gap-l);
    padding: var(--padding-m);
    width: 100%;
    height: 100%;
  
    @media screen and (max-width: 1200px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto 1fr;
      grid-template-areas: 
        'manager manager'
        'calendar week'
        'appointments appointments';
      gap: var(--gap-m);
    }
  
    @media screen and (max-width: 768px) {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
      grid-template-areas: 
        'manager'
        'calendar'
        'appointments';
    }
  }
  
  .manager {
    grid-area: manager;
    height: auto;
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
    @media screen and (max-width: 768px) {
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
