import { HttpClient, HttpParams } from '@angular/common/http';
import {
  computed,
  effect,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { environment } from '@envs/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  CustomerResponse,
  INITIAL_CUSTOMER_FOR_UPDATE,
  INITIAL_CUSTOMERS,
} from '../models/customer.response';
import { ApiResponse } from '@app/shared/models/api-response';
import { CustomerForCreationDto } from '../models/customerForCreationDto.dto';
import { CustomerForUpdateDto } from '../models/customerForUpdateDto.dto';
import { PaginatedResponse } from '@app/shared/models/paginated.response';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private http = inject(HttpClient);
  protected url = environment.API_URL;
  customers: WritableSignal<CustomerResponse[]> = signal(INITIAL_CUSTOMERS);
  customersToScroll: WritableSignal<CustomerResponse[]> =
    signal(INITIAL_CUSTOMERS);
  customerForUpdate: BehaviorSubject<CustomerResponse> =
    new BehaviorSubject<CustomerResponse>(INITIAL_CUSTOMER_FOR_UPDATE);
  currentPage = signal(1);
  pageSize = signal(10);
  query = signal('');
  total = signal(0);
  totalPages = computed(() => Math.ceil(this.total() / this.pageSize()));
  paginationParams = computed(() => ({
    currentPage: this.currentPage(),
    pageSize: this.pageSize(),
    query: this.query(),
  }));

  isLoading = signal(false);
  hasMore = signal(true);

  constructor() {
    effect(() => {
      this.searchCustomers().subscribe();
    });
  }

  createCustomer(
    customerDto: CustomerForCreationDto
  ): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.url}/customers`,
      customerDto
    );
  }

  searchCustomers(): Observable<
    ApiResponse<PaginatedResponse<CustomerResponse>>
  > {
    const params = new HttpParams()
      .set('query', this.paginationParams().query)
      .set('page', this.paginationParams().currentPage.toString())
      .set('limit', this.paginationParams().pageSize.toString());

    return this.http
      .get<ApiResponse<PaginatedResponse<CustomerResponse>>>(
        `${this.url}/customers/search`,
        { params }
      )
      .pipe(
        tap((response: ApiResponse<PaginatedResponse<CustomerResponse>>) => {
          if (response.success && response.data) {
            this.customers.set(response.data.data);
            this.total.set(response.data.total);
          } else {
          }
        })
      );
  }

  updateCustomer(
    customerDto: CustomerForUpdateDto
  ): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(
      `${this.url}/customers`,
      customerDto
    );
  }

  deleteCustomerById(id: number): Observable<ApiResponse<void>> {
    return this.http
      .delete<ApiResponse<void>>(`${this.url}/customers/${id}`)
      .pipe(
        tap((response: ApiResponse<void>) => {
          if (response.success) {
            this.customers.set(
              this.customers().filter((customer) => customer.id !== id)
            );
          }
        })
      );
  }
}
