import { Component, computed, effect, inject, signal } from '@angular/core';
import { AppointmentsService } from '@app/features/appointments/services/appointments.service';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';
import { ModalService } from '@app/shared/services/modal.service';
import { AlertService } from '@app/shared/services/alert.service';
import { SaveAppointmentComponent } from '@app/features/appointments/components/save-appointment/save-appointment.component';
import { AppointmentComponent } from '@app/features/appointments/components/appointment/appointment.component';
import { DateTime } from 'luxon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroChevronLeft, heroChevronRight, heroTrash } from '@ng-icons/heroicons/outline';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { AppointmentResponse } from '@app/features/appointments/models/responses/appointments.response';

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [NgIcon, RouterLink, NgClass],
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss'],
  providers: [provideIcons({ heroTrash, heroChevronLeft, heroChevronRight })]
})

export class TodayComponent {
  private appointmentsService = inject(AppointmentsService);
  private scheduleService = inject(ScheduleService);
  private modalService = inject(ModalService);
  private alertService = inject(AlertService);
  private scheduleConfig = computed(() => this.scheduleService.signalScheduleConfigForUpdate());
  totalPages = computed(() => {
    return Math.ceil(this.signalAppointmentsForDate().length / this.pageSize);
  });
  paginatedAppointments = computed(() => {
    const allAppointments = this.signalAppointmentsForDate();
    const start = this.currentPage() * this.pageSize;
    const end = start + this.pageSize;
    return allAppointments.slice(start, end);
  });
  currentPage = signal(0);
  pageSize = 5;
  isDayActive = computed(() => {
    const config = this.scheduleConfig();
    if (!config) return false;
    const dateToday = DateTime.now().setLocale('es').toFormat('EEEE').toUpperCase();
    return config.scheduleDays.some(day => day.day === dateToday && day.status);
  });


  hoursEnabled = signal<string[]>([]);
  signalAppointmentsForDate = computed(() => this.appointmentsService.signalAppointmentsForDate().sort((a, b) => {
    const timeA = DateTime.fromISO(a.startTime);
    const timeB = DateTime.fromISO(b.startTime);
    return timeA.toMillis() - timeB.toMillis();
  }));

  constructor() {

    effect(() => {
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

  showMoreDetails(appointment: AppointmentResponse) {
    this.appointmentsService.signalAppointmentSelected.set(appointment);
    this.modalService.open(AppointmentComponent);
  }

  deleteAppointment(appointment: AppointmentResponse) {
    //confirmar? usar componente que arreglo rafa // note hoy jueves 10 de abril
    this.appointmentsService.signalAppointmentSelected.set(appointment);
    this.appointmentsService.deleteAppointment().subscribe({
      next: (response) => {
        if (response.success) {
          this.alertService.showSuccess('Turno eliminado correctamente');
          this.appointmentsService.signalAppointments.set(this.appointmentsService.signalAppointments()
            .filter(appointment => appointment.id !== this.appointmentsService.signalAppointmentSelected()?.id));
          this.appointmentsService.signalAppointmentSelected.set(null);
        }
      }
    });
  }

  returnIfPlaceForNewAppointments() {
    const appointments = this.signalAppointmentsForDate();
    if (appointments.length === 0) return true;
    return (
      this.appointmentsService.signalHoursNoFilters().length > appointments.length
    );
  }

  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
    }
  }
}
