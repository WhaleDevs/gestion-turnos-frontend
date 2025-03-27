import { Component, inject } from '@angular/core';
import { CustomersService } from '../../services/customers.service';
import { CustomerResponse } from '../../models/customer.response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-customers.component.html',
  styleUrl: './list-customers.component.scss',
})
export class ListCustomersComponent {
  private _customerService = inject(CustomersService);
  customers: CustomerResponse[] = [];

  constructor() {}

  ngOnInit(): void {
    this._customerService.customers.subscribe((customers) => {
      this.customers = customers;
      console.log(customers);
    });

    this.updateListCustomers();
  }

  updateListCustomers() {
    this._customerService.findAll().subscribe();
  }

  deleteCustomer(id: number) {
    /*Preguntar si quiere eliminarlo uwu */
    this._customerService.deleteCustomerById(id).subscribe({
      next: () => {
        /**Alerta success */
      }
    })
  }
}
