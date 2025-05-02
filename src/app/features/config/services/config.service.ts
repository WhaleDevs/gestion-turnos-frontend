import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@envs/environment.development';
import { ChangePasswordDto } from '../models/changePasswordDto.dto';
import { Observable } from 'rxjs';
import { ApiResponse } from '@app/shared/models/api-response';
import { UpdateProfileDto } from '../models/updateProfileDto.dto';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private http = inject(HttpClient);
  protected url = environment.API_URL;
  constructor() {}

  changePassword(request: ChangePasswordDto):Observable<ApiResponse<void>>{
    return this.http.patch<ApiResponse<void>>(`${this.url}/auth/change-password`, request);
  }

  updateProfile(request: UpdateProfileDto): Observable<ApiResponse<void>>{
    return this.http.patch<ApiResponse<void>>(`${this.url}/users/update-profile`, request);
  }
}
