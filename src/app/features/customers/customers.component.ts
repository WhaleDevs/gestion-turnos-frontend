import { Component } from '@angular/core';
import { ListCustomersComponent } from "./components/list-customers/list-customers.component";

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [ListCustomersComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})
export class CustomersComponent {}
