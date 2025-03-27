import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@envs/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CustomerResponse, INITIAL_CUSTOMERS } from '../models/customer.response';
import { ApiResponse } from '@app/shared/models/api-response';
import { CustomerForCreationDto } from '../models/CustomerForCreationDto.dto';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  
  private http = inject(HttpClient);
  protected url = environment.API_URL;
  customers:BehaviorSubject<CustomerResponse[]> = new BehaviorSubject<CustomerResponse[]>(INITIAL_CUSTOMERS);
  constructor() { }

  createCustomer(customerDto: CustomerForCreationDto):Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.url}/customers`, customerDto);
  }

  findAll():Observable<ApiResponse<CustomerResponse[]>>{
    return this.http.get<ApiResponse<CustomerResponse[]>>(`${this.url}/customers`).pipe(
      tap((response: ApiResponse<CustomerResponse[]>) => {
        if (response.success && response.data) {
          this.customers.next(response.data); 
        }
      })
    )
  }

  searchCustomers(query:string): Observable<ApiResponse<CustomerResponse[]>>{
    return this.http.get<ApiResponse<CustomerResponse[]>>(`${this.url}/customers/search?query=${query}`).pipe(
      tap((response: ApiResponse<CustomerResponse[]>) => {
        if (response.success && response.data) {
          this.customers.next(response.data);
        }
      })
    )
  }

  deleteCustomerById(id:number): Observable<ApiResponse<void>>{
    return this.http.delete<ApiResponse<void>>(`${this.url}/customers/${id}`).pipe(
      tap((response: ApiResponse<void>) => {
        if (response.success) {
          const updatedCustomers = this.customers.getValue().filter(customer => customer.id !== id);
          this.customers.next(updatedCustomers);
        }
      })
    );
  }
}
