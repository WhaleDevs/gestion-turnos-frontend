import { NgClass } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionService } from '@app/auth/services/session.service';
import { AppointmentResponse } from '@app/features/appointments/models/responses/appointments.response';
import { ManagerResponse } from '@app/features/managers/models/manager.response';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowPath, heroCalendar } from '@ng-icons/heroicons/outline';

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
  employeeSelected = computed(() => this.scheduleService.signalEmployeeSelected());
  monthsOptions = [
    { value: '1', label: '1 Mes' },
    { value: '3', label: '3 Meses' },
    { value: '6', label: '6 Meses' },
    { value: '12', label: '12 Meses' },
    { value: '99', label: 'Histórico' },
  ];
  constructor() {
    window.addEventListener('resize', () => {
      this.screenWidth.set(window.innerWidth);
    });

    effect(() => {
      if(this.employeeSelected()){
        this.callStats();
      }
    })

  }

  ngOnInit(): void {
    this.sessionService.getSession$.subscribe({
      next: (response) => {
          this.scheduleService.setSignalEmployeeSelected(response as ManagerResponse);
      }
    })
  }

  refresh() {
    this.loading.set(true);
    this.callStats();
  }

  callStats() {
    console.log("Llamando a la API con el mes:", this.selectedMonths);
    this.loading.set(true);
    const employee = this.employeeSelected();
    if(!employee){
      this.loading.set(false);
      return;
    }
    this.scheduleService.getMostDemandedAppointments(this.selectedMonths, employee.email).subscribe({
        next: (response) => {
          this.turns = response.data?.filter(turn => turn.count > 0) || [];
        },
      error: (error) => console.error('Error al obtener los turnos más demandados', error),
      complete: () => this.loading.set(false)
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => {
      this.screenWidth.set(window.innerWidth);
    });
  }
}