import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { AppointmentsComponent } from '@app/features/appointments/appointments.component';
import { AppointmentComponent } from '@app/features/appointments/components/appointment/appointment.component';
import { Week } from '@app/features/appointments/components/calendar/calendar.component';
import { SaveAppointmentComponent } from '@app/features/appointments/components/save-appointment/save-appointment.component';
import { AppointmentResponse } from '@app/features/appointments/models/responses/appointments.response';
import { AppointmentsService } from '@app/features/appointments/services/appointments.service';
import { ScheduleDayConfigResponse } from '@app/features/schedule/models/responses/schedule.response';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';
import { AlertService } from '@app/shared/services/alert.service';
import { ModalService } from '@app/shared/services/modal.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroTrash, heroUserPlus } from '@ng-icons/heroicons/outline';
import { heroTrashSolid } from '@ng-icons/heroicons/solid';
import { DateTime } from 'luxon'; 

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss'],
  providers: [provideIcons({ heroTrash, heroUserPlus, heroTrashSolid })]
})

export class TodayComponent {
  private appointmentsService = inject(AppointmentsService);
  private scheduleService = inject(ScheduleService);
  private modalService = inject(ModalService);
  private alertService = inject(AlertService);
  signalAppointmentsForDate = computed<AppointmentResponse[]>(() => this.appointmentsService.signalAppointmentsForDate());
  isDayActive: boolean = false;
  hoursEnabled: string[] = [];
  constructor() {
    effect(() => {
      const dateToday = DateTime.now().toISODate();
      const scheduleConfig = this.scheduleService.signalScheduleConfigResponse();
      const idSchedule = scheduleConfig.id;
      this.appointmentsService.getAppointmentsBetweenDates(idSchedule, dateToday, dateToday).subscribe();
      const selectedDay: Week = {
        date: dateToday,
        dayNumber: DateTime.fromISO(dateToday).day.toString(),
        dayName: DateTime.fromISO(dateToday).setLocale('es').toFormat('EEEE').toUpperCase(),
        status: scheduleConfig.daysConfig.find((day: ScheduleDayConfigResponse) =>
          day.day === DateTime.fromISO(dateToday).setLocale('es').toFormat('EEEE').toUpperCase()
        )?.status ?? false,
      };
      this.isDayActive = selectedDay.status;
      this.appointmentsService.signalDateSelected.set(selectedDay);
      this.hoursEnabled = [];
      this.signalAppointmentsForDate().forEach(appointment => {
        this.hoursEnabled.push(appointment.startTime);
      });
      this.appointmentsService.signalHoursEnabled.set(this.hoursEnabled);
    });
  }

  showFormToCreateAppointment() {
    this.modalService.open(SaveAppointmentComponent, { width: '600px' });
  }
  showMoreDetails(appointment: AppointmentResponse) {
    this.appointmentsService.signalAppointmentSelected.set(appointment);
    this.modalService.open(AppointmentComponent);
  }
  deleteAppointment(appointment: AppointmentResponse) {
    this.alertService.showInfo('Función no implementada');
  }

  returnIfPlaceForNewAppointments(){
    const appointment = this.signalAppointmentsForDate()[0];
    return appointment.startTime === this.hoursEnabled[0] 
    && this.scheduleService.signalScheduleConfigResponse().daysConfig.find(day => day.day === appointment.date)?.endTime
    === this.hoursEnabled[this.hoursEnabled.length - 1];
  }
}