import { Component, computed, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCheckCircle, heroExclamationCircle, heroInformationCircle, heroXCircle } from '@ng-icons/heroicons/outline';
import { Alert } from '@app/utils/alert.interface';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({
    error: heroXCircle, 
    success: heroCheckCircle, 
    warning: heroExclamationCircle, 
    info: heroInformationCircle
  })],
  
  template: `
  @let alert = this.alert();
  @if(alert) {
    <div class="alert" [ngClass]="'alert-' + alert.type" role="alert">
    <ng-icon class="icon-medium" [name]="alert.type"></ng-icon>
      {{ alert.message }}
    </div>
  }`,

  styles: [`
    .alert {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: slideIn 0.3s ease-in-out;
      font-size: var(--font-size-l);
      z-index: 2000;
      @media screen and (max-width: 768px) {
        top: 65px;
        right: 5px;
      }
    }

    .close-button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0 5px;
    }

    .alert-success {
      background-color: #d4edda;
      border-color: #c3e6cb;
      color: #155724;
    }

    .alert-error {
      background-color: #f8d7da;
      border-color: #f5c6cb;
      color: #721c24;
    }

    .alert-warning {
      background-color: #fff3cd;
      border-color: #ffeeba;
      color: #856404;
    }

    .alert-info {
      background-color: #cce5ff;
      border-color: #b8daff;
      color: #004085;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `]
})export class AlertComponent implements OnDestroy {
  alert = computed(() => this.alertService.alertSubject());
  private alertService = inject(AlertService);

  private clearTimeoutFn: (() => void) | null = null;

  constructor() {
    effect(() => {
      const currentAlert = this.alert();

      // Limpia el timeout anterior
      if (this.clearTimeoutFn) {
        this.clearTimeoutFn();
        this.clearTimeoutFn = null;
      }

      // Si hay alerta, seteamos un nuevo timeout
      if (currentAlert) {
        const timeout = setTimeout(() => this.closeAlert(), 3000);
        this.clearTimeoutFn = () => clearTimeout(timeout);
      }
    });
  }

  ngOnDestroy() {
    if (this.clearTimeoutFn) {
      this.clearTimeoutFn();
    }
  }

  closeAlert() {
    this.alertService.clear();
  }
}
