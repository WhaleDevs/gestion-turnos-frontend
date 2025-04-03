import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormValidationService } from '@app/shared/services/form-validation.service';

@Component({
  selector: 'app-form-error',
  template: `@if(errorMessage){<p class="errorMessage">{{ errorMessage }}</p>}`,
  imports: [],
  styles: [`
    .errorMessage {
      color: red;
      font-size: var(--font-size-l);
      margin-top: 4px;
      font-weight: 500;
    }
  `]
})
export class FormErrorComponent {
  @Input() control!: AbstractControl;

  constructor(private validationService: FormValidationService) {}

  get errorMessage(): string | null {
    return this.validationService.getErrorMessage(this.control);
  }
}
