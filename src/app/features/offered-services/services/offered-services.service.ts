import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { OfferedResponse } from '../models/offeredResponse';
import { OfferedDtoForCreation } from '../models/offeredDtoForCreation';

import { ApiResponse } from '@app/shared/models/api-response';
import { environment } from '@envs/environment.development';
import { OfferedDtoForUpdate } from '../models/offeredDtoForUpdate';

@Injectable({
  providedIn: 'root'
})
export class OfferedServicesService {

  private http = inject(HttpClient);

  url = `${environment.API_URL}/offered-services`;
  signalOfferedServices = signal<OfferedResponse[]>([]);
  signalOfferedToEdit = signal<OfferedDtoForUpdate | null>(null);
  signalOfferedToEditFlag = signal<boolean>(false);
  signalOfferedServiceToCreate = signal<OfferedDtoForCreation>({
    title: '',
    description: '',
    price: 0
  });

  constructor() {
  }

  getOfferedServices(): Observable<ApiResponse<OfferedResponse[]>> {
    return this.http.get<ApiResponse<OfferedResponse[]>>(this.url).pipe(
      tap((response) => {
        console.log('OfferedServices response:', response);
        this.signalOfferedServices.set(response.data!);
        console.log('Signal after update:', this.signalOfferedServices());
      })
    );
  }

  createOfferedService(): Observable<ApiResponse<OfferedResponse>> {
    return this.http.post<ApiResponse<OfferedResponse>>(this.url, this.signalOfferedServiceToCreate()).pipe(
      tap((response) => {
        this.signalOfferedServices.update((services) => [...services, response.data!]);
      })
    );
  }

  deleteOfferedService(id: number): Observable<void> {
    const params = new HttpParams().set(':serviceId', id);
    return this.http.delete<void>(this.url, { params }).pipe(
      tap(() => {
        this.signalOfferedServices.update((services) =>
          services.filter((service) => service.id !== id)
        );
      })
    );
  }

  updateOfferedService(): Observable<ApiResponse<OfferedResponse>> {
    const dto = this.signalOfferedToEdit();
    console.log(dto);
    if (!dto) throw new Error('No se ha seteado ningún servicio a editar');
    return this.http.patch<ApiResponse<OfferedResponse>>(this.url, dto).pipe(
      tap((response) => {
        this.signalOfferedServices.update((services) =>
          services.map((s) => s.id === response.data!.id ? response.data! : s)
        );
      })
    );
  }

  setOfferedServiceToCreate(service: OfferedDtoForCreation): void {
    this.signalOfferedServiceToCreate.set(service);
  }

  setOfferedToEdit(service: OfferedDtoForUpdate | null): void {
    this.signalOfferedToEdit.set(service);
  }

  setOfferedToEditFlag(flag: boolean): void {
    this.signalOfferedToEditFlag.set(flag);
  }
}
