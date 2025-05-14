import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@envs/environment.development';
import { ChangePasswordDto } from '../models/changePasswordDto.dto';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '@app/shared/models/api-response';
import { UpdateProfileDto } from '../models/updateProfileDto.dto';
import { GeneralSettingsResponse, INITIAL_GENERAL_SETTINGS } from '../models/generalSettings.response';
import { GeneralSettingsForUpdateDto } from '../models/generalSettingsForUpdateDto.dto';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private http = inject(HttpClient);
  protected url = environment.API_URL;
  generalSettings = signal<GeneralSettingsResponse>(INITIAL_GENERAL_SETTINGS);
  constructor() {}

  changePassword(request: ChangePasswordDto):Observable<ApiResponse<void>>{
    return this.http.patch<ApiResponse<void>>(`${this.url}/auth/change-password`, request);
  }

  updateProfile(request: UpdateProfileDto): Observable<ApiResponse<void>>{
    return this.http.patch<ApiResponse<void>>(`${this.url}/users/update-profile`, request);
  }

  getGeneralSettings(): Observable<ApiResponse<GeneralSettingsResponse>>{
    return this.http.get<ApiResponse<GeneralSettingsResponse>>(`${this.url}/general-settings`).pipe(
      tap((response: ApiResponse<GeneralSettingsResponse>) => {
        if (response.success && response.data) {
          this.generalSettings.set(response.data);
        }
      })
    );
  }

  updateGeneralSettings(request: GeneralSettingsForUpdateDto): Observable<ApiResponse<GeneralSettingsResponse>>{
    return this.http.patch<ApiResponse<GeneralSettingsResponse>>(`${this.url}/general-settings`, request).pipe(
      tap((response: ApiResponse<GeneralSettingsResponse>) => {
        if (response.success && response.data) {
          this.generalSettings.set(response.data);
        }
      })
    );
  }
}
