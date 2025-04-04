import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {
  private validationMessages: { [key: string]: string } = {
    required: 'Este campo es obligatorio.',
    email: 'Debe ingresar un email válido.',
    minlength: 'El valor es demasiado corto.',
    maxlength: 'El valor es demasiado largo.',
    pattern: 'El formato ingresado no es válido.',
  };

  getErrorMessage(control: AbstractControl): string | null {
    if (!control || !control.errors) return null;

    for (const error in control.errors) {
      if (this.validationMessages[error]) {
        if (error === 'minlength' || error === 'maxlength') {
          return `${this.validationMessages[error]} (mínimo ${control.errors[error].requiredLength} caracteres)`;
        }
        return this.validationMessages[error];
      }
    }
    return null;
  }
}
