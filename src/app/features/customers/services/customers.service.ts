import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@envs/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CustomerResponse, INITIAL_CUSTOMERS } from '../models/customer.response';
import { ApiResponse } from '@app/shared/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private http = inject(HttpClient);
  protected url = environment.API_URL;
  customers:BehaviorSubject<CustomerResponse[]> = new BehaviorSubject<CustomerResponse[]>(INITIAL_CUSTOMERS);
  constructor() { }

  findAll():Observable<ApiResponse<CustomerResponse[]>>{
    return this.http.get<ApiResponse<CustomerResponse[]>>(`${this.url}/customers`).pipe(
      tap((response: ApiResponse<CustomerResponse[]>) => {
        if (response.success && response.data) {
          this.customers.next(response.data); // Actualiza el BehaviorSubject con los nuevos datos
        }
      })
    )
  }

}
