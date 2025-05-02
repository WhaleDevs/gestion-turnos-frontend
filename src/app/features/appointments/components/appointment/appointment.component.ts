import { Component, computed, inject, linkedSignal } from '@angular/core';
import { AppointmentsService } from '../../services/appointments.service';
import { ModalService } from '@app/shared/services/modal.service';
import { AppointmentResponse, AppointmentStatus } from '../../models/responses/appointments.response';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from '@app/shared/services/alert.service';
import { NgClass } from '@angular/common';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';

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
        <button  class="btn full" (click)="deleteAppointment()">ELIMINAR TURNO</button>
      </div>
  </section>  
    `,
  styles: `
    .btn{
      font-size: var(--font-size-s);
      padding: var(--padding-m);
      box-shadow: none;
      border-radius: var(--border-radius-s);
      border: 1px solid var(--border-light);
      background-color: var(--background-light);
      cursor: pointer;
      width: 100%;
      &:hover{
        background-color: var(--background-muted);
        color: var(--text-light);
      }
    }


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
      border-radius: var(--border-radius-m);
      gap: var(--gap-l);
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

  deleteAppointment() {
    this.modalService.openWithResult(ConfirmDialogComponent, {}, { message: '¿Estás seguro de que querés eliminar este cliente?' }).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.appointmentsService.deleteAppointment().subscribe({
          next: (response) => {
            if (response.success) {
              this.alertService.showSuccess('Turno eliminado correctamente');
              this.appointmentsService.signalAppointments.set(
                this.appointmentsService.signalAppointments().filter(
                  appointment => appointment.id !== this.appointmentsService.signalAppointmentSelected()?.id
                )
              );
              this.closeAppointmentEvent(); 
            }
          }
        });
      }
    });
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

          this.appointment.set(updatedAppointment);

          this.appointmentsService.signalAppointments.update(prev =>
            prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a)
          );

          this.alertService.showSuccess("Estado cambiado correctamente.")
        }
      }
    });
  }
}
