import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { heroChevronDown, heroChevronUp, heroEye, heroEyeSlash, heroLockClosed } from '@ng-icons/heroicons/outline';
import { ConfigService } from '../../services/config.service';
import { ChangePasswordDto } from '../../models/changePasswordDto.dto';
import { StatusButton } from '@app/utils/types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { FormErrorComponent } from "../../../../shared/components/form-error/form-error.component";

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, CommonModule, NgIcon, FormErrorComponent],
  providers: [provideIcons({ heroEyeSlash, heroEye, heroLockClosed, heroChevronDown, heroChevronUp})],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  private _config = inject(ConfigService);
  private fb = inject(FormBuilder);
  protected statusButtonOne: StatusButton = 'hidePassword';
  protected statusButtonTwo: StatusButton = 'hidePassword';
  protected statusButtonThree: StatusButton = 'hidePassword';
  isAccordionOpen = false;
  isFormEnabled = true;

  form: FormGroup = this.fb.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
    newPasswordRepeat: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]]
  })

  constructor(){}

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  changePassword(){
    if(this.form.valid){
      if(this.form.value.newPassword !== this.form.value.newPasswordRepeat){
        alert('Las contraseñas no coinciden papu');
        return;
      }

      const request: ChangePasswordDto = {
        newPassword: this.form.value.newPassword,
        oldPassword: this.form.value.oldPassword
      }

      this._config.changePassword(request).subscribe({
        next: () => alert('Nueva contraseña perfecta padre'),
      })
    }
  }

  showPassword(number: number) {
    switch (number) {
      case 1:
        this.statusButtonOne = this.statusButtonOne === 'showPassword' ? 'hidePassword' : 'showPassword';
        break;
      case 2:
        this.statusButtonTwo = this.statusButtonTwo === 'showPassword' ? 'hidePassword' : 'showPassword';
        break;
      case 3:
        this.statusButtonThree = this.statusButtonThree === 'showPassword' ? 'hidePassword' : 'showPassword';
        break;
      default:
        console.warn("Número inválido:", number);
    }
  }
  
}
