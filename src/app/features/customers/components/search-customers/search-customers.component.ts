import { Component, inject } from '@angular/core';
import { CustomersService } from '../../services/customers.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroMagnifyingGlass,
  heroPlusCircle,
} from '@ng-icons/heroicons/outline';
import { ModalService } from '@app/shared/services/modal.service';
import { CreateCustomerComponent } from '../create-customer/create-customer.component';

@Component({
  selector: 'app-search-customers',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIcon],
  providers: [provideIcons({ heroPlusCircle, heroMagnifyingGlass })],
  templateUrl: './search-customers.component.html',
  styleUrl: './search-customers.component.scss',
})
export class SearchCustomersComponent {
  private _customerService = inject(CustomersService);
  private fb = inject(FormBuilder);
  private modalService = inject(ModalService);
  searchCustomerForm: FormGroup = this.fb.group({
    query: [''],
  });

  constructor() {}

  search() {
    if (this.searchCustomerForm.valid) {
      const query = this.searchCustomerForm.get('query')?.value;
      this._customerService.searchCustomers(query, '1', '10').subscribe({});
    }
  }

  createCustomer() {
    this.modalService.open(CreateCustomerComponent);
  }
}
