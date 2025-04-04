import { Component, computed, effect, inject } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroClock, heroPlus } from '@ng-icons/heroicons/outline';
import { AppointmentResponse } from '../../models/responses/appointments.response';
import { AppointmentComponent } from "../appointment/appointment.component";
import { ModalService } from '@app/shared/services/modal.service';
import { SaveAppointmentComponent } from '../save-appointment/save-appointment.component';
import { DateTime } from 'luxon';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-appointments',
  standalone: true,
  imports: [NgIcon, RouterLink],
  templateUrl: './list-appointments.component.html',
  styleUrls: ['./list-appointments.component.scss'],
  providers: [provideIcons({ heroClock, heroPlus })]
})

export class ListAppointmentsComponent {
  private modalService = inject(ModalService);
  private appointmentsService = inject(AppointmentsService);
  
  date = computed(() => this.appointmentsService.signalDateSelected());

  appointmentsForDate = computed(() => 
    this.appointmentsService.signalAppointmentsForDate()
  );  

  showMoreDetails(appointment: AppointmentResponse) {
    this.appointmentsService.signalAppointmentSelected.set(appointment);
    this.modalService.open(AppointmentComponent);
  } 

  showFormToCreateAppointment() {
    const hoursEnabled: String[] = [];
    this.appointmentsForDate().forEach(appointment => {
      hoursEnabled.push(appointment.startTime);
    });
    this.appointmentsService.setHoursEnabled(hoursEnabled);
    this.modalService.open(SaveAppointmentComponent, { width: '600px' });
  }

}
