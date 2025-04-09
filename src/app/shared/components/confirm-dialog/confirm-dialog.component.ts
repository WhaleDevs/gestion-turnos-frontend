import { Component, inject, Input } from '@angular/core';
import { ModalService } from '@app/shared/services/modal.service';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="confirm-dialog">
      <h2>Confirmación</h2>
      <p>{{ message }}</p>
      <button (click)="confirm()">Sí</button>
      <button (click)="close()">No</button>
    </div>
  `,
  styles: [`
    .confirm-dialog { text-align: center; }
    button { margin: 5px; }
  `]
})
export class ConfirmDialogComponent {
  @Input() message = '¿Estás seguro?';
  modalClose: (result: boolean) => void = () => {}; 

  confirm() {
    this.modalClose(true); 
  }

  close() {
    this.modalClose(false);
  }
}
