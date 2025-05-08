import { Component, computed, effect, inject, linkedSignal, OnDestroy, OnInit } from '@angular/core';
import { AppointmentResponse, AppointmentStatus } from '@app/features/appointments/models/responses/appointments.response';
import { AppointmentsService } from '@app/features/appointments/services/appointments.service';
import { ScheduleDayConfigResponse } from '@app/features/schedule/models/responses/schedule.response';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';

@Component({
  selector: 'app-count-day',
  templateUrl: './count-day.component.html',
  styleUrl: './count-day.component.scss'
})
export class CountDayComponent implements OnInit, OnDestroy {
  hourMinutes: string = '';
  private appointomentsService = inject(AppointmentsService);
  private scheduleService = inject(ScheduleService);  
  appointmentForDate = computed(() => this.appointomentsService.signalAppointmentsForDate());
  employeeSelected = computed(() => this.scheduleService.signalEmployeeSelected());
  private filterByStatus = (status: string) => computed(() =>
    this.appointmentForDate().filter((a: AppointmentResponse) => a.status === status)
  );
  salary = computed(() => this.appointmentForDate().reduce((acc: number, a: AppointmentResponse) => {
    if (a.status === AppointmentStatus.TERMINADO) {
      acc += a.servicePrice;
    }
    return acc;
  }, 0));
  appointmentsFinish = this.filterByStatus(AppointmentStatus.TERMINADO);
  appointmentsCancel = this.filterByStatus(AppointmentStatus.AUSENTE);
  appointmentsReserved = this.filterByStatus(AppointmentStatus.RESERVADO);
  appointmentsPending = this.filterByStatus(AppointmentStatus.ESPERANDO);
  appointmentsFree = computed(() => this.appointomentsService.signalHoursForDate());


  private intervalId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.updateTime();
    this.syncWithNextMinute();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
    }
  }

  private updateTime() {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    this.hourMinutes = `${hour}:${minute}`;
  }

  private syncWithNextMinute() {
    const now = new Date();
    const secondsUntilNextMinute = 60 - now.getSeconds();
    this.intervalId = setTimeout(() => {
      this.updateTime();
      this.intervalId = setInterval(() => {
        this.updateTime();
      }, 60000);
    }, secondsUntilNextMinute * 1000);
  }
}
