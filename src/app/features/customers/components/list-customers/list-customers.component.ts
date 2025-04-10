import { Component, inject, signal } from '@angular/core';
import { CustomersService } from '../../services/customers.service';
import { CustomerResponse } from '../../models/customer.response';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { ModalService } from '@app/shared/services/modal.service';
import { UpdateCustomerComponent } from '../update-customer/update-customer.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { AlertService } from '@app/shared/services/alert.service';

@Component({
  selector: 'app-list-customers',
  standalone: true,
  imports: [CommonModule, NgIcon],
    providers: [provideIcons({heroPencilSquare, heroTrash})],
  templateUrl: './list-customers.component.html',
  styleUrl: './list-customers.component.scss',
})
export class ListCustomersComponent {
  private _modalService = inject(ModalService);
  private _customerService = inject(CustomersService);
  private breakpointObserver = inject(BreakpointObserver);
  private _alertService = inject(AlertService);
  customers: CustomerResponse[] = [];

  isMobile = signal(false);

  constructor() {
    this.breakpointObserver.observe([`(max-width: 767px)`])
      .subscribe(result => this.isMobile.set(result.matches));
  }

  ngOnInit(): void {
    this._customerService.customers.subscribe((customers) => {
      this.customers = customers;
      console.log(customers);
    });
    console.table(this.customers);
    this.updateListCustomers();
    console.table(this.customers);
  }

  updateListCustomers() {
    this._customerService.searchCustomers('', '1', '10').subscribe();
  }

  deleteCustomer(id: number) {
    console.log(id);
    this._modalService
    .openWithResult(ConfirmDialogComponent, {}, {
      message: '¿Estás seguro de que querés eliminar este cliente?'
    })
    .subscribe((confirmed: boolean) => {
      console.log(confirmed);
      if (confirmed) {
        this._customerService.deleteCustomerById(id).subscribe({
          next: () => {
            this._alertService.showSuccess('Cliente eliminado');
          }
        });
      }
    });
  }

  updateCustomer(customer: CustomerResponse) {
    this._customerService.customerForUpdate.next(customer);
    this._modalService.open(UpdateCustomerComponent);
  }

}
