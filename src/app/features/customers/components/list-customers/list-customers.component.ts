import { Component, inject } from '@angular/core';
import { CustomersService } from '../../services/customers.service';
import { CustomerResponse } from '../../models/customer.response';

@Component({
  selector: 'app-list-customers',
  standalone: true,
  imports: [],
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
    });

    this.updateListCustomers();
  }

  updateListCustomers() {
    this._customerService.findAll().subscribe();
  }
}
