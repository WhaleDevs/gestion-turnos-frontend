import { Component } from '@angular/core';
import { ListCustomersComponent } from "./components/list-customers/list-customers.component";
import { SearchCustomersComponent } from "./components/search-customers/search-customers.component";
import { CreateCustomerComponent } from "./components/create-customer/create-customer.component";

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [ListCustomersComponent, SearchCustomersComponent, CreateCustomerComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {}
