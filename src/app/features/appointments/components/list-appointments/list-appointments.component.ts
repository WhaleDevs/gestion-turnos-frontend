import { Component, computed, inject } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroClock, heroPlus } from '@ng-icons/heroicons/outline';
import { AppointmentResponse } from '../../models/responses/appointments.response';
import { AppointmentComponent } from "../appointment/appointment.component";
import { ModalService } from '@app/shared/services/modal.service';
import { SaveAppointmentComponent } from '../save-appointment/save-appointment.component';
import { DateTime } from 'luxon';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';

@Component({
  selector: 'app-list-appointments',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './list-appointments.component.html',
  styleUrls: ['./list-appointments.component.scss'],
  providers: [provideIcons({ heroClock, heroPlus })]
})

export class ListAppointmentsComponent {
  private modalService = inject(ModalService);
  private appointmentsService = inject(AppointmentsService);
  
  date = computed(() => this.appointmentsService.signalDateSelected());
  dayStr = computed(() => this.appointmentsService.signalDayStrFull());
  dayNumber = computed(() => this.appointmentsService.signalDayNumber());

  appointmentsForDate = computed(() => 
    this.appointmentsService.signalAppointmentsForDate()
      .filter(appointment => appointment.date === this.date())
      .sort((a, b) => {
        const timeA = DateTime.fromFormat(a.startTime, 'HH:mm').toMillis();
        const timeB = DateTime.fromFormat(b.startTime, 'HH:mm').toMillis();
        return timeA - timeB;
      })
  );

  constructor() {}

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
