import { HttpClient } from '@angular/common/http';
import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '@envs/environment.development';
import { INITIAL_MANAGERS, ManagerResponse } from '../models/manager.response';
import { Observable, take, tap } from 'rxjs';
import { ApiResponse } from '@app/shared/models/api-response';
import { ManagerForCreationDto } from '../models/managerForCreationDto.dto';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private http = inject(HttpClient);
  protected url = environment.API_URL;
  managers: WritableSignal<ManagerResponse[]> = signal(INITIAL_MANAGERS);

  constructor(){
    effect(() => {
      this.getManagers().subscribe();
    })
  }

  getManagers(): Observable<ApiResponse<ManagerResponse[]>>{
    return this.http.get<ApiResponse<ManagerResponse[]>>(`${this.url}/users`).pipe(
      tap((response: ApiResponse<ManagerResponse[]>) => {
        if(response.success && response.data){
          this.managers.set(response.data)
          /* console.table(this.managers()); */
        }
      })
    );
  }

  delete(id:number):Observable<ApiResponse<void>>{
    return this.http.delete<ApiResponse<void>>(`${this.url}/users/${id}`).pipe(
      tap((response: ApiResponse<void>) => {
        if(response.success){
          this.managers.set(this.managers().filter(manager => manager.id !== id)) 
        }
      })
    );
  }

  create(request:ManagerForCreationDto): Observable<ApiResponse<ManagerResponse>>{
    return this.http.post<ApiResponse<ManagerResponse>>(`${this.url}/auth/create-manager`, request).pipe(
      tap((response: ApiResponse<ManagerResponse>) => {
        if(response.success && response.data){
          const newManagers= [...this.managers(), response.data]
          this.managers.set(newManagers)
        }
      })
    )
  }

  /* searchCustomers(): Observable<
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
              if (this.isMobile()) {
                this.updateMobile(response);
              } else {
                this.customers.set(response.data.data);
                this.total.set(response.data.total);
              }
            } else {
            }
          })
        );
    } */
}
