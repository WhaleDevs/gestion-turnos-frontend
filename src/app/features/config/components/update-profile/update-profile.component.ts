import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroAtSymbol, heroUserCircle } from '@ng-icons/heroicons/outline';
import { ConfigService } from '../../services/config.service';
import { UpdateProfileDto } from '../../models/updateProfileDto.dto';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';

@Component({
  selector: 'app-update-profile',
  imports: [ReactiveFormsModule, CommonModule, NgIcon, FormErrorComponent],
  providers: [provideIcons({ heroUserCircle, heroAtSymbol })],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss',
})
export class UpdateProfileComponent {
  private _config = inject(ConfigService);
  private fb = inject(FormBuilder);
  isFormEnabled:boolean = true;
  form: FormGroup = this.fb.group({
    firstName: [{ value: '', disabled: true }, [Validators.minLength(2), Validators.maxLength(30)]],
    lastName: [{ value: '', disabled: true }, [Validators.minLength(2), Validators.maxLength(30)]],
    email: [{ value: '', disabled: true }, [Validators.email]],
  });
  

  constructor(){}

  toggleForm(){
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control) {
        if (control.disabled) {
          control.enable();
          this.isFormEnabled=!this.isFormEnabled;
        } else {
          control.disable();
          this.isFormEnabled=!this.isFormEnabled;
        }
      }
    });
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
          console.log('datos updateados');
        },
      });
    }
  }
}
