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
  managers: WritableSignal<ManagerResponse[]> = signal([]);

  getManagers(): Observable<ApiResponse<ManagerResponse[]>>{
    return this.http.get<ApiResponse<ManagerResponse[]>>(`${this.url}/users`).pipe(
      tap((response: ApiResponse<ManagerResponse[]>) => {
        if(response.success && response.data){
          this.managers.set(response.data);
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

}
