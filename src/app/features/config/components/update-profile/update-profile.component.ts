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

@Component({
  selector: 'app-update-profile',
  imports: [ReactiveFormsModule, CommonModule, NgIcon],
  providers: [provideIcons({ heroUserCircle, heroAtSymbol })],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss',
})
export class UpdateProfileComponent {
  private _config = inject(ConfigService);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    firstName: ['', [Validators.minLength(2), Validators.maxLength(30)]],
    lastName: ['', [Validators.minLength(2), Validators.maxLength(30)]],
    email: ['', [Validators.email]],
  });

  updateProfile() {
    if (this.form.valid) {
       // Construimos el objeto request solo con los valores definidos
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
      }
    })
      
    }
  }
}
