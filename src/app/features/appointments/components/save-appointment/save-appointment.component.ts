import { Component, computed, inject } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroClock, heroPlus, heroUserCircle, heroPhone, heroAtSymbol, heroMapPin, heroIdentification, heroChatBubbleBottomCenterText } from '@ng-icons/heroicons/outline';
import { ScheduleDayConfigResponse } from '@app/features/schedule/models/responses/schedule.response';
import { ScheduleService } from '@app/features/schedule/services/schedule.service';

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
  date = computed(() => this.appointmentsService.signalDateSelected());
  dayConfig = computed(() => this.scheduleService.signalScheduleConfigResponse().daysConfig.find((day: ScheduleDayConfigResponse) => day.day === this.date()?.dayName) || null);
  hours: string[] = [];
  formSaveAppointmen!: FormGroup;

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

  
  ngOnInit(): void {
    this.hours = this.generateHours(this.dayConfig()?.startTime ?? '', this.dayConfig()?.endTime ?? '');
  }

  generateHours(startTime: string, endTime: string): string[] {
    const hoursEnabled = this.appointmentsService.signalHoursEnabled();
    const interval = this.dayConfig()?.slotInterval ?? 60; 
    const hours: string[] = [];
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
  
    let currentTime = new Date();
    currentTime.setHours(startHours, startMinutes, 0, 0);
  
    const endTimeObj = new Date();
    endTimeObj.setHours(endHours, endMinutes, 0, 0);
  
    while (currentTime < endTimeObj) {
      hours.push(currentTime.toTimeString().slice(0, 5)); // HH:MM formato
      currentTime.setMinutes(currentTime.getMinutes() + interval);
    }
  
    return hours.filter(hour => !hoursEnabled.includes(hour));
  }
  
  onSubmit(): void {
    const hourStartIndex = Number(this.formSaveAppointmen.get('startTime')?.value);
    const hourStartSelected = this.hours[hourStartIndex];
    const hourEndSelected = this.hours[hourStartIndex + 1]; 
    this.formSaveAppointmen.patchValue({
      startTime: hourStartSelected,
      endTime: hourEndSelected
    });
    console.log('Formulario', this.formSaveAppointmen.value);
    this.appointmentsService.setAppointmentToCreate(this.formSaveAppointmen.value);
    this.appointmentsService.createAppointment().subscribe({
      next: (response) => {
        console.log('Cita creada', response);
      },
      error: (error) => {
        console.error('Error al crear la cita', error);
      }
    });
  }
  


}
