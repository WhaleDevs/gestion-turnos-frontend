import { Component, computed, inject, signal } from '@angular/core';
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
  providers: [provideIcons({ heroPencilSquare, heroTrash })],
  templateUrl: './list-customers.component.html',
  styleUrl: './list-customers.component.scss',
})
export class ListCustomersComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private _modalService = inject(ModalService);
  private _customerService = inject(CustomersService);
  private _alertService = inject(AlertService);
  customers = computed(() => this._customerService.customers());
  currentPage = signal(1);
  totalPages = computed(() => this._customerService.totalPages());
  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );
  pageSize = signal(10);
  isMobile = computed(() => this._customerService.isMobile());

  constructor() {}

  ngAfterViewInit(): void {
    this.breakpointObserver
    .observe([`(max-width: 768px)`])
    .subscribe((result) => {
      this._customerService.pageSize.set(this.pageSize());
      this._customerService.currentPage.set(1);
      this._customerService.isMobile.set(result.matches)
    });
  }

  ngOnInit(): void {
    this._customerService.searchCustomers().subscribe();
  }

  deleteCustomer(id: number) {
    console.log(id);
    this._modalService
      .openWithResult(
        ConfirmDialogComponent,
        {},
        {
          message: '¿Estás seguro de que querés eliminar este cliente?',
        }
      )
      .subscribe((confirmed: boolean) => {
        console.log(confirmed);
        if (confirmed) {
          this._customerService.deleteCustomerById(id).subscribe({
            next: () => {
              this._alertService.showSuccess('Cliente eliminado');
            },
          });
        }
      });
  }

  updateCustomer(customer: CustomerResponse) {
    this._customerService.customerForUpdate.next(customer);
    this._modalService.open(UpdateCustomerComponent);
  }

  changePageSize($event: Event) {
    const newSize = parseInt(($event.target as HTMLSelectElement).value, 10);
    this._customerService.pageSize.set(newSize);
    this._customerService.currentPage.set(1);
  }

  navigate(page: number) {
    this._customerService.currentPage.set(page);
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (atBottom && this._customerService.total()>= this.customers().length) {
      this._customerService.currentPage.set(this._customerService.currentPage()+1);
      this._customerService.pageSize.set(this._customerService.pageSize()+4);
    }
  }

}
