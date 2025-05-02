import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroAtSymbol, heroChevronDown, heroChevronUp, heroUserCircle } from '@ng-icons/heroicons/outline';
import { ConfigService } from '../../services/config.service';
import { UpdateProfileDto } from '../../models/updateProfileDto.dto';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { AlertService } from '@app/shared/services/alert.service';
import { SessionService } from '@app/auth/services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-profile',
  imports: [ReactiveFormsModule, CommonModule, NgIcon, FormErrorComponent],
  providers: [provideIcons({ heroUserCircle, heroAtSymbol, heroChevronDown, heroChevronUp })],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss',
})
export class UpdateProfileComponent {
  private _config = inject(ConfigService);
  private _alertService = inject(AlertService);
  private fb = inject(FormBuilder);
  private sessionService = inject(SessionService);
  private router = inject(Router);
  isAccordionOpen = false;
  isFormEnabled = true;


  form: FormGroup = this.fb.group({
    firstName: ['', [Validators.minLength(2), Validators.maxLength(30)]],
    lastName: ['', [Validators.minLength(2), Validators.maxLength(30)]],
    email: ['', [Validators.email]],
  });
  

  constructor(){}


  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  updateProfile() {
    if (this.form.valid) {
      const request: UpdateProfileDto = {};
      const { firstName, lastName, email } = this.form.value;

      if (firstName) request.firstName = firstName;
      if (lastName) request.lastName = lastName;
      if (email) request.email = email;

      if (Object.keys(request).length === 0) {
        alert('No hay datos para actualizar');
        return;
      }

      this._config.updateProfile(request).subscribe({
        next: () => {
          this._alertService.showSuccess('Datos actualizados, por seguridad, por favor inicie sesión de nuevo');
          this.sessionService.clearSession();
          this.router.navigate(['/auth/login']);
          this.form.reset();
        },
      });
    }
  }
}
