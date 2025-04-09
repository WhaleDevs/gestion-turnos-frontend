import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroClock, heroPlus, heroUserCircle, heroPhone, heroAtSymbol, heroMapPin, heroIdentification, heroChatBubbleBottomCenterText } from '@ng-icons/heroicons/outline';
import { ScheduleDayConfigResponse } from '@app/features/schedule/models/responses/schedule.response';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';
import { ModalService } from '@app/shared/services/modal.service';
import { DateTime } from 'luxon';
import { AlertService } from '@app/shared/services/alert.service';
import { CustomersService } from '@app/features/customers/services/customers.service';

@Component({
  selector: 'app-save-appointment',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  providers: [provideIcons({ heroClock, heroPlus, heroUserCircle, heroChatBubbleBottomCenterText, heroPhone, heroAtSymbol, heroMapPin, heroIdentification })],
  templateUrl: './save-appointment.component.html',
  styleUrl: './save-appointment.component.scss'
})

export class SaveAppointmentComponent {
  private appointmentsService = inject(AppointmentsService);
  private scheduleService = inject(ScheduleService);
  private modalService = inject(ModalService);
  private alertService = inject(AlertService);
  private customerService = inject(CustomersService);
  date = computed(() => this.appointmentsService.signalDateSelected());
  dayConfig = computed(() => this.scheduleService.signalScheduleConfigResponse().daysConfig.find((day: ScheduleDayConfigResponse) => day.day === this.date()?.dayName) || null);
  hours = computed(() => this.appointmentsService.signalHoursForDate());
  phoneNumber = input('');
  formSaveAppointmen!: FormGroup;
  searching = signal(false);
  showError: boolean = true;

  constructor(private fb: FormBuilder) {
    this.formSaveAppointmen = this.fb.group({
      startTime: ['', Validators.required],
      endTime: [''],
      date: ['', Validators.required],
      description: ['', Validators.required],
      scheduleId: ['', Validators.required],
      customer: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        email: ['', Validators.required]
      })
    });
  }



  onSubmit(): void {
    const hourStartIndex = Number(this.formSaveAppointmen.get('startTime')?.value);
    const hourStartSelected = this.hours()[hourStartIndex];
    let hourEndSelected = this.hours()[hourStartIndex + 1];
    const interval = this.dayConfig()?.slotInterval ?? 60;
    if (!hourEndSelected) {
      hourEndSelected = DateTime.fromFormat(hourStartSelected, 'HH:mm').plus({ minutes: interval }).toFormat('HH:mm');
    } else {
      const [startHours, startMinutes] = hourStartSelected.split(':').map(Number);
      const [endHours, endMinutes] = hourEndSelected.split(':').map(Number);
      const minutesDifference = (endHours - startHours) * 60 + (endMinutes - startMinutes);

      if (minutesDifference !== interval) {
        hourEndSelected = DateTime.fromObject({ hour: startHours, minute: startMinutes }).plus({ minutes: interval }).toFormat('HH:mm');
      }
    }

    const appointmentPayload = {
      ...this.formSaveAppointmen.value,
      startTime: hourStartSelected,
      endTime: hourEndSelected,
      date: this.date()?.date.replaceAll('/', '-'),
      scheduleId: this.scheduleService.signalScheduleConfigResponse().id
    };

    this.appointmentsService.setAppointmentToCreate(appointmentPayload);
    this.appointmentsService.createAppointment().subscribe({
      next: (response) => {
        this.appointmentsService.setAppointments([...this.appointmentsService.signalAppointments(), response.data!]);
        this.appointmentsService.signalAppointmentsForDate.set([...this.appointmentsService.signalAppointmentsForDate(), response.data!]);
        this.modalService.close();
      },
    });
  }


  onPhoneNumberChange(event: Event) {
    const phoneNumber = (event.target as HTMLInputElement).value;
    if (phoneNumber.length < 10) {
      this.showError = true;
      this.formSaveAppointmen.get('customer')?.patchValue({
        firstName: '',
        lastName: '',
        email: ''
      });
      return;
    } else {
      this.customerService.searchCustomers(phoneNumber).subscribe({
        next: (response) => {
          this.showError = false;
          console.log(response);
          if (response.success && response.data && response.data.length > 0) {
            this.alertService.showSuccess('Cliente encontrado');
            this.searching.set(false);
            this.formSaveAppointmen.get('customer')?.patchValue({
              firstName: response.data[0].firstName,
              lastName: response.data[0].lastName,
              email: response.data[0].email
            });
          }
          if(!response.success || !response.data || response.data.length === 0) {
            this.alertService.showError('No se encontro ningun cliente con el numero de telefono');
            this.formSaveAppointmen.get('customer')?.patchValue({
              firstName: '',
              lastName: '',
              email: ''
            });
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }
}
