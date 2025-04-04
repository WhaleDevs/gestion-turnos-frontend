import { Component, computed, effect, inject, signal } from '@angular/core';
import { AppointmentsService } from '@app/features/appointments/services/appointments.service';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';
import { ModalService } from '@app/shared/services/modal.service';
import { AlertService } from '@app/shared/services/alert.service';
import { SaveAppointmentComponent } from '@app/features/appointments/components/save-appointment/save-appointment.component';
import { AppointmentComponent } from '@app/features/appointments/components/appointment/appointment.component';
import { DateTime } from 'luxon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroTrash } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss'],
  providers: [provideIcons({ heroTrash})]
})

export class TodayComponent {
  private appointmentsService = inject(AppointmentsService);
  private scheduleService = inject(ScheduleService);
  private modalService = inject(ModalService);
  private alertService = inject(AlertService);
  private scheduleConfig = computed(() => this.scheduleService.signalScheduleConfigForUpdate());

  isDayActive = computed(() => {
    const config = this.scheduleConfig();
    if (!config) return false;
    const dateToday = DateTime.now().setLocale('es').toFormat('EEEE').toUpperCase();
    return config.scheduleDays.some(day => day.day === dateToday && day.status);
  });
  

  hoursEnabled = signal<string[]>([]);
  signalAppointmentsForDate = computed(() => this.appointmentsService.signalAppointmentsForDate());

  constructor() {

    effect(()=>{
      console.table(this.isDayActive());
    })

    
    effect(() => {
      const dateToday = DateTime.now().toISODate();
      const config = this.scheduleConfig();
      if (!config) return;

      const idSchedule = config.id;
      this.appointmentsService.getAppointmentsBetweenDates(idSchedule, dateToday, dateToday).subscribe();

      const selectedDay = {
        date: dateToday,
        dayNumber: DateTime.fromISO(dateToday).day.toString(),
        dayName: DateTime.fromISO(dateToday).setLocale('es').toFormat('EEEE').toUpperCase(),
        status: this.isDayActive()
      };

      this.appointmentsService.signalDateSelected.set(selectedDay);
    });

    effect(() => {
      const newHoursEnabled = this.signalAppointmentsForDate().map(appointment => appointment.startTime);
      this.hoursEnabled.set(newHoursEnabled);
      this.appointmentsService.signalHoursEnabled.set(newHoursEnabled);
    });

  }
  showFormToCreateAppointment() {
    this.modalService.open(SaveAppointmentComponent, { width: '600px' });
  }

  showMoreDetails(appointment: any) {
    this.appointmentsService.signalAppointmentSelected.set(appointment);
    this.modalService.open(AppointmentComponent);
  }

  deleteAppointment(appointment: any) {
    this.alertService.showInfo('Función no implementada');
  }

  returnIfPlaceForNewAppointments() {
    const appointments = this.signalAppointmentsForDate();
    if (appointments.length === 0) return true;

    return (
      appointments[0].startTime === this.hoursEnabled()[0] &&
      this.scheduleService.signalScheduleConfigResponse().daysConfig.find(day => day.day === appointments[0].date)?.endTime
      === this.hoursEnabled()[this.hoursEnabled().length - 1]
    );
  }


}
