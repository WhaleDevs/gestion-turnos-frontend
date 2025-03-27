import { Component } from '@angular/core';
import { ListCustomersComponent } from "./components/list-customers/list-customers.component";
import { SearchCustomersComponent } from "./components/search-customers/search-customers.component";
import { CreateCustomerComponent } from "./components/create-customer/create-customer.component";
import { UpdateCustomerComponent } from "./components/update-customer/update-customer.component";

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [ListCustomersComponent, SearchCustomersComponent, CreateCustomerComponent, UpdateCustomerComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {}
