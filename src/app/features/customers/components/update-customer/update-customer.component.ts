import { Component, inject } from '@angular/core';
import { CustomersService } from '../../services/customers.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomerForUpdateDto } from '../../models/customerForUpdateDto.dto';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {  heroEnvelope, heroPhone, heroUserCircle,  } from '@ng-icons/heroicons/outline';
import { ModalService } from '@app/shared/services/modal.service';
import { AlertService } from '@app/shared/services/alert.service';
import { FormErrorComponent } from "../../../../shared/components/form-error/form-error.component";

@Component({
  selector: 'app-update-customer',
  imports: [ReactiveFormsModule, CommonModule, NgIcon, FormErrorComponent],
  providers: [provideIcons({heroUserCircle, heroPhone, heroEnvelope})],
  templateUrl: './update-customer.component.html',
  styleUrl: './update-customer.component.scss'
})
export class UpdateCustomerComponent {
  private _customerService = inject(CustomersService);
  private modalService = inject(ModalService);
  private _alertService = inject(AlertService);
  private fb = inject(FormBuilder);
  customerForm: FormGroup = this.fb.group({
    id:0,
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    phoneNumber: ['', [ Validators.required, Validators.pattern(/^(\+54\d{9,10}|\d{10,11})$/)]],
    email: ['', [Validators.email]]
  });

  ngOnInit() {
    this._customerService.customerForUpdate.subscribe((customer) => {
      if (customer) {
        this.customerForm.patchValue(customer);
      }
    });
  }

  update(){
    if (this.customerForm.valid) {
      const customerDto: CustomerForUpdateDto = {
        id: this.customerForm.value.id,
        firstName: this.customerForm.value.firstName,
        lastName: this.customerForm.value.lastName,
        phoneNumber: this.customerForm.value.phoneNumber,
        email: this.customerForm.value.email || undefined, 
      };
      console.log('Customer DTO:', customerDto);
      this._customerService.updateCustomer(customerDto).subscribe({
        next: (response) => {
          this._alertService.showSuccess('Cliente modificado!')
          this.modalService.close();
        },
        error: (error) => console.error('Error al crear cliente:', error),
      });
    } else {
      console.log('Formulario inválido');
    }
  }

}
