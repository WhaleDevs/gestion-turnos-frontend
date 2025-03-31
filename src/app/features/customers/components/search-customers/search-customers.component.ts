import { Component, inject } from '@angular/core';
import { CustomersService } from '../../services/customers.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerView } from '../../models/customerView.enum';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass, heroPlusCircle } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-search-customers',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIcon],
  providers: [provideIcons({heroPlusCircle, heroMagnifyingGlass})],
  templateUrl: './search-customers.component.html',
  styleUrl: './search-customers.component.scss',
})
export class SearchCustomersComponent {
  private _customerService = inject(CustomersService);
  private fb = inject(FormBuilder);
  searchCustomerForm: FormGroup = this.fb.group({
    query: ['', Validators.required],
  });
  
  constructor() {}

  search() {
    if (this.searchCustomerForm.valid) {
      const query = this.searchCustomerForm.get('query')?.value;
      if (query) {
        this._customerService.searchCustomers(query).subscribe({
          /**Mostrar Errores uwu */
        });
      }
    }
  }

  createCustomer() {
    this._customerService.currentView.next(CustomerView.CREATE);
  }
}
