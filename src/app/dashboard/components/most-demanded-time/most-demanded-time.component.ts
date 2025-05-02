import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionService } from '@app/auth/services/session.service';
import { AppointmentResponse } from '@app/features/appointments/models/responses/appointments.response';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowPath, heroCalendar } from '@ng-icons/heroicons/outline';
import { T } from 'node_modules/@angular/cdk/portal-directives.d-d581f5ee';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-most-demanded-time',
  imports: [FormsModule, NgIcon],
  templateUrl: './most-demanded-time.component.html',
  styleUrl: './most-demanded-time.component.scss',
  providers: [provideIcons({ heroCalendar, heroArrowPath})]
})
export class MostDemandedTimeComponent {
  private scheduleService = inject(ScheduleService);
  private sessionService = inject(SessionService);
  private screenWidth = signal(window.innerWidth);
  isSmallScreen = computed(() => this.screenWidth() <= 1200);
  selectedMonths: string = '1';
  turns: any[] = [];
  turnsAgroupedForHour: { hour: string, count: number }[] = [];
  loading = signal(false);
  constructor() {
    window.addEventListener('resize', () => {
      this.screenWidth.set(window.innerWidth);
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.loading.set(true);
    this.callStats();
  }

  callStats() {
    console.log("Llamando a la api con el mes: ", this.selectedMonths);
    setTimeout(() => {
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
                } else {
                  console.log('No hay turnos mas demandados');
                }
              },
              error: (error) => {
                console.error('Error al obtener los turnos mas demandados', error);
              }
            })
          }
          this.loading.set(false);
        }
      })
    },250)
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => {
      this.screenWidth.set(window.innerWidth);
    });
  }
}