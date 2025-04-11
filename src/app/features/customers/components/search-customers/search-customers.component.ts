import { Component, effect, inject, input, signal } from '@angular/core';
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
  queryInput = signal('')
  searchCustomerForm: FormGroup = this.fb.group({
    query: [''],
  });

  constructor() {
    effect(() => {
      this._customerService.query.set( this.queryInput());
    })
  }

  createCustomer() {
    this.modalService.open(CreateCustomerComponent);
  }

  updateQuery(event: Event){
    this.queryInput.set((event.target as HTMLInputElement).value);
  }
}
