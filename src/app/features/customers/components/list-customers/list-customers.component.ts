import { Component, inject } from '@angular/core';
import { CustomersService } from '../../services/customers.service';
import { CustomerResponse } from '../../models/customer.response';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { ModalService } from '@app/shared/services/modal.service';
import { UpdateCustomerComponent } from '../update-customer/update-customer.component';

@Component({
  selector: 'app-list-customers',
  standalone: true,
  imports: [CommonModule, NgIcon],
    providers: [provideIcons({heroPencilSquare, heroTrash})],
  templateUrl: './list-customers.component.html',
  styleUrl: './list-customers.component.scss',
})
export class ListCustomersComponent {
  private modalService = inject(ModalService)
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

  updateCustomer(customer: CustomerResponse) {
    this._customerService.customerForUpdate.next(customer);
    this.modalService.open(UpdateCustomerComponent);
  }

}
