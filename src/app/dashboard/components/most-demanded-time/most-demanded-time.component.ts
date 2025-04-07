import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionService } from '@app/auth/services/session.service';
import { AppointmentResponse } from '@app/features/appointments/models/responses/appointments.response';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCalendar } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-most-demanded-time',
  imports: [ FormsModule, NgIcon],
  templateUrl: './most-demanded-time.component.html',
  styleUrl: './most-demanded-time.component.scss',
  providers: [provideIcons({heroCalendar})]
})
export class MostDemandedTimeComponent {
  private scheduleService = inject(ScheduleService);
  private sessionService = inject(SessionService);

  selectedMonths: string = '1';
  turns: any[] = [];
  turnsAgroupedForHour: {hour:string, count:number}[] = [];

  constructor() {}

  ngOnInit(): void {
    this.callStats();
  }

  generateTurns(event: Event) {
    this.selectedMonths = (event.target as HTMLSelectElement).value;
    this.callStats();
  }

  callStats() {
    console.log("Llamando a la api con el mes: ", this.selectedMonths);
    this.sessionService.getSession$.subscribe({
      next: (session) => {
        if (session) {
          const email = session.email;
          this.scheduleService.getMostDemandedAppointments(this.selectedMonths, email).subscribe({
            next: (response) => {
              console.log('Turnos mas demandados', response);
              if (response.data) {
                this.turns = response.data;
                this.turns = this.turns.filter(turn => turn.count > 0);
              }else{
                console.log('No hay turnos mas demandados');
              }
            },
            error: (error) => {
              console.error('Error al obtener los turnos mas demandados', error);
            }
          })
        }
      }
    })
  }

  /* 
    PASO A PASO:
      1- BUSCAR EL HORARIO MAS TEMPRANO QUE ARRANCA A TRABAJAR EN UN DIA
      2- BUSCAR EL HORARIO MAS TARDE QUE TERMINA DE TRABAJAR EN UN DIA
      3- BUSCAR TODOS LOS INTERVALOS Y GENERAR LAS DISITNTAS HORAS
      4- CONTABILIZAR TODOS LOS TURNOS QUE SE EJECUTAN EN CADA HORA
      5- MOSTRAR LA HORA CON MAS TURNOS
  */

}