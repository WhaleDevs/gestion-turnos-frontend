import { Component, computed, inject, Output, EventEmitter } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXCircle } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-appointment',
  imports: [NgIcon],
  providers: [provideIcons({ heroXCircle })],
  template: `
  <section class="appointment-container">
    <div class="info-appointment">
        <p>{{appointment()?.startTime}}</p>
        <p>{{appointment()?.customer?.firstName}}, {{appointment()?.customer?.lastName}}</p>
        <p>{{appointment()?.description}}</p>
        <p>{{appointment()?.status}}</p>
    </div>
    <button class="close-button" (click)="closeAppointmentEvent()"><ng-icon class="icon icon-medium" name="heroXCircle"></ng-icon></button>
  </section>  
    `,
  styles: `
    .appointment-container{
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 16px;
        padding: 16px;
        border-radius: 8px;
        height: 300px;
        width: 300px;
        background-color: var(--muted);
    }
    .info-appointment{
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: var(--foreground);
    }
    .close-button{
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--muted);
        border-radius: 8px;
        height: 40px;
        width: 40px;
        cursor: pointer;
        border: none;
        gap: 8px;
        color: var(--foreground);
    }
  `,
})
export class AppointmentComponent {
  @Output() closeAppointment = new EventEmitter<void>();
  appointmentsService = inject(AppointmentsService);
  appointment = computed(() => this.appointmentsService.signalAppointmentSelected());

  closeAppointmentEvent() {
    this.appointmentsService.signalAppointmentSelected.set(null);
    this.closeAppointment.emit();
  }
}
