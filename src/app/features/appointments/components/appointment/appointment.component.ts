import { Component, computed, inject, linkedSignal } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { ModalService } from '@app/shared/services/modal.service';
import { AppointmentStatus } from '../../models/responses/appointments.response';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '@app/shared/services/alert.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-appointment',
  imports: [NgClass, FormsModule],
  template: `
  <section class="appointment-container">
    <h2 class="title">INFORMACION DEL TURNO</h2>
    <div class="info-appointment">
        <p>{{appointment()?.startTime}}</p>
        <p>{{appointment()?.customer?.firstName}}, {{appointment()?.customer?.lastName}}</p>
        <p>{{appointment()?.description}}</p>
        <p>{{appointment()?.customer?.phoneNumber}}</p>
        <select 
          class="select small" 
          name="status" 
          id="status" 
          [ngModel]="appointment()?.status"
          (ngModelChange)="onStatusChange($event)"
          [ngClass]="appointment()?.status">
          @for (statusOption of status; track $index) {
            <option [value]="statusOption">
              {{ statusOption }}
            </option>
          } 
        </select>
      </div>
  </section>  
    `,
  styles: `
    .appointment-container{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--padding-m);
        gap: var(--gap-m);
        height: 100%;
        width: 100%;
    }
    .info-appointment{
      display: flex;
      flex-direction: column;
      padding: var(--padding-m);
      border: 1px solid var(--border-light);
      border-radius: var(--border-radius-m);
      gap: var(--gap-m);
      height: 100%;
      width: 100%;
    }
  `,
})
export class AppointmentComponent {
  private appointmentsService = inject(AppointmentsService);
  private modalService = inject(ModalService);
  private alertService = inject(AlertService);
  appointment = linkedSignal(() => this.appointmentsService.signalAppointmentSelected());
  status: AppointmentStatus[] = [
    AppointmentStatus.RESERVADO,
    AppointmentStatus.TERMINADO,
    AppointmentStatus.AUSENTE
  ];
  closeAppointmentEvent() {
    this.appointmentsService.signalAppointmentSelected.set(null);
    this.modalService.close();
  }

  onStatusChange(newStatus: AppointmentStatus) {
    const appointment = this.appointment();
    if (!appointment?.id) return;

    this.appointmentsService.updateAppointmentStatus(appointment.id, newStatus).subscribe({
      next: (res) => {
        if (res.success) {
          const updatedAppointment = {
            ...appointment,
            status: newStatus
          };

          this.appointment.update(() => updatedAppointment);

          this.appointmentsService.signalAppointmentsForDate.update(prev =>
            prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a)
          );

          this.alertService.showSuccess("Estado cambiado correctamente.")
        }
      },
      error: (err) => {
        console.error('Error al actualizar el estado', err);
      }
    });
  }
}
