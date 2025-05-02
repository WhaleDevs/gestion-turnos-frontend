import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormValidationService } from '@app/shared/services/form-validation.service';

@Component({
  selector: 'app-form-error',
  template: `<p class="errorMessage">{{ errorMessage }}</p> `,
  imports: [],
  styles: [
    `
      .errorMessage {
        color: var(--error);
        font-size: var(--font-size-s);
        margin-top: var(--margin-m);
        font-weight: 500;
        min-height: var(--font-size-xl);
        visibility: hidden; 
        margin-left: var(--margin-l)
      }

      .errorMessage:not(:empty) {
        visibility: visible; 
      }
    `,
  ],
})
export class FormErrorComponent {
  @Input() control!: AbstractControl;

  constructor(private validationService: FormValidationService) {}

  get errorMessage(): string | null {
    return this.validationService.getErrorMessage(this.control);
  }
}
