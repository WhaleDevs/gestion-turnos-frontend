import { Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroEyeSlash, heroEye, heroLockClosed, heroAtSymbol, heroUserCircle } from '@ng-icons/heroicons/outline';
import { StatusButton, StatusForm } from 'src/app/utils/types';

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule, NgIcon],
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  providers: [provideIcons({ heroEyeSlash, heroEye, heroLockClosed, heroAtSymbol, heroUserCircle})]
})
export class AuthFormComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private route = inject(Router);

  @Input() title: string = 'Formulario';
  @Input() buttonText: string = 'Enviar';
  @Input() isRegister: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();

  protected statusButton: StatusButton = 'hidePassword';
  protected statusForm: StatusForm = 'No tienes cuenta? Regístrate aquí';
  
  form: FormGroup = this.fb.group({
    email: ['', [
      Validators.required, 
      Validators.email, 
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
    ]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isRegister']) {
      if (this.isRegister && !this.form.contains('name')) {
        this.form.addControl('firstName', this.fb.control('', [Validators.required]));
        this.form.addControl('lastName', this.fb.control('', [Validators.required]));
        this.statusForm = 'Ya tienes cuenta? Iniciar Sesión aquí';
      } else if (!this.isRegister && this.form.contains('name')) {
        this.form.removeControl('firstName');
        this.form.removeControl('lastName');
        this.statusForm = 'No tienes cuenta? Regístrate aquí';
      }
    }
  }

  showPassword() {
    this.statusButton = this.statusButton === 'showPassword' ? 'hidePassword' : 'showPassword';
  }

  submit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    }else{
      console.log('Formulario inválido');
      this.form.markAllAsTouched();
    }
  }

  changeForm() {
    this.route.navigate([this.isRegister ? 'auth/login' : 'auth/register']);
  }
}
