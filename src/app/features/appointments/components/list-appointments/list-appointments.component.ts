import { Component, computed, effect, inject, signal } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroClock, heroPlus, heroTrash } from '@ng-icons/heroicons/outline';
import { AppointmentResponse, AppointmentStatus } from '../../models/responses/appointments.response';
import { AppointmentComponent } from '../appointment/appointment.component';
import { ModalService } from '@app/shared/services/modal.service';
import { SaveAppointmentComponent } from '../save-appointment/save-appointment.component';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { AlertService } from '@app/shared/services/alert.service';

@Component({
  selector: 'app-list-appointments',
  standalone: true,
  imports: [NgIcon, RouterLink, NgClass],
  templateUrl: './list-appointments.component.html',
  styleUrls: ['./list-appointments.component.scss'],
  providers: [provideIcons({ heroClock, heroPlus, heroTrash })],
})
export class ListAppointmentsComponent {
  private modalService = inject(ModalService);
  private appointmentsService = inject(AppointmentsService);
  private alertService = inject(AlertService);
  appointmentStatus = AppointmentStatus;

  appointmentsLength = computed(() => this.appointmentsService.signalAppointmentsForDate().length);
  date = computed(() => this.appointmentsService.signalDateSelected());
  selectedStatus = signal<AppointmentStatus | null>(null);
  appointmentsForDate = computed(() => {
    const allAppointments = this.appointmentsService.signalAppointmentsForDate();
    const status = this.selectedStatus();
    return status ? allAppointments.filter(a => a.status === status) : allAppointments;
  });
  hoursForDate = computed(() => this.appointmentsService.signalHoursNoFilters());


  constructor() {
    effect(() => {
      console.log("\n\n\n\n");
      console.count();
      console.log("Signal appointments length", this.appointmentsService.signalAppointmentsForDate().length);
      console.log("Date: ", this.date());
      console.log("Selected status: ", this.selectedStatus());
      console.log("Appointments for date: ", this.appointmentsForDate());
      console.log("Hours for date: ", this.hoursForDate());
    });
  }

  filter(status: AppointmentStatus | null) {
    this.selectedStatus.set(status);
  }

  showMoreDetails(appointment: AppointmentResponse) {
    this.appointmentsService.signalAppointmentSelected.set(appointment);
    this.modalService.open(AppointmentComponent);
  }

  showFormToCreateAppointment() {
    const hoursEnabled: string[] = this.appointmentsForDate().map(a => a.startTime);
    this.appointmentsService.setHoursEnabled(hoursEnabled);
    this.modalService.open(SaveAppointmentComponent, { width: '600px' });
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


  
}
