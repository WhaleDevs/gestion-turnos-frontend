import { Component, inject, Input } from '@angular/core';
import { ModalService } from '@app/shared/services/modal.service';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="confirm-dialog">
      <h2>Confirmación</h2>
      <p>{{ message }}</p>
      <div class="button-container">
        <button class="btn large success" (click)="confirm()">Confirmar</button>
        <button class="btn large error" (click)="close()">Cancelar</button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog { 
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--gap-m);
      text-align: center; 
    }
    
    h2{
      color: var(--primary);
      font-size: var(--font-size-h2);
      margin: 0;
    }

    p{
      font-size: var(--font-size-xl);
    }

    .button-container{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: var(--gap-m);
    }
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
