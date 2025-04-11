import { Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroClock, heroPlus, heroUserCircle, heroChatBubbleBottomCenterText,
  heroPhone, heroAtSymbol, heroMapPin, heroIdentification
} from '@ng-icons/heroicons/outline';
import { DateTime } from 'luxon';

import { AppointmentsService } from '../../services/appointments.service';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';
import { CustomersService } from '@app/features/customers/services/customers.service';
import { ModalService } from '@app/shared/services/modal.service';
import { AlertService } from '@app/shared/services/alert.service';

import { ScheduleDayConfigResponse } from '@app/features/schedule/models/responses/schedule.response';

@Component({
  selector: 'app-save-appointment',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  providers: [provideIcons({
    heroClock, heroPlus, heroUserCircle, heroChatBubbleBottomCenterText,
    heroPhone, heroAtSymbol, heroMapPin, heroIdentification
  })],
  templateUrl: './save-appointment.component.html',
  styleUrl: './save-appointment.component.scss'
})
export class SaveAppointmentComponent {
  // Dependencias inyectadas
  private readonly appointmentsService = inject(AppointmentsService);
  private readonly scheduleService = inject(ScheduleService);
  private readonly customerService = inject(CustomersService);
  private readonly modalService = inject(ModalService);
  private readonly alertService = inject(AlertService);

  // Señales y propiedades
  date = computed(() => this.appointmentsService.signalDateSelected());
  dayConfig = computed(() =>
    this.scheduleService.signalScheduleConfigResponse().daysConfig
      .find((day: ScheduleDayConfigResponse) => day.day === this.date()?.dayName) || null
  );
  hours = computed(() => this.appointmentsService.signalHoursForDate());

  phoneNumber = input('');
  formSaveAppointment!: FormGroup;
  searching = signal(false);
  showPhoneError = true;

  constructor(private fb: FormBuilder) {
    this.formSaveAppointment = this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      startTime: ['', Validators.required],
      endTime: [''],
      date: ['', Validators.required],
      description: ['', Validators.required],
      scheduleId: ['', Validators.required],
      customer: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      })
    });
  }

  onSubmit(): void {
    let hourIndex = this.formSaveAppointment.get('startTime')?.value;
    if (hourIndex === '') {
      this.alertService.showError('La hora de inicio es obligatoria');
      return;
    } else {
      hourIndex = Number(hourIndex);
    }

    const startHour = this.hours()[hourIndex];
    console.log(startHour);
    let endHour = this.calculateEndTime(startHour, hourIndex);

    const payload = {
      ...this.formSaveAppointment.value,
      startTime: startHour,
      endTime: endHour,
      date: this.date()?.date.replaceAll('/', '-'),
      scheduleId: this.scheduleService.signalScheduleConfigResponse().id
    };

    if (this.hasValidationErrors(payload)) return;

    this.appointmentsService.setAppointmentToCreate(payload);
    this.appointmentsService.createAppointment().subscribe({
      next: (response) => {
        console.log('Cita creada', response);
        this.appointmentsService.setAppointments([...this.appointmentsService.signalAppointments(), response.data!]);
        this.appointmentsService.signalAppointmentsForDate.set([...this.appointmentsService.signalAppointmentsForDate(), response.data!]);
        this.modalService.close();
      },
      error: (error) => {
        console.error('Error al crear la cita', error);
      }
    });

  }

  private calculateEndTime(start: string, index: number): string {
    const nextHour = this.hours()[index + 1];
    const interval = this.dayConfig()?.slotInterval ?? 60;

    if (!nextHour) {
      return DateTime.fromFormat(start, 'HH:mm').plus({ minutes: interval }).toFormat('HH:mm');
    }

    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = nextHour.split(':').map(Number);
    const difference = (endH - startH) * 60 + (endM - startM);

    return difference === interval
      ? nextHour
      : DateTime.fromObject({ hour: startH, minute: startM }).plus({ minutes: interval }).toFormat('HH:mm');
  }

  private hasValidationErrors(appointment: any): boolean {
    if (appointment.startTime === '') {
      this.alertService.showError('La hora de inicio es obligatoria');
      return true;
    }
    if (!appointment.date) {
      this.alertService.showError('La fecha es obligatoria');
      return true;
    }
    if (!appointment.startTime) {
      this.alertService.showError('La hora de inicio es obligatoria');
      return true;
    }
    if (!appointment.endTime) {
      this.alertService.showError('La hora de fin es obligatoria');
      return true;
    }

    const { firstName, lastName, phoneNumber } = appointment.customer;
    if (!firstName || !lastName || !phoneNumber) {
      this.alertService.showError('Datos del cliente incompletos');
      return true;
    }
    console.log(appointment);
    return false;
  }

  onPhoneNumberChange(event: Event): void {
    this.searching.set(true);
    const value = (event.target as HTMLInputElement).value;

    if (value.length < 10) {
      this.showPhoneError = true;
      this.clearCustomerFields();
      return;
    }else{
      this.showPhoneError = false;
    }

    this.customerService.query.set(value);

    this.customerService.searchCustomers().subscribe({
      next: ({ success, data }) => {
        if (!data) return;
        if (success && data?.data.length > 0) {
          const customer = data.data[0];
          this.alertService.showSuccess('Cliente encontrado');
          this.searching.set(false);
          this.formSaveAppointment.get('customer')?.patchValue({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email
          });
          this.showPhoneError = false;
        } else {
          this.alertService.showError('No se encontró ningún cliente');
          this.clearCustomerFields();
        }
      },
      error: (err) => {
        console.error('Error al buscar cliente:', err);
        this.alertService.showError('Error al buscar cliente');
      }
    });
  }

  private clearCustomerFields(): void {
    this.formSaveAppointment.get('customer')?.patchValue({
      firstName: '',
      lastName: '',
      email: ''
    });
  }
}
