import { Component, inject } from '@angular/core';
import { CustomersService } from '../../services/customers.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomerForCreationDto } from '../../models/customerForCreationDto.dto';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {  heroEnvelope, heroPhone, heroUserCircle,  } from '@ng-icons/heroicons/outline';
import { ModalService } from '@app/shared/services/modal.service';
import { AlertService } from '@app/shared/services/alert.service';

@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIcon],
  providers: [provideIcons({heroUserCircle, heroPhone, heroEnvelope})],
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.scss',
})
export class CreateCustomerComponent {
  private _customerService = inject(CustomersService);
  private _alertService = inject(AlertService);
  private modalService = inject(ModalService);
  private fb = inject(FormBuilder);
  customerForm: FormGroup = this.fb.group({
    firstName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
    ],
    lastName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
    ],
    phoneNumber: [
      '',
      [Validators.required, Validators.pattern(/^(\+54\d{9,10}|\d{10,11})$/)],
    ],
    email: ['', [Validators.email]],
  });

  constructor() {}

  create() {
    if (this.customerForm.valid) {
      const customerDto: CustomerForCreationDto = {
        firstName: this.customerForm.value.firstName,
        lastName: this.customerForm.value.lastName,
        phoneNumber: this.customerForm.value.phoneNumber,
        email: this.customerForm.value.email || undefined,
      };
      console.log('Customer DTO:', customerDto);
      this._customerService.createCustomer(customerDto).subscribe({
        next: () => {
          this._alertService.showSuccess('Cliente agregado!')
          this.modalService.close();
        },
        error: (error) => console.error('Error al crear cliente:', error),
      });
    } else {
      console.log('Formulario inválido');
    }
  }

}
