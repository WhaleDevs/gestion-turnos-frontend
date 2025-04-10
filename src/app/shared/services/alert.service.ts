import { Injectable, signal } from '@angular/core';
import { Alert } from '@app/utils/alert.interface';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alertSubject = signal<Alert | null>(null);

  showSuccess(message: string) {
    this.alertSubject.set({ type: 'success', message });
  }

  showError(message: string) {
    this.alertSubject.set({ type: 'error', message });
  }

  showWarning(message: string) {
    this.alertSubject.set({ type: 'warning', message });
  }

  showInfo(message: string) {
    this.alertSubject.set({ type: 'info', message });
  }

  clear() {
    this.alertSubject.set(null);
  }
}
